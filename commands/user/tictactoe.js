const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

const channelCheck = require('../../functions/channelCheck')
const logToConsole = require('../../actions/logToConsole')

module.exports = class TicTacToeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tictactoe',
            group: 'user',
            memberName: 'tictactoe',
            description: 'Starts a tictactoe game',
            examples: ['tictactoe @nathen418@0002'],
            args: [
                {
                    key: 'user',
                    prompt: 'Please ping a user you want to play a game with',
                    type: 'user',
                }
            ],
            //clientPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true
        });
    }


    async run(message, { user }) {
        function createBoard(width, height) {
           var board = [];
            var row = [];
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    row.push("-");
                }
                board.push(row);
                row = [];
            }
            return (board);
        }

        function displayBoard(board) {
            for (var i = 0; i < board.length; i++) {
                message.channel.send(board[i].join(""));
            }
        }
        var gameBoard = createBoard(3, 3);
        var player1ID = message.author.id
        var player2ID = user.id
        displayBoard(gameBoard);

        console.log("Starting board")




    }
};
