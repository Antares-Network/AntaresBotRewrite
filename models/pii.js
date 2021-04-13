//Nate Goldsborough
//Antares Network Discord Bot 
//This project will morph overtime
//built for discord.js V.12.5.1


const { Schema, model } = require('mongoose');

const PII = Schema({
    id: String,
    GUILD_ID: String,
    GUILD_NAME: String,
    GUILD_DEFAULT_CHANNEL: String,
    GUILD_ADMIN_CHANNEL: String,
    GUILD_COUNTING_NUMBER: String,
    rchat_STATUS: String,
    rchat_CHANNEL: String,
    rchat_remote: String,
    rchat_REMOTE_ALIAS: String,
    rchat_ALIAS: String,
    GUILD_POLL_TIMEOUT: String
})

module.exports = model('PII', PII);