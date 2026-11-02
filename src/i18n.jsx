import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const LANGS = [
  { id: "uz", label: "UZ", name: "Oʻzbekcha" },
  { id: "ru", label: "RU", name: "Русский" },
  { id: "en", label: "EN", name: "English" },
];

const uz = {
  meta: {
    title: "Formo — oʻz sport formangni yarat | Futbolka va shortik",
    description: "Formo — sport formasini oʻzingiz yarating: ism, raqam, rang va logo. Futbolka va shortik komplekti 1–2 kunda tayyor boʻladi, eshigingizgacha yetkazamiz.",
    keywords: "forma buyurtma, sport forma, futbolka va shortik, ismli forma, raqamli forma, futbol formasi, Oʻzbekiston, forma konstruktori, Formo",
    locale: "uz_UZ",
    ogAlt: "Formo: CHEMPION 17 yozuvli futbolka va shortik, «Oʻz formangni yarat»",
    service: "Buyurtma asosida sport formasi: futbolka va shortik",
  },
  nav: ["Jarayon", "Imkoniyatlar", "Konstruktor", "Qanday ishlaydi"],
  navAria: "Asosiy",
  langAria: "Til",
  order: "Buyurtma berish",
  menuOpen: "Menyuni ochish",
  menuClose: "Menyuni yopish",
  logoHome: "Formo — bosh sahifa",
  logoTop: "Formo — yuqoriga",
  skip: "Oʻtkazib yuborish",
  skipLink: "Asosiy mazmunga oʻtish",
  hero: {
    kicker: "Matodan maydongacha",
    lines: ["Oʻz", "formangni", "yarat"],
    accent: 1,
    lead: "Ism, raqam, rang, shrift va logo — hammasi sizning qoʻlingizda. Formo dizayningizni sexga yuboradi, tayyor futbolka va shortik esa eshigingizgacha yetib keladi.",
    cta: "Formaga buyurtma berish",
    see: "Jarayonni koʻrish",
    cue: "Pastga aylantiring: bitta forma qanday tugʻilishini koʻrsatamiz",
    jerseys: ["OYIM", "DADAM", "ISMING"],
  },
  marquee: ["Ism", "Raqam", "Rang", "Shrift", "Logo", "S dan 3XL gacha", "1–2 kunda tayyor", "Eshigingizgacha"],
  story: {
    aria: "Forma qanday tayyorlanadi",
    step: (n, name) => `${n}-bosqich · ${name}`,
    stepAria: (n, name) => `${n} ${name}`,
    chapters: ["Mato", "Bichish", "Tikish", "Shortik", "Qadoq", "Yetkazish", "Ulashish"],
    items: [
      { title: "Hammasi matodan boshlanadi", text: "Atlas, setka, paxta, poliester — har birini qoʻlda ushlab, choʻzib, sinab koʻramiz. Forma uchun yengil, ter oʻtkazadigan va shaklini yoʻqotmaydigan oq trikotajni tanlaymiz." },
      { title: "Andaza boʻyicha aniq bichamiz", text: "Boʻr bilan andaza chiziladi, qaychi esa chiziqdan chiqmaydi. Har bir oʻyinchining formasi oʻz oʻlchami boʻyicha alohida bichiladi." },
      { title: "Yozuv, raqam va logotip tikiladi", text: "«CHEMPION» yozuvi, 17-raqam va Formo belgisi matoga mustahkam tikiladi. Koʻp marta yuvilgandan keyin ham koʻchib ketmaydi." },
      { title: "Shortik futbolkaga moslashadi", text: "Bitta tugma kifoya: shortik futbolkaning rangi, chiziqlari, belgisi va raqamini oladi. Komplekt yagona uslubda chiqadi." },
      { title: "Sovgʻadek qadoqlaymiz", text: "Forma ehtiyotkorlik bilan taxlanadi va Formo qutisiga joylanadi. Qutini ochishning oʻzi kichik bayram." },
      { title: "Eshigingizgacha yetkazamiz", text: "Kuryer qutini toʻgʻridan-toʻgʻri manzilingizga olib keladi. Buyurtma qayerdaligini ilovadagi «Buyurtmalarim» boʻlimida kuzatasiz." },
      { title: "Endi hamma koʻrsin", text: "Qutini oching, suratga oling va doʻstlaringiz bilan ulashing. Yangi forma bilan yangi gʻalabalar." },
    ],
    cta: "Formaga buyurtma berish",
    play: "Avto koʻrish",
    pause: "Pauza",
    playAria: "Animatsiyani avtomatik koʻrsatish",
    pauseAria: "Avtomatik koʻrsatishni toʻxtatish",
    tapeAria: "Bosqichlar",
  },
  stage: {
    aria: "Formo formasi qanday tayyorlanishi: matodan tortib ijtimoiy tarmoqqa joylashgacha",
    fabrics: ["ATLAS", "SETKA", "PAXTA", "POLIESTER", "OQ TRIKOTAJ"],
    chosen: "TANLANDI",
    champion: "CHEMPION",
    tagline: "OʻZ FORMANGNI YARAT",
    delivered: "Yetkazildi ✓",
    photo: "FOTO",
    justNow: "hozirgina",
    likes: "ta yoqtirish",
    caption: "Yangi formam keldi! 🔥",
    bub1: "Zoʻr chiqibdi! 🔥",
    bub2: "Qayerda tikdirdingiz?",
    bub3: "Formoda, albatta 😎",
    share: "Ulashish",
    match: "Futbolkaga moslashtirish",
    matched: "Moslashtirildi ✓",
  },
  features: {
    kicker: "Imkoniyatlar",
    title: "Ilovada hammasi bir joyda",
    lead: "Dizayn studiyasi, klub formalari, oʻlcham tanlash va buyurtmani kuzatish — Formo ilovasida.",
    items: [
      { title: "Dizayn studiyasi", text: "Rang, old va orqa yozuv, logo — formani oʻzingiz chizasiz." },
      { title: "Klub formalari", text: "Mashhur klublar formalari: ism va raqamingizni qoʻshib, buyurtma qiling." },
      { title: "Futbolka + shortik", text: "Komplekt bir xil uslubda. Shortikka ham raqam qoʻshish mumkin." },
      { title: "Buyurtmalarim", text: "Buyurtma qaysi bosqichda ekanini ilovada koʻrib turasiz." },
    ],
  },
  steps: {
    kicker: "Qanday ishlaydi",
    title: "Toʻrt qadamda tayyor forma",
    items: [
      { title: "Dizaynni tanlang", text: "Oʻz dizayningizni yarating yoki klub formasini tanlang." },
      { title: "Ism va raqam", text: "Futbolka va shortik uchun S dan 3XL gacha oʻlchamni belgilang." },
      { title: "Biz tayyorlaymiz", text: "Buyurtmangiz sexga yuboriladi va 1–2 kunda tayyor boʻladi." },
      { title: "Eshigingizgacha", text: "Tayyor komplekt qadoqlanadi va manzilingizga yetkaziladi." },
    ],
  },
  kit: {
    kicker: "Konstruktor",
    title: "Formangni hoziroq sinab koʻr",
    lead: "Ism va raqamni yozing, rang va qoʻshimcha rangni tanlang — futbolka va shortik shu zahoti oʻzgaradi.",
    viewAria: "Koʻrinish",
    front: "Old tomon",
    back: "Orqa tomon",
    previewAria: "Futbolka va shortik namunasi",
    shuffle: "Tasodifiy ✦",
    shuffleAria: "Tasodifiy forma",
    tabsAria: "Sozlamalar",
    tabs: { text: "Matn", color: "Rang", pattern: "Belgi", size: "Oʻlcham" },
    nameLabel: "Ism yoki matn",
    nameHint: "12 belgigacha",
    numberLabel: "Raqam",
    numberHint: "1 dan 99 gacha",
    shortsTitle: "Shortikka ham raqam",
    shortsSub: "Chap oyoq, old tomonda",
    colorLabel: "Forma rangi",
    trimLabel: "Qoʻshimcha rang",
    logoTitle: "Formo belgisi",
    logoSub: "Chap koʻkrakda, old tomonda",
    sizeLabel: "Futbolka va shortik oʻlchami",
    sizeAria: "Oʻlcham",
    orderSmall: "Buyurtma",
    set: "Futbolka + shortik",
    submit: "Telegram orqali buyurtma",
    copied: "Buyurtma matni nusxalandi — Telegramda chatga joylang va yuboring.",
    manual: "Telegramda shu maʼlumotlarni yozing: ism, raqam, rang va oʻlcham.",
    defaultName: "CHEMPION",
    colors: ["Oq", "Toʻq koʻk", "Zumrad", "Qizil", "Oltin", "Qora", "Koʻk", "Binafsha"],
    trims: ["Toʻq koʻk", "Oltin", "Oq", "Qizil", "Zumrad"],
    presets: ["CHEMPION", "OYIM", "DADAM", "USTOZ", "OLTIN"],
    yes: "ha",
    no: "yoʻq",
    message: (v) => [
      "Assalomu alaykum, FORMO! Forma buyurtma qilmoqchiman:",
      `• Ism: ${v.name}`,
      `• Raqam: ${v.number}`,
      `• Rang: ${v.color}`,
      `• Qoʻshimcha rang: ${v.trim}`,
      `• Formo belgisi: ${v.logo}`,
      `• Oʻlcham: ${v.size}`,
      `• Shortikka raqam: ${v.shorts}`,
      "• Toʻplam: futbolka + shortik",
    ].join("\n"),
  },
  cta: {
    kicker: "Formo ilovasi",
    title: "Jamoangiz yangi formaga tayyormi?",
    text: "Ilova tez orada App Store va Google Playʼda chiqadi. Hozircha buyurtmalarni Telegram orqali qabul qilamiz.",
    telegram: "Telegramda yozish",
    soon: "tez orada",
    storesAria: "Ilova",
    phone: "Oʻz formangni yarat",
  },
  footer: "Oʻz formangni yarat · © 2026 Formo",
};

