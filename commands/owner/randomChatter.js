const { Command } = require('discord.js-commando');
const logToConsole = require('../../actions/logToConsole')
const rChat =  require('../../functions/randomChatter')

module.exports = class RandomChatterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rchat',
            group: 'owner',
            memberName: 'rchat',
            description: 'Randomly chat with another server',
            examples: ['rchat start'],
            args: [
                {
                    key: 'status',
                    prompt: 'Do you want to start or stop your session',
                    type: 'string'
                }
            ],
            throttling: {
                usages: 1,
                duration: 3600,
            },
            guildOnly: true,
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['ADMINISTRATOR']
        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    run(message, { status }) {
        rChat.toggle(message.guild.id, status)
    }
};