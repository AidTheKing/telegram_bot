const TelegramApi = require("node-telegram-bot-api");
const token = "5550752804:AAEqGrxIeQeCUh8wYk7zVtaRj4x5AZkuZv4";
const bot = new TelegramApi(token, { polling: true });

const { gameOptions, sendOptions, againOptions } = require("./options");
const chats = {};
const users = {};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начало работы с ботом" },
    { command: "/game", description: "Мини игра" },
    { command: "/sendsomething", description: "Отправить что нибудь" },
    { command: "/signup", description: "Зарегистрироваться" },
  ]);

  const startGame = async (chatId) => {
    await bot.sendMessage(
      chatId,
      "Сыграем в игру, я загадаю цифру - ты должен будешь ее отгадать"
    );
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Я готов, попробуй отгадать", gameOptions);
  };

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(text);
    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        "Добро пожаловать, это мой первый телеграм бот"
      );
      return bot.sendMessage(
        chatId,
        `Я кажется узнал тебя... тебя зовут ${msg.from.first_name}, твой ник: ${msg.from.username}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    if (text === "/sendsomething") {
      return bot.sendMessage(
        chatId,
        "Я могу отправить тебе что нибудь, выбери раздел из списка ниже:",
        sendOptions
      );
    }
    if (text === "/signup") {
      await bot.sendMessage(
        chatId,
        `Давай я добавлю тебя в свою базу. Напиши свою Фамилию.`
      );
      bot.on("text", async (signFunc) => {
        const secondname = signFunc.text;
        const randomId = Math.floor(Math.random() * 100000);
        users[chatId] = randomId;
        await bot.sendMessage(
          chatId,
          `${signFunc.from.first_name} ${secondname}, ты успешно добавлен в мою базу. Твой ID: ${randomId}`
        );
      });
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === "Картинку") {
      await bot.sendPhoto(chatId, "https://picsum.photos/200/300");
      return bot.sendMessage(chatId, "Что нибудь еще?", sendOptions);
    }
    if (data === "Музыку") {
      await bot.sendMessage(chatId, "Погоди секунду, отправляю трек....");
      await bot.sendAudio(chatId, "./INSTASAMKA.mp3");
      return bot.sendMessage(
        chatId,
        "Песня инстасамки единственное, что у меня есть. Может еще что нибудь?",
        sendOptions
      );
    }
    if (data === "Стикер") {
      await bot.sendSticker(
        chatId,
        "https://stickers.wiki/static/stickers/jericdc/file_796589.webp?ezimgfmt=rs:144x144/rscb1/ng:webp/ngcb1"
      );
      return bot.sendMessage(chatId, "Что нибудь еще?", sendOptions);
    }
    if (+data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал, я тоже загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
    return bot.sendMessage(
      chatId,
      `Не угадал, я загадал цифру ${chats[chatId]}, а ты ${data}. Попробуй еще раз`,
      againOptions
    );
  });
};

start();
