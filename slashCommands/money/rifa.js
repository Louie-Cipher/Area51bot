const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');
const lotteryDB = require('../../mongoSchema/lottery');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rifa')
        .setDescription('Rifa intergaláctica')
        .addStringOption(option =>
            option.setName('opções')
                .setDescription('escolha comprar ou ver estatísticas')
                .addChoice('comprar', 'comprar')
                .addChoice('estatísticas', 'estatisticas')
                .setRequired(true)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        let option = interaction.options.getString('opções', true);

        await interaction.deferReply({ ephemeral: true });

        if (option == 'comprar') {

            let profileData = await profileModel.findOne({ userID: interaction.user.id });

            if (profileData.coins < 100) return interaction.editReply({
                embeds: [{
                    color: 'RED',
                    title: 'Saldo insuficiente para realizar a compra',
                    description: `Cada bilhete da Rifa Intergaláctica custa 100 estrelas. seu saldo atual na carteira é de ${profileData.coins} estrelas`
                }]
            });

            let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id },
                {
                    $inc: { coins: -100 },
                    lastEditMoney: Date.now()
                }
            )
            profileUpdate.save();

            let lotteryData = await lotteryDB.findOne({ true: true });

            if (!lotteryData) {
                let createLottery = await lotteryDB.create({
                    true: true,
                    users: [interaction.user.id],
                    lastSort: Date.now(),
                    winners: []
                })
                createLottery.save();
            }

            let lotteryUpdate = await lotteryDB.findOneAndUpdate({ true: true },
                {
                    $push: { users: interaction.user.id }
                }
            );
            lotteryUpdate.save()

            interaction.editReply({
                embeds: [{
                    color: '#00ff30',
                    title: 'Bilhete da Rifa Intergaláctica adquirido com sucesso',
                    description: `O sorteio ocorrerá as 21:00, no chat <#862354794323902474>\nPara ver mais informações sobre o sorteio de hoje, utilize \`/rifa estatisticas\``
                }]
            })

        } else {

            let lotteryData = await lotteryDB.findOne({ true: true });

            let lastWinner = await client.users.fetch(lotteryData.winners[lotteryData.winners.length - 1]);

            let userTickets = 0;
            lotteryData.users.forEach(user => {
                if (user == interaction.user.id) { userTickets++ }
            });

            let userWins = 0;
            lotteryData.winners.forEach(user => {
                if (user == interaction.user.id) { userWins++ }
            });

            const vitoriaPercent = ((userTickets * 100) / lotteryData.users.length).toFixed(2);

            let infoEmbed = new Discord.MessageEmbed()
                .setColor('#00ffff')
                .setTitle('💰 Rifa Intergaláctica - Estatísticas 📊')
                .addFields(
                    { name: 'Suas estatísticas', value: '\u200B' },
                    { name: 'Hoje você comprou', value: userTickets.toString() + ' bilhetes', inline: true },
                    { name: 'Chances de vitória hoje', value: `${vitoriaPercent} %`, inline: true },
                    { name: 'Você já venceu', value: `{userWins} vezes`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Estatísticas gerais', value: '\u200B' },
                    { name: 'Concorrendo hoje', value: `${lotteryData.users.length}`, inline: true },
                    { name: 'Prêmio atual', value: `${(lotteryData.users.length * 150) + 5000}`, inline: true },
                    { name: 'Último vencedor', value: `${lastWinner}`, inline: true },
                );

            interaction.editReply({ embeds: [infoEmbed] });

        }

    }
}
