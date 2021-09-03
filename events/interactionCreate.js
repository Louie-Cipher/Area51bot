const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction
 * @param {Discord.Collection} slashCommands
 */

module.exports = async (client, interaction, slashCommands) => {

    if (interaction.isCommand()) {

        await interaction.deferReply({ ephemeral: true }).catch(() => { })

        let cmd = slashCommands.get(interaction.commandName);

        try {
            cmd.execute(client, interaction);
        } catch (error) {
            console.error(error)
        }

    }
}
