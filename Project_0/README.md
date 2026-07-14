# Project 0: Telegram Bot with Node.js

This project demonstrates a simple Node.js Telegram bot built with Telegraf.

## What it does
- Starts a Telegram bot using a bot token from `.env`
- Responds to `/start`
- Responds to `/binarysearch`
- Responds to `/toplinuxcommand`
- Replies to stickers and simple text messages

## Setup
1. Create a `.env` file in this folder.
2. Add your Telegram bot token:

```env
BOT_TOKEN=your_bot_token_here
```

## Run
```bash
npm install
npm start
```

## Notes
This project is a practical example of backend concepts such as:
- environment variables
- package management
- Node.js runtime usage
- async/await with bot commands
