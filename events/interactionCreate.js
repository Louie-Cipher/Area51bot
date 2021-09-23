const Discord = require('discord.js');

const desabafoChannel = '880547880065187901';
const cupidoChannel = '873198743405600798';
const hateChannel = '874146568930983936';

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction
 * @param {Discord.Collection} slashCommands
 */

module.exports = async (client, interaction, slashCommands) => {

    if (interaction.isCommand()) {

        let cmd = slashCommands.get(interaction.commandName);

        if (!cmd) return interaction.reply({ content: 'Houve um erro ao executar esse comando', ephemeral: true });

        if (cmd.inVoiceChannel) {
            if (!interaction.member.voice.channel)
                return await interaction.reply({
                    content: '🔇 Você precisa estar em um canal de voz para usar esse comando', ephemeral: true
                });
            if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId != interaction.member.voice.channelId) {
                return await interaction.reply({
                    content: '🔇 Você precisa no mesmo canal de voz que eu para usar esse comando\nAtualmente, já estou em ' + interaction.guild.me.voice.channel.name, ephemeral: true
                });
            }
        }

        try {
            cmd.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }

    }

    if (interaction.isButton()) {

        if (interaction.channelId == desabafoChannel) {
            try {
                require('../extra/buttonEvents/desabafo')(client, interaction)
            } catch (error) {
                console.log(error)
            }
        }
        else if (interaction.channelId == cupidoChannel) {
            try {
                require('../extra/buttonEvents/cupido')(client, interaction)
            } catch (error) {
                console.log(error)
            }
        }
        else if (interaction.channelId == hateChannel) {
            try {
                require('../extra/buttonEvents/hate')(client, interaction)
            } catch (error) {
                console.log(error)
            }
        }

    }
}
