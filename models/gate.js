//Nate Goldsborough
//Antares Network Discord Bot 

const { Schema, model } = require('mongoose');

const GATE = Schema({
    id: String,
    NAME: String,
    GUILD_OWNER_ID: Array,
    BANNED_OWNERS: Array,
    BANNED_USERS: Array,
    BANNED_GUILDS: Array,
    TOTAL_MESSAGES: String,
    TOTAL_SERVERS: String,
    TOTAL_USERS: String,
    IGNORED_GUILDS: Array,
    CHATTER_SERVERS: Array,
    UPDATE_TIME: String
})

module.exports = model('Gate', GATE);