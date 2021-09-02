const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('bloqueia os membros de enviar mensagens em um chat')
        .setDefaultPermission(false),

    /**
    * @param {Discord.CommandInteraction} interaction 
    */

    async execute(interaction) {

        let permissions = await interaction.channel.permissionOverwrites.resolve()

        permissions.set([
            {
               id: interaction.guild.roles.everyone,
               deny: [Discord.Permissions.FLAGS.SEND_MESSAGES],
            },
          ], 'por: '+interaction.member.id);

    }
}