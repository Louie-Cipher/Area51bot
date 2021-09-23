const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cupido')
        .setDescription('envia uma carta de amor no chat "Correio Amoroso"')
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

        let texto

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

        if (texto.length > 2048) return interaction.editReply({ embeds: [{ color: '#ff00a2', description: `O tamanho limite do correio é de 2048 caracteres. sua mensagem possui ${texto.length} caracteres` }] })

        if (texto.startsWith('undefined')) {
            texto = texto.substring(9);
        }

        let aproveChannel = await client.channels.fetch('873198743405600798');

        interaction.editReply({
            embeds: [{
                color: 'GREEN',
                title: 'Mensagem enviada com sucesso',
                description: 'Aguardando aprovação de um Cupido da staff para a mensagem ser publicada no chat Correio Amoroso',
            }]
        })

        let aproveEmbed = new Discord.MessageEmbed()
            .setColor('#ffff00')
            .setTitle('Novo Correio Amoroso')
            .setDescription(texto)
            .addField('Mensagem de', interaction.user.toString())
            .setFooter('Clique no botão abaixo para aprovar essa mensagem');

        let buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('aprovar')
                    .setLabel('Aprovar')
                    .setStyle('PRIMARY')
                    .setEmoji('✅')
            );

        aproveChannel.send({ embeds: [aproveEmbed], components: [buttons] });

    }
}