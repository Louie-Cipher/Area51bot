const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('trabalha e recebe estrelas do bot'),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        const boosterRole = interaction.guild.roles.premiumSubscriberRole

        let boost = 0;
        if (interaction.member.roles.cache.has(boosterRole)) boost = 30
        const randomCoins = Math.floor(Math.random() * 40) + 80 + boost;

        let profileData = await profileModel.findOne({ userID: interaction.user.id });

        if (!profileData) return interaction.editReply({ content: 'Houve um erro de comunicação com o banco de dados. por favor, tente novamente mais tarde' });

        let dateNow = new Date();

        if (profileData.lastWork) {

            const lastWork = new Date(profileData.lastWork);
            const nextWork = new Date(7200000 + lastWork.getTime());

            if (dateNow.getTime() - lastWork.getTime() < 7200000) {

                let timeLeftString = require('../../extra/dateFormatter')({
                    oldestDate: lastWork,
                    latestDate: nextWork,
                    ignoreMilliseconds: true,
                    ignoreSeconds: true
                });

                let failEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('⏳ Você já trabalhou nas últimas 2 horas')
                    .setFooter('dica: Você sabia que sendo booster do servidor,\nvocê ganha 30 estrelas a mais no work?')
                    .setDescription(`Volte para trabalhar novamente em ${timeLeftString.main}`);

                return interaction.editReply({ embeds: [failEmbed] });
            }

        }


        profileData = await profileModel.findOneAndUpdate(
            {
                userID: interaction.user.id,
            }, {
            $inc: { coins: randomCoins },
            lastWork: dateNow
        }
        )
        profileData.save();

        let embed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('👷‍♀️ Trabalho 👷‍♂️')
            .setDescription(`✨ Você trabalhou e você ganhou **${randomCoins} Stars**! ✨
      agora voce possui ${profileData.bank + profileData.coins + randomCoins} Stars no total\nVolte daqui a 2h e trabalhe mais para receber mais estrelas`)
            .setFooter('dica: Você sabia que sendo booster do servidor,\nvocê ganha 30 estrelas a mais no daily?');

        interaction.editReply({ embeds: [embed] })

    }
}
