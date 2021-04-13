const piiModel = require('../models/pii');


module.exports = {
    event: async function (guild) {

        //get the current Guild ID
        const guildOb = bot.guilds.cache.get(guild.id);

        const srv = await piiModel.findOne({ GUILD_ID: guildOb.id }); //find the entry for the guild
        if (srv === null) {
            //create new doc and send all the above information to it

            const doc = new piiModel({
                GUILD_ID: guild.id,
                GUILD_NAME: guild.name,
                GUILD_COMMAND_COUNT: 0,
                GUILD_DEFAULT_CHANNEL: null,
                GUILD_ADMIN_CHANNEL: null,
                GUILD_COUNTING_NUMBER: 0,
                GUILD_POLL_TIMEOUT: null,
                rchat_STATUS: null,
                rchat_CHANNEL: null,
                rchat_REMOTE: null,
                rchat_ALIAS: null,
                rchat_REMOTE_ALIAS: null
            });

            await doc.save();
        }
    }
}