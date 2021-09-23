const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('desabafo')
        .setDescription('envia sua mensagem no chat "desabafo"')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('a mensagem que deseja enviar')
                .setRequired(true)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        let mensagem = await interaction.options.getString('mensagem', true)

        const words = mensagem.split(' ')

        let texto = ''

        for (const word of words) {

            if (word.length == 18) {

                let snowFlake = Discord.SnowflakeUtil.deconstruct(word)

                if (snowFlake && snowFlake.date) { texto += `<@${word}> ` }
                else { texto += word }

            }
            else if (word == undefined || word == 'undefined') { }
            else if (word == '@everyone') { texto += `@ everyone ` }
            else {
                texto += `${word} `
            }

        }

        if (texto.length > 2048) return interaction.editReply({ embeds: [{ color: 'RED', description: `O tamanho limite das mensagens é de 2048 caracteres. sua mensagem possui ${texto.length} caracteres` }] })

        if (texto.startsWith('undefined')) texto = texto.substring(9);

        let aproveChannel = await client.channels.fetch('880547880065187901');

        interaction.editReply({
            embeds: [{
                color: 'GREEN',
                title: 'Mensagem enviada com sucesso',
                description: 'Aguardando aprovação da staff para a mensagem ser publicada no chat Desabafo',
            }]
        })

        let aproveEmbed = new Discord.MessageEmbed()
            .setColor('BLURPLE')
            .setTitle('Nova mensagem de desabafo')
            .setDescription(texto)
            .addField('Mensagem de', interaction.user.toString())
            .setFooter('Clique no botão abaixo para aprovar a mensagem');

        let buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('aprovar')
                    .setLabel('Aprovar')
                    .setStyle('PRIMARY')
                    .setEmoji('✅')
            );

        aproveChannel.send({
            embeds: [aproveEmbed],
            components: [buttons]
        });

    }
}