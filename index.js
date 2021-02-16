const { CommandoClient } = require('discord.js-commando');
const { connect } = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const MongoDBProvider = require('commando-provider-mongo').MongoDBProvider;
require('dotenv').config();
require('colors');
const path = require('path');
const onReady = require('./actions/onReady');
const docCreate = require('./actions/docCreate');
const guildModel = require('./models/guild');
const piiModel = require('./models/pii');
const piiCreate = require('./actions/piiCreate');
const counting = require('./functions/counting');
const messageLog = require('./actions/messageLog')
const logToConsole = require('./actions/logToConsole')
global.botVersion = "1.3.5";


global.bot = new CommandoClient({
	commandPrefix: '&',
	owner: '603629606154666024',
	disableEveryone: true
});

//set the prefix storage provider to mongodb
bot.setProvider(
	MongoClient.connect(process.env.BOT_MONGO_PATH).then(bot => new MongoDBProvider(bot, process.env.BOT_SETTINGS_PATH))
).catch(console.error);


//register the commands
bot.registry
	.registerDefaultTypes()
	.registerGroups([
		['user', 'Commands for regular users'],
		['admin', 'Commands for admins'],
		['owner', 'Commands for the bot owner']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
		ping: false,
		eval: false,
		unknownCommand: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

bot.on('message', async (message) => {

	if (message.author.bot) return;
	try {
		console.log(`MESSAGE`.magenta, `[${message.guild.name}]`.green, `[${message.channel.name}]`.blue, `[${message.author.username}]`.yellow, `--`.grey, `${message.content}`.cyan)
		counting.count(message, bot); // logic 
		messageLog.log(message); // log number of messages sent in each guild
	} catch (e) {
		console.log("Error on guild lookup. Maybe from a message sent in a DM to the bot")
	}
});

bot.on('messageDelete', async (message) => {
	console.log(`DELETE`.red, `[${message.guild.name}]`.green, `[${message.channel.name}]`.blue, `[${message.author.username}]`.yellow, `--`.grey, `${message.content}`.red)
});

//actions to run at bot startup
bot.on('ready', async () => {
	onReady.event(bot)
	console.log("Startup script has run".red.bold)
});

//actions to run when the bot joins a server
bot.on("guildCreate", async (guild) => {
	docCreate.event(guild, bot);
	piiCreate.event(guild, bot);

})

//actions to run when the bot leaves a server
bot.on("guildDelete", async (guild) => {
	var d = new Date();
	try {
		await guildModel.findOneAndUpdate({ GUILD_ID: guild.id }, { $set: { GUILD_LEAVE_DATE: d.toString() } }, { new: true });
		bot.users.fetch('603629606154666024', false).then((user) => {
			user.send(`I left a server :(\n Name: ${guild.name}\n ID: ${guild.id}\n Owner: ${guild.owner.id}`);
		});
	} catch (e) {
		console.log(e);
	}
})

bot.on('guildMemberAdd', async (member) => {
	var memberList = [];
	bot.guilds.cache.get(member.guild.id).members.cache.forEach(member => memberList.push(member.user.id));
	try {
		await piiModel.findOneAndUpdate({ GUILD_ID: member.guild.id }, { $set: { GUILD_MEMBERS: memberList } }, { new: true });
		await guildModel.findOneAndUpdate({ GUILD_ID: member.guild.id }, { $set: { GUILD_MEMBERS: member.guild.memberCount } }, { new: true });
		logToConsole.memberJoin(member);
	} catch (e) {
		console.log(e);
	}
})

bot.on('guildMemberRemove', async (member) => {
	var memberList = [];
	bot.guilds.cache.get(member.guild.id).members.cache.forEach(member => memberList.push(member.user.id));
	try {
		await piiModel.findOneAndUpdate({ GUILD_ID: member.guild.id }, { $set: { GUILD_MEMBERS: memberList } }, { new: true });
		await guildModel.findOneAndUpdate({ GUILD_ID: member.guild.id }, { $set: { GUILD_MEMBERS: member.guild.memberCount } }, { new: true });
		logToConsole.memberLeave(member);
	} catch (e) {
		console.log(e);
	}
})

bot.on('guildUpdate', async (oldGuild, newGuild) => {
	try {
		await guildModel.findOneAndUpdate({ GUILD_ID: newGuild.id }, { $set: { GUILD_NAME: newGuild.name } }, { new: true });
		logToConsole.guildUpdate(oldGuild, newGuild);
	} catch (e) {
		console.log(e);
	}
})

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));


//connect to MongoDB and then log bot into Discord
(async () => {
	var mongo_uri = String(process.env.BOT_MONGO_PATH);
	console.log('Trying to connect to MongoDB\nPlease wait for a connection'.yellow);
	await connect(mongo_uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	});
	console.log('Connected to MongoDB'.green.bold);

	//login to the discord api
	console.log('Trying to login to the Discord API\nPlease wait for a connection'.yellow);
	bot.login(process.env.BOT_TOKEN).catch(e => console.error(e));
	console.log("Logged into the Discord API".green.bold);
})() //idk why these () are needed but they are