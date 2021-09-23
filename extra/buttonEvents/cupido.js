const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.ButtonInteraction} interaction 
 */

module.exports = async (client, interaction) => {

    const aproveMessage = interaction.message;

    if (!aproveMessage.embeds[0] || !aproveMessage.embeds[0].description) return;

    const cupidoChannel = interaction.guild.channels.cache.get('873050670775816243');

    aproveMessage.edit({
        components: [],
        content: `Aprovado por ${interaction.user}`
    });

    await cupidoChannel.send({
        embeds: [{
            color: 'RED',
            title: 'Correio amoroso'
        }]
    });

    await cupidoChannel.send({content: aproveMessage.embeds[0].description});

}