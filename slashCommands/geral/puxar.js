const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const vipRole = '836414253807697974';
const vipCategory = '888222970500251658'
const esperaChannel = '891785671306543175';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mover')
        .setDescription('Move um membro para o seu canal VIP')
        .addUserOption(input =>
            input.setName('usuário')
                .setDescription('o usuário para puxar')
                .setRequired(true)
        ),

    inVoiceChannel: true,

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.roles.cache.has(vipRole) &&
            !interaction.member.permissions.has(Discord.Permissions.FLAGS.MOVE_MEMBERS)
        ) return interaction.editReply({
            embeds: [{
                color: 'AQUA',
                title: 'Comando exclusivo para membros VIPs',
                description: `Esse comando está disponível apenas para membros com o cargo <@836414253807697974>,
                para mover outros usuários para sua call privada. \n
                Caso deseje adquirir o VIP platinum, use \`/loja\``
            }]
        });

        if (interaction.member.voice.channel.parentId != vipCategory) return interaction.editReply({
            content: 'Você precisa estar em seu canal VIP para usar esse comando!'
        });

        const user = interaction.options.getUser('membro', true);
        const member = await interaction.guild.members.fetch(user.id);

        if (!member.voice.channel || member.voice.channel.id != esperaChannel) return interaction.editReply({
            content: 'Você só pode mover membros que estejam no canal de voz "Modo espera"'
        });
        try {
            await member.voice.setChannel(interaction.member.voice.channel, `movido para call VIP por ${interaction.user.tag}`);
        } catch {
            return interaction.editReply({ content: ' Houve um erro ao tentar mover o usuário para seu canal de voz\nPor favor, contate um administrador' });
        }

        interaction.editReply({
            content: '✅ Usuário movido com sucesso!'
        });

    }
}