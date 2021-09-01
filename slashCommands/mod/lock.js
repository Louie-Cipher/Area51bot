const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('bloqueia os membros de enviar mensagens em um chat')
        .addChannelOption(option => {option.setName('Canal').setDescription('O canal para bloquear. Se não informado, aplica o lock nesse chat').setRequired(false)})
        .setDefaultPermission(false),

    async execute(interaction) {

        interaction.channel.updateOverwrite(interaction.guild.roles.everyone, { SEND_MESSAGES: false });

    }
}