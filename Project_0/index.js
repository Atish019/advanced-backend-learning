const path = require('path');
const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
    console.error('Error: BOT_TOKEN is not set. Create a .env file with BOT_TOKEN=your_bot_token');
    process.exit(1);
}

const bot = new Telegraf(botToken);

const binarySearchString = `
const binarySearch = function search(arr, x) {
    let lo = 0, hi = arr.length - 1;

    while (lo <= hi) {
        let mid = lo + Math.floor((hi - lo) / 2);

        if (arr[mid] === x) return mid;
        else if (arr[mid] < x) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    return undefined;
}
`;

async function startBot() {
    try {
        bot.start((ctx) => ctx.reply('Welcome to Mr. Sharma\'s Algo bot'));

        bot.command('binarysearch', (ctx) => ctx.reply(binarySearchString));
        bot.command('toplinuxcommand', (ctx) => ctx.reply('ls cd pwd grep rm'));
        bot.on('sticker', (ctx) => ctx.reply('❤️'));

        bot.command('searchingjs', async (ctx) => {
            try {
                const response = await axios.get('https://raw.githubusercontent.com/Atish019/dvanced-backend-nodejs-learning/main/NodeJS_Modules/searching.js');
                ctx.reply(response.data);
            } catch (error) {
                ctx.reply('Unable to fetch the requested resource right now.');
            }
        });

        bot.on('text', (ctx) => {
            const text = ctx.update.message.text;

            if (text === 'I Love you') {
                ctx.reply('Love you too biro');
            } else {
                ctx.reply('I don\'t understand humans');
            }
        });

        await bot.launch();
    } catch (error) {
        console.error('Failed to start bot:', error.message);
        process.exit(1);
    }
}

startBot();

