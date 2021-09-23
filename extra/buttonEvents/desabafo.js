const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.ButtonInteraction} interaction 
 */

module.exports = async (client, interaction) => {

    const aproveMessage = interaction.message;

    if (!aproveMessage.embeds[0] || !aproveMessage.embeds[0].description) return;

    const desabafoChannel = interaction.guild.channels.cache.get('880547715245809714');

    aproveMessage.edit({
        components: [],
        content: `Aprovado por ${interaction.user}`
    });

    await desabafoChannel.send({
        embeds: [{
            color: 'BLURPLE',
            title: 'Desabafo'
        }]
    });

    await desabafoChannel.send({content: aproveMessage.embeds[0].description})

}