const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Testa o delay do bot'),

    async execute(interaction) {

        let pong = await interaction.reply({content: '🏓 Pong'});

        interaction.editReply({content: `🏓 Pong | Delay do Discord: ${pong.createdAt.getTime() - interaction.message.createdAt.getTime()} ms\nDelay do bot: ${client.ws.ping} ms`})

    }
}