const ru = {
  meta: {
    title: "Formo — создай свою спортивную форму | Футболка и шорты",
    description: "Formo — создайте спортивную форму сами: имя, номер, цвет и логотип. Комплект из футболки и шорт будет готов за 1–2 дня, доставим до вашей двери.",
    keywords: "заказать форму, спортивная форма, футболка и шорты, форма с именем и номером, футбольная форма, Узбекистан, конструктор формы, Formo",
    locale: "ru_RU",
    ogAlt: "Formo: футболка и шорты с надписью ЧЕМПИОН 17, «Создай свою форму»",
    service: "Спортивная форма на заказ: футболка и шорты",
  },
  nav: ["Процесс", "Возможности", "Конструктор", "Как работает"],
  navAria: "Главное меню",
  langAria: "Язык",
  order: "Заказать",
  menuOpen: "Открыть меню",
  menuClose: "Закрыть меню",
  logoHome: "Formo — на главную",
  logoTop: "Formo — наверх",
  skip: "Пропустить",
  skipLink: "Перейти к содержимому",
  hero: {
    kicker: "От ткани до поля",
    lines: ["Создай", "свою", "форму"],
    accent: 2,
    lead: "Имя, номер, цвет, шрифт и логотип — всё в ваших руках. Formo отправит ваш дизайн в цех, а готовые футболка и шорты приедут к вашей двери.",
    cta: "Заказать форму",
    see: "Смотреть процесс",
    cue: "Листайте вниз: покажем, как рождается одна форма",
    jerseys: ["МАМА", "ПАПА", "ИМЯ"],
  },
  marquee: ["Имя", "Номер", "Цвет", "Шрифт", "Логотип", "От S до 3XL", "Готово за 1–2 дня", "До вашей двери"],
  story: {
    aria: "Как изготавливается форма",
    step: (n, name) => `Этап ${n} · ${name}`,
    stepAria: (n, name) => `${n} ${name}`,
    chapters: ["Ткань", "Крой", "Пошив", "Шорты", "Упаковка", "Доставка", "Поделиться"],
    items: [
      { title: "Всё начинается с ткани", text: "Атлас, сетка, хлопок, полиэстер — каждую ткань мы берём в руки, растягиваем и проверяем. Для формы выбираем лёгкий, дышащий белый трикотаж, который не теряет форму." },
      { title: "Режем точно по лекалу", text: "Мелом наносится выкройка, а ножницы не выходят за линию. Форма каждого игрока кроится отдельно, по его размеру." },
      { title: "Вышиваем надпись, номер и логотип", text: "Надпись «ЧЕМПИОН», номер 17 и знак Formo надёжно вышиваются на ткани. Они не облезают даже после многих стирок." },
      { title: "Шорты подстраиваются под футболку", text: "Достаточно одной кнопки: шорты берут цвет, полосы, знак и номер футболки. Комплект получается в едином стиле." },
      { title: "Упаковываем как подарок", text: "Форма аккуратно складывается и кладётся в коробку Formo. Само открытие коробки — маленький праздник." },
      { title: "Доставим до двери", text: "Курьер привозит коробку прямо по вашему адресу. Где сейчас заказ, смотрите в разделе «Мои заказы» в приложении." },
      { title: "Пусть все увидят", text: "Откройте коробку, сфотографируйте и поделитесь с друзьями. Новая форма — новые победы." },
    ],
    cta: "Заказать форму",
    play: "Авто",
    pause: "Пауза",
    playAria: "Показать анимацию автоматически",
    pauseAria: "Остановить автопоказ",
    tapeAria: "Этапы",
  },
  stage: {
    aria: "Как изготавливается форма Formo: от ткани до публикации в соцсетях",
    fabrics: ["АТЛАС", "СЕТКА", "ХЛОПОК", "ПОЛИЭСТЕР", "ТРИКОТАЖ"],
    chosen: "ВЫБРАНО",
    champion: "ЧЕМПИОН",
    tagline: "СОЗДАЙ СВОЮ ФОРМУ",
    delivered: "Доставлено ✓",
    photo: "ФОТО",
    justNow: "только что",
    likes: "лайков",
    caption: "Новая форма пришла! 🔥",
    bub1: "Круто вышло! 🔥",
    bub2: "Где шили?",
    bub3: "Конечно, в Formo 😎",
    share: "Поделиться",
    match: "Подогнать под футболку",
    matched: "Готово ✓",
  },
  features: {
    kicker: "Возможности",
    title: "В приложении всё в одном месте",
    lead: "Дизайн-студия, клубные формы, выбор размера и отслеживание заказа — в приложении Formo.",
    items: [
      { title: "Дизайн-студия", text: "Цвет, надписи спереди и сзади, логотип — форму вы рисуете сами." },
      { title: "Клубные формы", text: "Формы известных клубов: добавьте своё имя и номер и закажите." },
      { title: "Футболка + шорты", text: "Комплект в одном стиле. Номер можно добавить и на шорты." },
      { title: "Мои заказы", text: "В приложении вы видите, на каком этапе ваш заказ." },
    ],
  },
  steps: {
    kicker: "Как это работает",
    title: "Готовая форма за четыре шага",
    items: [
      { title: "Выберите дизайн", text: "Создайте свой дизайн или выберите форму клуба." },
      { title: "Имя и номер", text: "Укажите размер от S до 3XL для футболки и шорт." },
      { title: "Мы изготавливаем", text: "Заказ отправляется в цех и будет готов за 1–2 дня." },
      { title: "До вашей двери", text: "Готовый комплект упаковывается и доставляется по вашему адресу." },
    ],
  },
  kit: {
    kicker: "Конструктор",
    title: "Примерь свою форму прямо сейчас",
    lead: "Введите имя и номер, выберите цвет и дополнительный цвет — футболка и шорты изменятся мгновенно.",
    viewAria: "Вид",
    front: "Спереди",
    back: "Сзади",
    previewAria: "Образец футболки и шорт",
    shuffle: "Случайно ✦",
    shuffleAria: "Случайная форма",
    tabsAria: "Настройки",
    tabs: { text: "Текст", color: "Цвет", pattern: "Логотип", size: "Размер" },
    nameLabel: "Имя или текст",
    nameHint: "до 12 символов",
    numberLabel: "Номер",
    numberHint: "от 1 до 99",
    shortsTitle: "Номер и на шортах",
    shortsSub: "Левая нога, спереди",
    colorLabel: "Цвет формы",
    trimLabel: "Дополнительный цвет",
    logoTitle: "Знак Formo",
    logoSub: "На левой стороне груди, спереди",
    sizeLabel: "Размер футболки и шорт",
    sizeAria: "Размер",
    orderSmall: "Заказ",
    set: "Футболка + шорты",
    submit: "Заказать через Telegram",
    copied: "Текст заказа скопирован — вставьте его в чат Telegram и отправьте.",
    manual: "Напишите в Telegram эти данные: имя, номер, цвет и размер.",
    defaultName: "ЧЕМПИОН",
    colors: ["Белый", "Тёмно-синий", "Изумрудный", "Красный", "Золотой", "Чёрный", "Синий", "Фиолетовый"],
    trims: ["Тёмно-синий", "Золотой", "Белый", "Красный", "Изумрудный"],
    presets: ["ЧЕМПИОН", "МАМА", "ПАПА", "ТРЕНЕР", "ЗОЛОТО"],
    yes: "да",
    no: "нет",
    message: (v) => [
      "Здравствуйте, FORMO! Хочу заказать форму:",
      `• Имя: ${v.name}`,
      `• Номер: ${v.number}`,
      `• Цвет: ${v.color}`,
      `• Доп. цвет: ${v.trim}`,
      `• Знак Formo: ${v.logo}`,
      `• Размер: ${v.size}`,
      `• Номер на шортах: ${v.shorts}`,
      "• Комплект: футболка + шорты",
    ].join("\n"),
  },
  cta: {
    kicker: "Приложение Formo",
    title: "Ваша команда готова к новой форме?",
    text: "Приложение скоро появится в App Store и Google Play. Пока принимаем заказы через Telegram.",
    telegram: "Написать в Telegram",
    soon: "скоро",
    storesAria: "Приложение",
    phone: "Создай свою форму",
  },
  footer: "Создай свою форму · © 2026 Formo",
};

