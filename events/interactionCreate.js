const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction
 * @param {Discord.Collection} slashCommands
 */

module.exports = async (client, interaction, slashCommands) => {

    if (interaction.isCommand()) {

        let cmd = slashCommands.get(interaction.commandName);

        if (!cmd) return interaction.reply({content: 'Houve um erro ao executar esse comando', ephemeral: true})

        try {
            cmd.execute(client, interaction);
        } catch (error) {
            console.error(error)
        }

    }
}
