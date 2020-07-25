const express = require('express')
const router = express.Router()
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)

router.post('/', (req, res) => {
    try {
        const { telegramChatId, message } = req.body
        bot.telegram.sendMessage(telegramChatId, message)
        res.json({ message: 'Message sent' })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router