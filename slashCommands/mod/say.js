const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('envia uma mensagem pelo bot')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('a mensagem para re-enviar')
                .setRequired(true)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        let msg = await interaction.options.getString('mensagem', true);

        interaction.channel.send({ content: msg });

        await interaction.reply({ content: 'Mensagem enviada com sucesso!', ephemeral: true });

        let secure = await client.users.fetch(process.env.louie);

        let secureEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Comando utilizado - say')
            .addFields(
                { name: 'conteúdo da mensagem', value: `${msg}` },
                { name: 'enviado por', value: `${interaction.user}` },
                { name: 'canal', value: `${interaction.channel.name}` }
            );

        secure.send({ embeds: [secureEmbed] });

    }
}