const en = {
  meta: {
    title: "Formo — design your own sports kit | Shirt and shorts",
    description: "Formo lets you design your own sports kit: name, number, color and logo. The shirt and shorts set is ready in 1–2 days and delivered to your door.",
    keywords: "custom sports kit, custom football jersey, t-shirt and shorts, personalised name and number, jersey designer, Uzbekistan, Formo",
    locale: "en_US",
    ogAlt: "Formo: a shirt and shorts with CHAMPION 17 lettering, “Design your own kit”",
    service: "Custom sports kit: shirt and shorts",
  },
  nav: ["Process", "Features", "Builder", "How it works"],
  navAria: "Main",
  langAria: "Language",
  order: "Order",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  logoHome: "Formo — home",
  logoTop: "Formo — back to top",
  skip: "Skip",
  skipLink: "Skip to content",
  hero: {
    kicker: "From fabric to the pitch",
    lines: ["Create", "your own", "kit"],
    accent: 2,
    lead: "Name, number, color, font and logo — it's all in your hands. Formo sends your design to the workshop, and the finished shirt and shorts arrive at your door.",
    cta: "Order your kit",
    see: "See how it's made",
    cue: "Scroll down: we'll show how a single kit is born",
    jerseys: ["MOM", "DAD", "NAME"],
  },
  marquee: ["Name", "Number", "Color", "Font", "Logo", "S to 3XL", "Ready in 1–2 days", "To your door"],
  story: {
    aria: "How the kit is made",
    step: (n, name) => `Step ${n} · ${name}`,
    stepAria: (n, name) => `${n} ${name}`,
    chapters: ["Fabric", "Cutting", "Sewing", "Shorts", "Packing", "Delivery", "Share"],
    items: [
      { title: "It all starts with fabric", text: "Satin, mesh, cotton, polyester — we hold, stretch and test each one by hand. For a kit we pick light, breathable white knit that keeps its shape." },
      { title: "Cut exactly to the pattern", text: "The pattern is drawn in chalk and the scissors never leave the line. Every player's kit is cut separately, to their own size." },
      { title: "Name, number and logo get stitched on", text: "The “CHAMPION” lettering, the number 17 and the Formo mark are stitched firmly into the fabric. They won't peel off, even after many washes." },
      { title: "The shorts match the shirt", text: "One tap is enough: the shorts take the shirt's color, stripes, mark and number. The set comes out in one style." },
      { title: "Packed like a gift", text: "The kit is folded with care and placed in a Formo box. Opening the box is a small celebration." },
      { title: "Delivered to your door", text: "The courier brings the box straight to your address. Track your order in the “My orders” section of the app." },
      { title: "Now let everyone see", text: "Open the box, take a photo and share it with your friends. New kit, new victories." },
    ],
    cta: "Order your kit",
    play: "Autoplay",
    pause: "Pause",
    playAria: "Play the animation automatically",
    pauseAria: "Stop autoplay",
    tapeAria: "Stages",
  },
  stage: {
    aria: "How a Formo kit is made: from fabric to a social media post",
    fabrics: ["SATIN", "MESH", "COTTON", "POLYESTER", "WHITE KNIT"],
    chosen: "CHOSEN",
    champion: "CHAMPION",
    tagline: "DESIGN YOUR OWN KIT",
    delivered: "Delivered ✓",
    photo: "PHOTO",
    justNow: "just now",
    likes: "likes",
    caption: "My new kit is here! 🔥",
    bub1: "Looks great! 🔥",
    bub2: "Where did you get it?",
    bub3: "At Formo, of course 😎",
    share: "Share",
    match: "Match the shirt",
    matched: "Matched ✓",
  },
  features: {
    kicker: "Features",
    title: "Everything in one app",
    lead: "Design studio, club kits, size picker and order tracking — all in the Formo app.",
    items: [
      { title: "Design studio", text: "Color, front and back lettering, logo — you draw the kit yourself." },
      { title: "Club kits", text: "Famous club kits: add your name and number, then order." },
      { title: "Shirt + shorts", text: "A set in one style. You can add a number to the shorts too." },
      { title: "My orders", text: "See in the app which stage your order is at." },
    ],
  },
  steps: {
    kicker: "How it works",
    title: "Your kit in four steps",
    items: [
      { title: "Pick a design", text: "Create your own design or choose a club kit." },
      { title: "Name and number", text: "Set a size from S to 3XL for the shirt and shorts." },
      { title: "We make it", text: "Your order goes to the workshop and is ready in 1–2 days." },
      { title: "To your door", text: "The finished set is packed and delivered to your address." },
    ],
  },
  kit: {
    kicker: "Builder",
    title: "Try your kit right now",
    lead: "Type a name and number, pick a color and trim — the shirt and shorts change instantly.",
    viewAria: "View",
    front: "Front",
    back: "Back",
    previewAria: "Shirt and shorts preview",
    shuffle: "Random ✦",
    shuffleAria: "Random kit",
    tabsAria: "Settings",
    tabs: { text: "Text", color: "Color", pattern: "Logo", size: "Size" },
    nameLabel: "Name or text",
    nameHint: "up to 12 characters",
    numberLabel: "Number",
    numberHint: "1 to 99",
    shortsTitle: "Number on the shorts",
    shortsSub: "Left leg, front",
    colorLabel: "Kit color",
    trimLabel: "Accent color",
    logoTitle: "Formo mark",
    logoSub: "Left chest, front",
    sizeLabel: "Shirt and shorts size",
    sizeAria: "Size",
    orderSmall: "Order",
    set: "Shirt + shorts",
    submit: "Order via Telegram",
    copied: "Order text copied — paste it into the Telegram chat and send.",
    manual: "Write this in Telegram: name, number, color and size.",
    defaultName: "CHAMPION",
    colors: ["White", "Navy", "Emerald", "Red", "Gold", "Black", "Blue", "Purple"],
    trims: ["Navy", "Gold", "White", "Red", "Emerald"],
    presets: ["CHAMP", "MOM", "DAD", "COACH", "GOLD"],
    yes: "yes",
    no: "no",
    message: (v) => [
      "Hello, FORMO! I'd like to order a kit:",
      `• Name: ${v.name}`,
      `• Number: ${v.number}`,
      `• Color: ${v.color}`,
      `• Accent color: ${v.trim}`,
      `• Formo mark: ${v.logo}`,
      `• Size: ${v.size}`,
      `• Number on shorts: ${v.shorts}`,
      "• Set: shirt + shorts",
    ].join("\n"),
  },
  cta: {
    kicker: "The Formo app",
    title: "Is your team ready for a new kit?",
    text: "The app is coming soon to the App Store and Google Play. For now we take orders through Telegram.",
    telegram: "Message us on Telegram",
    soon: "soon",
    storesAria: "App",
    phone: "Design your own kit",
  },
  footer: "Design your own kit · © 2026 Formo",
};

