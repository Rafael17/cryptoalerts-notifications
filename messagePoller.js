require('dotenv').config()
const Telegraf = require('telegraf')
const getSecret = require('./scripts/getSecret')
const fetch = require('node-fetch')
const BACKEND_URL = process.env.BACKEND_URL

const runBot = () => {
    const bot = new Telegraf(process.env.TELEGRAM_API_KEY)
    bot.startPolling()

    const regexEverything = new RegExp(/.*/, 'i')

    bot.hears(regexEverything, async (ctx) => {
        const telegramChatId = ctx.message.from.id;
        const input = ctx.match[0];

        const checkTelegramChatId = await fetch(`${BACKEND_URL}/api/users/?telegramChatId=${telegramChatId}`)
        const users = await checkTelegramChatId.json()

        if (Array.isArray(users) && users.length == 0) {
            const addTelegramIdResponse = await fetch(`${BACKEND_URL}/api/users/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramChatId, telegramPasscode: input })
            })
            const json = await addTelegramIdResponse.json().then(data => ({ status: addTelegramIdResponse.status, body: data }))
            if (json.status == 200) {
                ctx.reply("Account has been linked! Now you will receive price alerts in this channel")
            } else {
                ctx.reply('Wrong passcode! Login to crypto alerts to view your telegram passcode')
            }
        } else {
            processInput(input, users[0], ctx)
        }
    })
};

const processInput = (input, userData, ctx) => {

    switch (input) {
        case '/help':
            ctx.reply('Available commands:\n/list_price_alerts\n/list_indicator_alerts')
            break;
        default:
            ctx.reply('Command not recognized.\nFor a list of commands use\n /help')
            break;
    }
}

getSecret('prod/telegram', ['TELEGRAM_API_KEY']).then(runBot)

