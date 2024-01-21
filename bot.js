import dotenv from "dotenv";
dotenv.config();

import TelegramBot from "node-telegram-bot-api";
import "./database/index.js";
import { Account } from "./database/models/account.js";
// import { sendToGpt } from "./gpt.js";
import { send } from "./bing.js";
import { msgs } from "./messages.js";
import { isAdmin } from "./admins.js";




let regProcesses = [];




const bot = new TelegramBot(
    "6415176946:AAHGgaOeYLnmCq-rKaX7LEBQbOUL6VzW5CQ",
    { polling: true }
);




const gptRequests = msgs.ru.instagram.requests;



bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    // const opts = {
    //     reply_to_message_id: msg.message_id,
    //     reply_markup: {
    //         resize_keyboard: true,
    //         one_time_keyboard: true,
    //         keyboard: [ 
    //             [ {text: msgs.ru.menu.menuBtn}, {text: msgs.ru.menu.profileBtn} ], 
    //         ],
    //     }
    // };

    // let newUser = await isNewUser(chatId);
    // if(newUser) {
    //     let regUser = await isInRegProcess(chatId);
    //     if(regUser) {
    //         continueRegProcess(chatId, action);
    //     }
    //     else {
    //         startUserReg(chatId);
    //     }
    // }


    let newUser = await isNewUser(chatId);
    if(newUser) {
        console.log("Start", "newUser");
        await bot.sendMessage(chatId, msgs.ru.start);
        startUserReg(chatId);
    }
    else {
        let acc = await Account.findOne( {tgId: chatId} ).select("-_id -__v");
        let lang = msgs[acc.language];
        const optsMainMenu = {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                keyboard: [ 
                    [ {text: lang.menu.menuBtn}, {text: lang.menu.profileBtn} ], 
                    [ {text: lang.menu.profileChangeBtn} ]
                ],
            }
        };
        await bot.sendMessage(chatId, msgs.ru.start, optsMainMenu);
    }
});


bot.onText(/\/accounts/, async (msg) => {
    const chatId = msg.chat.id;
    
    if(isAdmin(chatId)) {
        let accountsString = "------------\n";

        let accounts = await Account.find({}).select("-_id -__v");

        for(let acc of accounts) {
            accountsString += acc.tgId + "\n" + acc.login + "\n" + acc.email + "\n" + acc.phone + "\n" + acc.direction + "\n" + acc.place + "\n";
            accountsString += "------------\n";
        }
        
        bot.sendMessage(chatId, accountsString);
    }
});


bot.onText(/\/del (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;

    if(isAdmin(chatId)) {
        const id = 0+match[1];

        console.log(typeof id, id);

        try {
            let user = await Account.deleteMany( {tgId: id} );
            console.log(user);
        }
        catch(err) {
            console.log(err.message);
        }
    }
});

bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;

    const chatId = msg.chat.id;
    const query = msg.text;
    
    

    if(action == "ru" || action == "eng") {
        console.log(query);
        let newUser = await isNewUser(chatId);
        if(newUser) {
            let regUser = await isInRegProcess(chatId);
            if(regUser) {
                continueRegProcess(chatId, action);
            }
            else {
                startUserReg(chatId);
            }
        }
        else {
            try {
                let lang;
                try {
                    let accounts = await Account.find({}).select("-_id -__v");
                    for(let acc of accounts) {
                        if(acc.tgId === chatId) {
                            lang = msgs[acc.language];
                            break;
                        }
                    }
                }
                catch(err) {
                    console.log(err.message);
                }
                if(lang === undefined) return;
            
                let acc = await Account.findOne( {tgId: chatId} ).select("-_id -__v");
                for(let changeOpt of lang.changeProfileOptions) {
                    if(acc.status == changeOpt.name) {
                        if(acc.status != "language") return;
                        await Account.updateOne({tgId: chatId}, {$set: { [acc.status]: action, status: "default" }});
                        acc = await Account.findOne( {tgId: chatId} ).select("-_id -__v");
                        lang = msgs[acc.language];
                        const optsMainMenu = {
                            reply_markup: {
                                resize_keyboard: true,
                                one_time_keyboard: true,
                                keyboard: [ 
                                    [ {text: lang.menu.menuBtn}, {text: lang.menu.profileBtn} ], 
                                    [ {text: lang.menu.profileChangeBtn} ]
                                ],
                            }
                        };
                        bot.sendMessage(chatId, lang.successfullyChanged, optsMainMenu);
                        return;
                    }
                }
            }
            catch(err) {
                console.log(err.message);
            }
        }

        return;
    }

    let lang;
    try {
        let accounts = await Account.find({}).select("-_id -__v");
        for(let acc of accounts) {
            if(acc.tgId === chatId) {
                lang = msgs[acc.language];
                break;
            }
        }
    }
    catch(err) {
        console.log(err.message);
    }
    if(lang === undefined) {
        try {
            for(let regProcessIndex in regProcesses) {
                if(regProcesses[regProcessIndex].chatId === chatId) {
                    lang = msgs[regProcesses[regProcessIndex].enteredData.language];
                    break;
                }
            }
        }   
        catch(err) {
            console.log(err.message);
        }
    }

    if(lang === undefined) return;

    let isCorrectDirection = false;
    for(let directionOption of lang.regProcess.directions) {
        if(action === directionOption) {
            isCorrectDirection = true;
            break;
        }
    }
    if(isCorrectDirection) {
        let newUser = await isNewUser(chatId);
        if(newUser) {
            let regUser = await isInRegProcess(chatId);
            if(regUser) {
                continueRegProcess(chatId, action);
            }
            else {
                startUserReg(chatId);
            }
        }
        else {
            try {
                let acc = await Account.findOne( {tgId: chatId} ).select("-_id -__v");
                for(let changeOpt of lang.changeProfileOptions) {
                    if(acc.status == changeOpt.name) {
                        if(acc.status != "direction") return;
                        await Account.updateOne({tgId: chatId}, {$set: { [acc.status]: action, status: "default" }});
                        bot.sendMessage(chatId, lang.successfullyChanged);
                        return;
                    }
                }
            }
            catch(err) {
                console.log(err.message);
            }
        }

        return;
    }

    if(action == "inst") {
        const opts = {
            reply_markup: JSON.stringify({
                inline_keyboard: lang.instagram.menuOptions
            })
        };
        await bot.sendMessage(chatId, lang.instagram.menuText, opts);

        return;
    }

    for(let gptReq of lang.instagram.requests) {
        if(action == gptReq.request) {
            let user = await Account.findOne({tgId: chatId}).select("-_id -__v");

            let botMsg = await bot.sendMessage(chatId, lang.reqMsgs.processing, {
                reply_to_message_id: msg.message_id
            });

            console.log(action, typeof action);
            send(gptReq.data[0] + user.direction + gptReq.data[1], bot, chatId, botMsg.message_id, action, lang);
            
            return;
        }
    }

    for(let changeOpt of lang.changeProfileOptions) {
        if(action == changeOpt.text) {
            if(changeOpt.name != "direction" && changeOpt.name != "language") {
                await bot.sendMessage(chatId, lang.changeText);
            }
            else if(changeOpt.name == "direction") {
                let directionOptions = [];
                for(let directionOption of lang.regProcess.directions) {
                    directionOptions.push([{text: directionOption, callback_data:directionOption}]);
                }
                const opts = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: directionOptions
                    })
                };
                await bot.sendMessage(chatId, lang.changeText, opts);
            }
            else if(changeOpt.name == "language") {
                await bot.sendMessage(chatId, lang.changeText, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [ {text: "Russian 🇷🇺", callback_data: "ru"}, {text: "English 🇬🇧", callback_data: "eng"} ]
                        ]
                    })
                });
                console.log(regProcesses);
            }

            await Account.updateOne({tgId: chatId}, {$set: {status: changeOpt.name}});
        }
    }
});


bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const query = msg.text;

    
    if(query !== undefined && query[0] != "/") {
        let newUser = await isNewUser(chatId);
        if(newUser) {
            let regUser = await isInRegProcess(chatId);
            if(regUser) {
                continueRegProcess(chatId, query);
            }
            else {
                startUserReg(chatId);
            }
        }
        else {
            let lang;
            let accounts = await Account.find({}).select("-_id -__v");
            for(let acc of accounts) {
                if(acc.tgId === chatId) {
                    lang = msgs[acc.language];
                    break;
                }
            }
            if(lang === undefined) return;
            try {
                let acc = await Account.findOne( {tgId: chatId} ).select("-_id -__v");
                for(let changeOpt of lang.changeProfileOptions) {
                    if(acc.status == changeOpt.name) {
                        if(acc.status == "direction" || acc.status == "language") return;
                        await Account.updateOne({tgId: chatId}, {$set: { [acc.status]: query, status: "default" }});
                        bot.sendMessage(chatId, lang.successfullyChanged);
                        return;
                    }
                }
            }
            catch(err) {
                console.log(err.message);
            }
            if(query == lang.menu.menuBtn) {
                const opts = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [ {text: "Instagram", callback_data: "inst"} ]
                            // [ {text: "Instagram", callback_data: "inst"}, {text: "YouTube", callback_data: "youtbe"} ],
                            // [ {text: "TikTok", callback_data: "tt"}, {text: "Telegram", callback_data: "tg"} ],
                        ],
                    })
                };
                bot.sendMessage(chatId, lang.menu.menuBtn+":", opts);
            }
            else if(query == lang.menu.profileBtn) {
                try {
                    let acc = await Account.findOne( {tgId: chatId} ).select("-_id -__v");
                    let accString = lang.profileInfo.login +
                    acc.login + lang.profileInfo.language +
                    acc.language + lang.profileInfo.email + 
                    acc.email + lang.profileInfo.phone + 
                    acc.phone + lang.profileInfo.direction + 
                    acc.direction + lang.profileInfo.place + 
                    acc.place;
                    bot.sendMessage(chatId, accString);
                }
                catch(err) {
                    console.log(err.message);
                }
            }
            else if(query == lang.menu.profileChangeBtn) {
                const opts = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: lang.changeProfileInfo
                    })
                };
                bot.sendMessage(chatId, lang.menu.profileChangeBtn, opts);
            }
        }
    }

    // if(query !== undefined && query[0] != "/") {
    //     console.log(query[0]);
    //     sendToGpt(query, bot, chatId, msgId);
    // }
});





