const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction 
 */

module.exports = async (client, interaction) => {

    if (interaction.isCommand()) {

        await interaction.deferReply({ ephemeral: true }).catch(() => { })

        let cmd = client.slashCommands.get(interaction.commandName);

        try {
            cmd.execute(client, interaction);
        } catch (error) {
            console.error(error)
        }


    }
}
