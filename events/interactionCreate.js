const Discord = require('discord.js');
const {client} = require('../index');

module.exports = {
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Interaction} interaction 
     */
    async event(client, interaction) {
        
        if (interaction.isCommand()) {

            await interaction.deferReply({ephemeral: true}).catch( ()=> {} )

            let cmd = client.slashCommands.get(interaction.commandName);

            try {
                cmd.execute(client, interaction);
            } catch (error) {
                console.error(error)
            }


        }

    }
}
