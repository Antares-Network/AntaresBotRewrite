const gateModel = require('../models/gate');
const piiModel = require('../models/pii')


//! REFACTOR THIS INTO A LOT OF SMALLER FUNCTIONS
notSetup = "Your server owner has not setup `Random Chatter` on your server"


// set rchat alias
async function setAlias(alias){
    // update the database of the current server with its new rchat alias
    await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id }, { $set: { rchat_ALIAS: alias } }, { new: true });
}

// get rchat alias
async function getAlias(serverID){
    let server = await piiModel.findOne({ GUILD_ID: serverID})
    return server.rchat_ALIAS;
}

// get state
async function getState(message){
    // get the gate object for all the servers
    const gate = await gateModel.findOne({ NAME: 'GATE' });
    // check if the current guild is in the list of rchat guilds.
    if(gate.CHATTER_SERVERS.includes(message.guild.id.toString())){
        // If they are in the list of rchat guilds than rchat is enabled and return true
        console.log(`rchat is enabled in this server`)
        return true
    }
    // delete the most recent message sent in the rchat channel
    message.delete()
    // let the current server know rchat is not setup yet
    message.channel.send(notSetup)
    console.log(`rchat is  not enabled in this server`)

    // else return false if rchat is not enabled in the current server
    return false
}

// set state
async function setState(message, status){
    // get the gate object for all the servers
    const gate = await gateModel.findOne({ NAME: 'GATE' });
    // get the remote chatter servers from the gate
    var servers = gate.CHATTER_SERVERS
    // if the command was sent with a start argument, enable rchat on the current server

    let state = await getState(message)
    console.log(state)
    if (status == "start" && !state) {
        // append the current server id to the list of rchat enabled servers
        servers.push(message.guild.id)
        // get the channel object of the rchat channel in the current server
        const channelObj = bot.channels.cache.filter(c => c.name === 'rchat').keyArray().includes(message.channel.id)
        // update the database of the current server with the new list of rchat enabled servers
        await gateModel.findOneAndUpdate({ NAME: 'GATE' }, { $set: { CHATTER_SERVERS: servers } }, { new: true });
        // update the database of the current server with the status "start"
        await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id }, { $set: { rchat_STATUS: "start" } }, { new: true });
        // update the database of the current server with the id of its rchat channel
        await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id }, { $set: { rchat_CHANNEL: channelObj.id } }, { new: true });

    //if the command was sent with a stop argument, disable rchat in the current server
    } else if (status == "stop") {
        //remove the current server id from the list of rchat enabled servers
        servers.splice(servers.indexOf(message.guild.id), 1)
        // update the gate database with the new list of rchat enabled servers
        await gateModel.findOneAndUpdate({ NAME: 'GATE' }, { $set: { CHATTER_SERVERS: servers } }, { new: true });
        // update the database of the current server with the status "stop"
        await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id }, { $set: { rchat_STATUS: "stop" } }, { new: true });
        // update the database of the current servet with an rchat_CHANNEL value of null
        await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id }, { $set: { rchat_CHANNEL: null } }, { new: true });
    }
}

// ask to connect
function connectionRequest(remoteID){
    // send a message to the remote server with a connection request
    bot.channels.cache.get(remoteID).send(ConnectionRequestEmbed);

    //! some logic to get a response to the connection request
}

// start connection
async function connect(message, remoteGuild){
    // get the channel id of the remote server's rchat channel
    let remoteChannelID = remoteGuild.rchat_CHANNEL
    // get the alias of the remote server to preserve privacy
    let remoteAlias = remoteGuild.rchat_REMOTE_ALIAS
    // update the database of the connecting server with the channel id of the remote server
    await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id }, { $set: { rchat_REMOTE: remoteChannelID } }, { new: true});
    // update the database of the connecting server with the alias of the remote server
    await piiModel.findOneAndUpdate({ GUILD_ID: message.guild.id }, { $set: { rchat_REMOTE_ALIAS: remoteAlias } }, { new: true});

    await piiModel.findOneAndUpdate({ GUILD_ID: remoteGuild.GUILD_ID }, { $set: { rchat_REMOTE: remoteChannelID } }, { new: true});

}

// get connected server

// set connected server

// check for correct channel

// get random server
async function getRandomServer(message){
    // get the gate object for all servers
    const gate = await gateModel.findOne({ NAME: 'GATE' }); 
    // get the rchat server list
    let servers = gate.CHATTER_SERVERS
    // remove the server sending the message from the list
    servers.splice(servers.indexOf(message.guild.id), 1)
    // get a random guild id from the list
    let remoteGuildID = servers[Math.floor(Math.random() * servers.length)]
    // get the information of the remote guild
    let remoteGuild = await piiModel.findOne({ GUILD_ID: remoteGuildID }) 
    return remoteGuild
}

//? receive message

// send message
function sendMessage(content, remoteID){
    // sends a message to the connected rchat server
    bot.channels.cache.get(remoteID).send(content);
}

// send termination message
function terminate(message){
    // uses the setState function to disable rchat
    setState(message, "stop")
}

// send connection termination message
function sendTerminationMsg(remoteID){
    bot.channels.cache.get(remoteID).send(TerminationEmbed);
}

// create message embed

// create TerminationEmbed

// create connectionRequestEmbed

//! Make all messages that are not regular text send as embeds. Disallow images, links, videos, and files thru

// export functions

module.exports.getState = getState;
module.exports.setState = setState;
module.exports.connect = connect;
module.exports.connectionRequest = connectionRequest;
module.exports.getRandomServer = getRandomServer;