export const DICT = { uz, ru, en };

// Har bir til o'z manzilida turadi: qidiruv tizimi ularni alohida sahifa sifatida indekslaydi.
export const PATHS = { uz: "/", ru: "/ru/", en: "/en/" };

export function langFromPath(pathname = "/") {
  const first = pathname.split("/")[1];
  return DICT[first] ? first : "uz";
}

const Ctx = createContext({ lang: "uz", t: uz, setLang: () => {} });

// `initial` — serverda (prerender) til tashqaridan beriladi; brauzerda manzildan olinadi.
export function LangProvider({ children, initial }) {
  const [lang, setLangState] = useState(() => initial ?? (typeof window === "undefined" ? "uz" : langFromPath(location.pathname)));

  const setLang = useCallback((l) => {
    setLangState(l);
    if (typeof window !== "undefined" && location.pathname !== PATHS[l]) {
      history.pushState({ lang: l }, "", PATHS[l] + location.hash);
    }
  }, []);

  // brauzerning "orqaga" tugmasi tilni ham qaytaradi
  useEffect(() => {
    const onPop = () => setLangState(langFromPath(location.pathname));
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  // til almashganda sarlavha, tavsif, canonical va <html lang> yangilanadi
  useEffect(() => {
    const t = DICT[lang];
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    const set = (sel, value) => document.querySelector(sel)?.setAttribute("content", value);
    set('meta[name="description"]', t.meta.description);
    set('meta[property="og:title"]', t.meta.title);
    set('meta[property="og:description"]', t.meta.description);
    set('meta[property="og:locale"]', t.meta.locale);
    set('meta[property="og:image:alt"]', t.meta.ogAlt);
    set('meta[name="twitter:title"]', t.meta.title);
    set('meta[name="twitter:description"]', t.meta.description);
    set('meta[name="twitter:image:alt"]', t.meta.ogAlt);
    const canon = document.querySelector('link[rel="canonical"]');
    if (canon) {
      const url = new URL(PATHS[lang], canon.href).href;
      canon.href = url;
      set('meta[property="og:url"]', url);
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, t: DICT[lang], setLang }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
