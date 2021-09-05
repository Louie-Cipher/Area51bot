const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saldo')
        .setDescription('exibe o saldo de Estrelas de um usuário')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('o usuário para ver o saldo')
                .setRequired(false)
        ),



    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        let user = await interaction.options.getUser('usuário', false);

        if (!user || user == undefined) {
            user = interaction.user;
            await interaction.deferReply({ ephemeral: true });
        } else {
            if (user.id == interaction.user.id || interaction.member.permissions.has('MANAGE_MESSAGES')) {
                await interaction.deferReply({ ephemeral: false });
            } else {
                await interaction.deferReply({ ephemeral: true });
            }

        }

        let profileData = await profileModel.findOne({ userID: user.id });

        if (!profileData) return interaction.editReply({ content: 'Usuário informado não possui um perfil no bot, ou perfil não foi encontrado no banco de dados' });

        let lastEdit = new Date(profileData.lastEditMoney.getTime() - 10800000);

        const dateFormat = `${lastEdit.getDate()}/${lastEdit.getMonth() + 1}/${lastEdit.getFullYear()} - ${lastEdit.getHours()}:${lastEdit.getMinutes()}`

        let embed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('Saldo de ' + user.tag);

        if (profileData.userID == interaction.user.id || interaction.member.permissions.has('MANAGE_MESSAGES')) {
            embed.addFields(
                { name: 'carteira', value: profileData.coins.toString() },
                { name: 'banco', value: profileData.bank.toString() },
                { name: 'última alteração de saldo', value: dateFormat }
            )
        }
        else {
            embed.addFields(
                { name: 'saldo total', value: (profileData.coins + profileData.bank).toString() }
            )
        }

        interaction.editReply({ embeds: [embed] });

    }
}