async function startUserReg(id) {
    regProcesses.push(
        {
            chatId: id,
            enteredData: {
                tgId: id,
                language: null,
                login: null,
                email: null,
                phone: null,
                direction: null,
                place: null,
                status: null
            },
            step: "language"
        }
    )
    // await bot.sendMessage(id, "Что бы начать использовать меня тебе нужно пройти регистрацию!\nДля начала напиши своё имя:");
    await bot.sendMessage(id, msgs.ru.regProcess.start, {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [ {text: "Russian 🇷🇺", callback_data: "ru"}, {text: "English 🇬🇧", callback_data: "eng"} ]
            ]
        })
    });
}





async function isNewUser(id) {
    let accounts = await Account.find({}).select("-_id -__v");
    console.log("isNewUser", accounts);
    
    let result = true;

    for(let acc of accounts) {
        if(acc.tgId === id) {
            result = false;
            break;
        }
    }
    console.log(result);
    return result;
}



async function isInRegProcess(id) {
    let isInReg = false;
    for(let regProcess of regProcesses) {
        if(regProcess.chatId == id) {
            isInReg = true;
            break;
        }
    }
    return isInReg;
}

async function continueRegProcess(id, query) {
    let userIndex;

    for(let regProcessIndex in regProcesses) {
        if(regProcesses[regProcessIndex].chatId == id) {
            userIndex = regProcessIndex;
            break;
        }
    }

    if(userIndex === undefined) return;
    let nowUserStatus = regProcesses[userIndex].step;

    let lang;
    if(nowUserStatus != "language") lang = msgs[regProcesses[userIndex].enteredData.language];

    switch (nowUserStatus) {
        case "language":
            regProcesses[userIndex].enteredData.language = query;
            lang = msgs[regProcesses[userIndex].enteredData.language];
            await bot.sendMessage(id, lang.regProcess.login);
            regProcesses[userIndex].step = "login";
            break;

        case "login":
            regProcesses[userIndex].enteredData.login = query;
            await bot.sendMessage(id, lang.regProcess.email);
            regProcesses[userIndex].step = "email";
            break;

        case "email":
            regProcesses[userIndex].enteredData.email = query;
            await bot.sendMessage(id, lang.regProcess.phone);
            regProcesses[userIndex].step = "phone";
            break;

        case "phone":
            regProcesses[userIndex].enteredData.phone = query;
            let directionOptions = [];
            for(let directionOption of lang.regProcess.directions) {
                directionOptions.push([{text: directionOption, callback_data:directionOption}]);
            }
            const opts = {
                reply_markup: JSON.stringify({
                    inline_keyboard: directionOptions
                })
            };
            await bot.sendMessage(id, lang.regProcess.direction, opts);
            regProcesses[userIndex].step = "direction";
            break;

        case "direction":
            let isCorrectDirection = false;
            for(let directionOption of lang.regProcess.directions) {
                if(query === directionOption) {
                    isCorrectDirection = true;
                    break;
                }
            }
            if(!isCorrectDirection) return;
            else {
                regProcesses[userIndex].enteredData.direction = query;
                await bot.sendMessage(id, lang.regProcess.place);
                regProcesses[userIndex].step = "place";
            }
        break;

        case "place":
            regProcesses[userIndex].enteredData.place = query;
            
            // console.log(regProcesses[userIndex].enteredData);

            let userData = regProcesses[userIndex].enteredData;

            let newUser = await Account.create(
                {
                    tgId: userData.tgId,
                    language: userData.language,
                    login: userData.login,
                    email: userData.email,
                    phone: userData.phone,
                    direction: userData.direction,
                    place: userData.place,
                    status: "default"
                }
            );
            const optsMainMenu = {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    keyboard: [ 
                        [ {text: lang.menu.menuBtn}, {text: lang.menu.profileBtn} ], 
                        [ {text: lang.menu.profileChangeBtn} ]
                    ],
                }
            };
            bot.sendMessage(id, lang.regProcess.successfully, optsMainMenu);
            console.log(newUser);

            regProcesses.splice(userIndex, 1);
        break;
    }
}

