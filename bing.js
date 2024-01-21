import dotenv from "dotenv";
dotenv.config();

import puppeteer from "puppeteer";
import fs from "fs";
import ncpLib from "ncp";




let ncp = ncpLib.ncp;




let queries = []




async function getBingAnswer(query, bot, chatId, messageId, action, lang) {
    let page; 
    let tmpPath = `./tmp/${chatId}`;



    let queryIndex;


    for(let userQueryIndex in queries) {
        if(queries[userQueryIndex].chatId == chatId) {
            queryIndex = userQueryIndex;
            if(queries[queryIndex].status != "inProcess") {
                queries[queryIndex].status = "inProcess";
                break;
            }
            else {
                await bot.editMessageText(lang.errors.inProcessing, {
                    chat_id: chatId,
                    message_id: messageId
                });
                return;
            }
        }
    }

    if(queryIndex === undefined) {
        queries.push({
            chatId: chatId,
            status: "inProcess"
        });
        queryIndex = queries.length-1;
    }



    let browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        // executablePath: "./node_modules/chromium/lib/chromium/chrome-win/chrome.exe",
        executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-infobars",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--ignore-certificate-errors",
        "--no-first-run",
        "--no-service-autorun",
        "--password-store=basic",
        "--system-developer-mode",
        "--mute-audio",
        "--disable-default-apps",
        "--no-zygote",
        "--disable-accelerated-2d-canvas",
        "--disable-web-security"
        ],
        permissions: ['interest-cohort'],
        ignoreHTTPSErrors: true,
        userDataDir: tmpPath,
        chromiumSandbox: false,
        defaultViewport: null,
        ignoreDefaultArgs: [
        "--disable-extensions",
        "--enable-automation",
        "--disable-component-extensions-with-background-pages"
        ]
    });


    page = await browser.newPage();


    await page.setBypassCSP(true);

    await page.setExtraHTTPHeaders({
        "x-openai-assistant-app-id": "",
        "accept-language": "en-US,en;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        origin: "https://chat.openai.com",
        referer: "https://chat.openai.com/chat",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
    });

    await page.setJavaScriptEnabled(true);

    await page.setOfflineMode(false);

    await page.setCacheEnabled(true);
    
    //Установка случайных куки
    await page.setCookie({
        name: 'session_id',
        value: '12345',
        domain: 'example.com',
        path: '/',
        expires: Date.now() + 3600000,
        secure: true,
        sameSite: 'None',
    });


    await page.goto("https://www.bing.com/", 
        {
            waitUntil: "networkidle2"
        }
    );


    try {
        // await page.waitForSelector("li[id=\"codex\"]");
        
        // const bingChatLink = await page.evaluate(() => {
        //     let res = document.querySelectorAll("li[id=\"codex\"] a");
        //     res = res[0].getAttribute("href");
        //     return res;
        // });
        // await page.goto("https://www.bing.com" + bingChatLink, 
        // {
        //     waitUntil: "networkidle2"
        // });
        https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx
        await page.goto("https://www.bing.com" + `/search?q=${query.split(" ").join("+")}&showconv=1&FORM=hpcodx`, 
        {
            waitUntil: "networkidle2"
        });

        await page.waitForTimeout(1000);
        // const creativeModeBtn = 
        await page.evaluate(() => {
            let result = document.querySelector("cib-serp").
            shadowRoot.querySelector("cib-conversation").
            shadowRoot.querySelector("cib-welcome-container").
            shadowRoot.querySelector("cib-tone-selector").
            shadowRoot.querySelector("button.tone-creative");
            result.click();
        });
        
        // await page.screenshot(
        //     {
        //         path: "./screenshot.png"
        //     }
        // )
        const ta = await page.waitForSelector("textarea");
        console.log(ta);
        // await ta.type(query+"\n", {delay: 0.05});
        await bot.editMessageText(lang.reqMsgs.generating, {
            chat_id: chatId,
            message_id: messageId,
            // reply_markup: {
            //     inline_keyboard: [
            //         [ { text: lang.reqMsgs.more, callback_data: action } ]
            //     ],
            // }
        });
        await page.waitForTimeout(15000);

        let iter = 0;
        let res = "";
        let previousRes = "";
        let interv = setInterval(waitAnswer, 2500);
 

        async function waitAnswer() {
            if(iter <= 5) {
                try {
                    res = await page.evaluate(() => {
                        let result = document.querySelector("cib-serp").
                        shadowRoot.querySelector("cib-conversation").
                        shadowRoot.querySelector("cib-chat-turn").
                        shadowRoot.querySelectorAll("cib-message-group");
                        

                        result = result[result.length-1];
                        console.log("Result cib-message-group.length-1", result);

                        result = result.shadowRoot.querySelectorAll("cib-message");
                        console.log("Result cib-message", result);

                        let resultStr = "";

                        for(let resIndex = 0; resIndex < result.length; resIndex++) {
                            try {
                                let tempRes = result[resIndex].shadowRoot.querySelector("cib-shared div.content");
                                if(tempRes != null) resultStr += tempRes.textContent + "\n";
                            }
                            catch(err) {
                                console.log(err.message);
                            }
                        }

                        resultStr = resultStr.split("bing").join("Eva 1.0").split("Bing").join("Eva 1.0");

                        if(resultStr != null) {
                            return resultStr;
                        }
                        else {
                            return undefined;
                        }
                    });
                    if(res === undefined) {
                        res = previousRes;
                    }
                    if(res != previousRes) {
                        console.log(res)
                        await bot.editMessageText(res, {
                            chat_id: chatId,
                            message_id: messageId,
                            // reply_markup: {
                            //     inline_keyboard: [
                            //         [ { text: lang.reqMsgs.more, callback_data: action } ]
                            //     ],
                            // }
                        });
                        previousRes = res;
                        iter = 0;
                    }
                }
                catch(err) {
                    console.log(iter, err.message);
                }
                finally {
                    iter++;
                }
            }
            else {
                if(res != "") {
                    await bot.editMessageText(res+"\n", {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: [
                                [ { text: lang.reqMsgs.more, callback_data: action } ]
                            ],
                        }
                    });
                }
                else {
                    await bot.editMessageText(lang.errors.errProcessing, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: [
                                [ { text: lang.reqMsgs.more, callback_data: action } ]
                            ],
                        }
                    });
                }
                clearInterval(interv);
                queries[queryIndex].status = null;
                await page.close();
                await browser.close();
            }
        }
    }
    catch(err) {
        console.log(err.message);
    }

}



async function send(query, bot, chatId, messageId, action, lang) {
    let tmpPath = `./tmp/${chatId}`;

    if (!fs.existsSync(`./tmp`)) {
        fs.mkdirSync(`./tmp`);
    }

    if (!fs.existsSync(tmpPath)) {
        ncp("./mainTmp", tmpPath, (err) => {
            if (err) console.error(err); 
            else console.log('done!');
        });

        setTimeout(async () => {
            await getBingAnswer(query, bot, chatId, messageId, action, lang);
        }, 10000);
    }
    else {
        await getBingAnswer(query, bot, chatId, messageId, action, lang);
    }
}

export { send };