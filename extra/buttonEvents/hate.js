const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.ButtonInteraction} interaction 
 */

module.exports = async (client, interaction) => {

    const aproveMessage = interaction.message;

    if (!aproveMessage.embeds[0] || !aproveMessage.embeds[0].description) return;

    const hateChannel = interaction.guild.channels.cache.get('874146095331176529');

    aproveMessage.edit({
        components: [],
        content: `Aprovado por ${interaction.user}`
    });

    await hateChannel.send({
        embeds: [{
            color: 'RED',
            title: 'Correio do ódio'
        }]
    });

    await hateChannel.send({content: aproveMessage.embeds[0].description});

}