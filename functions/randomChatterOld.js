const gateModel = require('../models/gate');
const piiModel = require('../models/pii')


async function toggle(id, status) {

    const gate = await gateModel.findOne({ NAME: 'GATE' });
    await piiModel.findOne({ GUILD_ID: id })
    var servers = gate.CHATTER_SERVERS
    if (status == "start") {
        servers.push(id)
        await gateModel.findOneAndUpdate({ NAME: 'GATE' }, { $set: { CHATTER_SERVERS: servers } }, { new: true });

    } else if (status == "stop") {
        servers.splice(servers.indexOf(id), 1)
        await gateModel.findOneAndUpdate({ NAME: 'GATE' }, { $set: { CHATTER_SERVERS: servers } }, { new: true });

    }
}

async function chatter(message) {
    if (bot.channels.cache.filter(c => c.name === 'rchat').keyArray().includes(message.channel.id)) {
        const gate = await gateModel.findOne({ NAME: 'GATE' });

        if (gate.CHATTER_SERVERS.includes(message.guild.id)) {
            console.log(gate.CHATTER_SERVERS)
            gate.CHATTER_SERVERS.splice(gate.CHATTER_SERVERS.indexOf(message.guild.id))
            console.log(gate.CHATTER_SERVERS)
            let remoteGuild = gate.CHATTER_SERVERS[Math.floor(Math.random() * gate.CHATTER_SERVERS.length)];

            //console.log(remoteGuild)
            const remoteObj = await piiModel.findOne({ GUILD_ID: remoteGuild })

            //console.log(remoteObj)

            const channelObj = bot.channels.cache.get(remoteObj.rchat_CHANNEL)

            await gateModel.findOneAndUpdate({ NAME: 'GATE' }, { $set: { CHATTER_SERVERS: servers } }, { new: true });
            await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id },  { rchat_REMOTE: channelObj.id }, {new: true})

            //console.log(channelObj)
            channelObj.send(message.content);

        } else {
            message.channel.send("Your server owner has not setup `Random Chatter` on your server")
        }
    }
}

module.exports.toggle = toggle;
module.exports.chatter = chatter;