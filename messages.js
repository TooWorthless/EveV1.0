const msgs = {
    ru: {
        start: "Hello!",
        regProcess: {
            start: "To start using me you need to register!\nFirstly, select your language:",
            login: "Напиши имя:",
            email: "Теперь напиши свой имейл:",
            phone: "Укажи свой номер телефона ☎️ в международном формате пример “+972,+7,+38…”:",
            direction: "Каким мастером ты являешься?",
            directions: [
                "Мастер Маникюра и педикюра", 
                "Мастер маникюра", 
                "Мастер Педикюра", 
                "Мастер Медицинского педикюра",
                "Мастер Бровист",
                "Мастер по Ресничкам Lashmaker",
                "Мастер Парикмахер",
                "Мастер Макияжа",
                "Мастер Перманентного макияжа"
            ],
            place: "И в последнем пункте кажи свой город проживания:",
            status: null,
            successfully: "Вы успешно зарегистрированы!\nДля Начала работы нажмите на кнопку “Меню” и выберите интересующую вас социальную сеть"
        },
        errors: {
            inProcessing: "Сейчас происходит обработка другого вопроса, ожидайте!",
            errProcessing: "Ошибка генерации!"
        },
        menu: {
            menuBtn: "📜 Меню",
            profileBtn: "🖼 Профиль",
            profileChangeBtn: "⚙️ Изменить профиль"
        },
        profileInfo: {
            login: "Профиль пользователя ",
            language: ":\n\nЯзык: ",
            email: "\nИмейл: ",
            phone: "\nНомер телефона: ",
            direction: "\nНаправление: ",
            place: "\nГород проживания: "
        },
        changeText: "Изменить:",
        successfullyChanged: "Успешно изменено!",
        changeProfileInfo: [
            [ {text: "👤Изменить имя", callback_data: "Изменить имя"}, {text: "📃Изменить язык", callback_data: "Изменить язык"} ],
            [ {text: "📨Изменить имейл", callback_data: "Изменить имейл"}, {text: "📞Изменить номер телефона", callback_data: "Изменить номер телефона"} ],
            [ {text: "🧩Изменить направление", callback_data: "Изменить направление"}, {text: "🏠Изменить место проживания", callback_data: "Изменить место проживания"} ]
        ],
        changeProfileOptions: [ 
            {name: "login", text: "Изменить имя"}, 
            {name: "language", text: "Изменить язык"}, 
            {name: "email", text: "Изменить имейл"}, 
            {name: "phone", text: "Изменить номер телефона"}, 
            {name: "direction", text: "Изменить направление"},
            {name: "place", text: "Изменить место проживания"}
        ],
        instagram: {
            menuText: "Перед вами список возможностей Евы:\n"+
            "1) Кнопка : Reals - Ева напишет для вас сразу 3 идеи для ежедневного рилс.\n"+
            "2) Кнопка : AD Reals - Ева напишет для вас сразу 3 идеи для рекламного рилс.\n"+
            "3) Кнопка : Stories - Ева напишет для вас сразу 3 идеи для ежедневного сторис.\n"+
            "4) Кнопка : AD Stories - Ева напишет для вас сразу 3 идеи для рекламного сторис.\n"+
            "5) Кнопка : Post - Ева напишет для вас сразу 3 идеи для ваших постов.\n"+
            "6) Кнопка : AD Post - Ева напишет для вас сразу 3 идеи для рекламных постов.\n"+
            "7) Кнопка : Оформление шапки профиля - Ева напишет для вас хороший пример оформления шапки профиля в Инстаграм для мастера вашего направления.\n"+
            "8) Кнопка : Система лояльности клиентов - Ева напишет для вас сразу 3 идеи для создания вашей системы лояльности клиентов.\n"+
            "9) Кнопка : Коммуникация с клиентом и клиентский опыт - Ева напишет для вас рекомендации для улучшения клиентского опыта.\n"+
            "10) Кнопка : Сервис - Ева напишет для вас рекомендации по организации отличного сервиса для ваших клиентов.\n",
            menuOptions: [
                [ {text: "Reals", callback_data: "reals"}, {text: "AD Reals", callback_data: "ad_reals"} ],
                [ {text: "Stories", callback_data: "stories"}, {text: "AD Stories", callback_data: "ad_stories"} ],
                [ {text: "Post", callback_data: "post"}, {text: "AD Post", callback_data: "ad_post"} ],
                [ {text: "Оформление шапки профиля", callback_data: "oshp"} ],
                [ {text: "Система лояльности клиентов", callback_data: "slk"} ],
                [ {text: "Коммуникация с клиентом или Клиентский опыт", callback_data: "kwkok"} ],
                [ {text: "Сервис", callback_data: "service"} ]
            ],
            requests: [
                {
                    request: "reals",
                    data: ["Напиши 3 Рилс в инстаграм для ", ""]
                },
                {
                    request: "ad_reals",
                    data: ["Напиши 3 рекламных Рилс в инстаграм для ", ""]
                },
                {
                    request: "stories",
                    data: ["Напиши 3 Сторис в инстаграм для ", ""]
                },
                {
                    request: "ad_stories",
                    data: ["Напиши 3 рекламного Сторис в инстаграмм для ", ""]
                },
                {
                    request: "post",
                    data: ["Напиши 3 поста в инстаграм для ", " с актуальными смайликами и с призывом к действию"]
                },
                {
                    request: "ad_post",
                    data: ["Напиши 3 рекламных поста для инстаграм для ", " с актуальными смайликами с призывом к действию"]
                },
                {
                    request: "oshp",
                    data: ["Напиши совет по оформлению шапки профиля в инстаграм для ", ""]
                },
                {
                    request: "slk",
                    data: ["Разработай систему лояльности клиентов для ", ""]
                },
                {
                    request: "kwkok",
                    data: ["Напиши рекомендации для ", " чтобы улучшить клиентский опыт"]
                },
                {
                    request: "service",
                    data: ["Напиши 10 советов по улучшению сервиса для клиентов ", " кроме самой услуги"]
                },
            ]
        },
        reqMsgs: {
            processing: "Обработка сообщения",
            generating: "Генерация ответа",
            more: "Ещё"
        }
    },
    eng: {
        start: "Hello!",
        regProcess: {
            start: "To start using me you need to register!\nFirstly, select your language:",
            login: "Write your name:",
            email: "Write your email:",
            phone: "Enter your phone number ☎️ in the international format example “+972,+7,+38...”:",
            direction: "What master are you?",
            directions: [
                "Master of Manicure and Pedicure", 
                "Manicurist", 
                "Pedicure Master", 
                "Master of Medical Pedicure",
                "Master Eyebrow",
                "Lashmaker",
                "Master Hairdresser",
                "Makeup Master",
                "Master of Permanent Makeup"
            ],
            place: "Your place:",
            status: null,
            successfully: "You have successfully registered!\nTo get started, press the 'Menu' button and select the social network you are interested in"
        },
        errors: {
            inProcessing: "Now there is a processing of another issue, expect!",
            errProcessing: "Processing error!"
        },
        menu: {
            menuBtn: "📜 Menu",
            profileBtn: "🖼 Profile",
            profileChangeBtn: "⚙️ Change profile",
        },
        profileInfo: {
            login: "Profile of ",
            language: ":\n\nLanguage: ",
            email: "\nEmail: ",
            phone: "\nPhone Number: ",
            direction: "\nDirection: ",
            place: "\nPlace: ",
        },
        changeText: "Change:",
        successfullyChanged: "Changed!",
        changeProfileInfo: [
            [ {text: "👤Change user name", callback_data: "Change user name"}, {text: "📃Change language", callback_data: "Change language"} ],
            [ {text: "📨Change email", callback_data: "Change email"}, {text: "📞Change phone number", callback_data: "Change phone number"} ],
            [ {text: "🧩Change direction", callback_data: "Change direction"}, {text: "🏠Change place", callback_data: "Change place"} ]
        ],
        changeProfileOptions: [ 
            {name: "login", text: "Change user name"}, 
            {name: "language", text: "Change language"}, 
            {name: "email", text: "Change email"}, 
            {name: "phone", text: "Change phone number"}, 
            {name: "direction", text: "Change direction"},
            {name: "place", text: "Change place"}
        ],
        instagram: {
            menuText: "Here is a list of Eve's features:\n"+
            "1) Button : Reals - Eva will write for you 3 ideas for daily rils.\n"+
            "2) Button : AD Reals - Eva will write for you 3 ideas for advertising rils.\n"+
            "3) Button : Stories - Eve will write for you 3 ideas for daily stories.\n"+
            "4) Button : AD Stories - Eva will write for you 3 ideas for advertising stories.\n"+
            "5) Button : Post - Eva will write 3 ideas for your posts for you.\n"+
            "6) Button : AD Post - Eva will write 3 ideas for your advertising posts for you.\n"+
            "7) Button : Profile header design - Eva will write for you a good example of the design of the profile header on Instagram for the master of your direction.\n"+
            "8) Button : Customers loyalty system - Eve will write for you 3 ideas for creating your customer loyalty system.\n"+
            "9) Button : Customer communication and customer experience - Eva will write recommendations for you to improve the customer experience.\n"+
            "10) Button : Service - Eva will write recommendations for you on how to organize an excellent service for your customers.\n",
            menuOptions: [
                [ {text: "Reals", callback_data: "reals"}, {text: "AD Reals", callback_data: "ad_reals"} ],
                [ {text: "Stories", callback_data: "stories"}, {text: "AD Stories", callback_data: "ad_stories"} ],
                [ {text: "Post", callback_data: "post"}, {text: "AD Post", callback_data: "ad_post"} ],
                [ {text: "Profile header design", callback_data: "oshp"} ],
                [ {text: "Customers loyalty system", callback_data: "slk"} ],
                [ {text: "Customer communication and customer experience", callback_data: "kwkok"} ],
                [ {text: "Service", callback_data: "service"} ]
            ],
            requests: [
                {
                    request: "reals",
                    data: ["Write 3 Ryls on Instagram for ", ""]
                },
                {
                    request: "ad_reals",
                    data: ["Write 3 promotional Ryls on Instagram for ", ""]
                },
                {
                    request: "stories",
                    data: ["Write 3 Stories on Instagram for ", ""]
                },
                {
                    request: "ad_stories",
                    data: ["Write 3 Advertising Stories on Instagram for ", ""]
                },
                {
                    request: "post",
                    data: ["Write 3 instagram posts for ", " with topical emoticons and with a call to action"]
                },
                {
                    request: "ad_post",
                    data: ["Write 3 advertising posts for Instagram for ", " with topical emoticons and with a call to action"]
                },
                {
                    request: "oshp",
                    data: ["Write advice on the design of the profile header on Instagram for ", ""]
                },
                {
                    request: "slk",
                    data: ["Develop a customer loyalty system for ", ""]
                },
                {
                    request: "kwkok",
                    data: ["Write recommendations for ", " to improve the customer experience"]
                },
                {
                    request: "service",
                    data: ["Write 10 tips to improve customer service ", " except for the service itself"]
                },
            ]
        },
        reqMsgs: {
            processing: "Message processing",
            generating: "Response generation",
            more: "More"
        }
    }
}


export { msgs };  