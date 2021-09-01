const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('bloqueia os membros de enviar mensagens em um chat')
        .addChannelOption(option => { option.setName('canal').setDescription('o canal para bloquear. se não informado, aplica o lock nesse chat').setRequired(false) })
        .setDefaultPermission(false),

    /**
    * @param {Discord.CommandInteraction} interaction 
    */

    async execute(interaction) {

        interaction.channel.updateOverwrite(interaction.guild.roles.everyone, { SEND_MESSAGES: false });

    }
}