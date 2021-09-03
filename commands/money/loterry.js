const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');
const lotteryDB = require('../../mongoSchema/lottery');

module.exports = {
    name: 'rifa',
    aliases: ['ticket', 'bilhete'],
    description: "compra um bilhete da Rifa Intergaláctica",

    /** 
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    async execute(client, message, args) {

        if (message.author.id != process.env.louie) return message.reply({
            embeds: [{
                color: 'RED',
                title: 'Comando em construção. Porém...',
                description: `Talvez você esteja procurando pelo comando da ✨ Rifa Intergaláctica ✨\n\nO antigo comando de loteria foi renomeado como Rifa Intergaláctica\nPois em breve, o comando loteria irá ser uma nova função ^-^`
            }]
        });

        if (['comprar', 'buy', 'compra'].includes(args[0])) {

            let profileData = await profileModel.findOne({ userID: message.author.id });

            if (profileData.coins < 100) return message.reply({
                embeds: [{
                    color: '#b3c20c',
                    title: 'Saldo insuficiente para realizar a compra',
                    description: `Cada bilhete da Rifa Intergaláctica custa 100 estrelas. seu saldo atual na carteira é de ${profileData.coins} estrelas`
                }]
            });

            let profileUpdate = await profileModel.findOneAndUpdate({ userID: message.author.id },
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
                    users: [message.author.id],
                    lastSort: Date.now(),
                    winners: [process.env.louie]
                })
                createLottery.save();
            }

            let lotteryUpdate = await lotteryDB.findOneAndUpdate({ true: true },
                {
                    $push: { users: message.author.id }
                }
            );
            lotteryUpdate.save()

            message.reply({
                embeds: [{
                    color: '#00ff30',
                    title: 'Bilhete da Rifa Intergaláctica adquirido com sucesso',
                    description: `O sorteio ocorrerá as 21:00, no chat <#862354794323902474>\nPara ver mais informações sobre o sorteio de hoje, utilize \`a.rifa info\``
                }]
            })

        } else if (['info', 'informacao', 'informação', 'status', 'stats', 'dados'].includes(args[0])) {

            let lotteryData = await lotteryDB.findOne({ true: true });

            let lastWinner = await client.users.fetch(lotteryData.winners[lotteryData.winners.length - 1]);

            let userTickets = 0;
            lotteryData.users.forEach(user => {
                if (user == message.author.id) { userTickets++ }
            });

            let userWins = 0;
            lotteryData.winners.forEach(user => {
                if (user == message.author.id) { userWins++ }
            });

            let infoEmbed = new Discord.MessageEmbed()
                .setColor('#00ffff')
                .setTitle('💰 Rifa Intergaláctica - Estatísticas 📊')
                .addFields(
                    { name: 'Suas estatísticas', value: '\u200B' },
                    { name: 'Hoje você comprou', value: userTickets.toString() + ' bilhetes', inline: true },
                    { name: 'Você já venceu', value: userWins.toString() + ' vezes', inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Estatísticas gerais', value: '\u200B' },
                    { name: 'Concorrendo hoje', value: lotteryData.users.length.toString(), inline: true },
                    { name: 'Prêmio atual', value: ((lotteryData.users.length * 150) + 5000).toString(), inline: true },
                    { name: 'Último vencedor', value: lastWinner.toString(), inline: true },
                );

            message.reply({ embeds: [infoEmbed] });

        } else {

            let helpEmbed = new Discord.MessageEmbed()
                .setColor('GREYPLE')
                .setTitle('💰 Rifa Intergaláctica 💰')
                .setDescription(`Para comprar um bilhete da Rifa Intergaláctica, utilize \`a.rifa comprar\` - cada bilhete custa 100 estrelas\nPara ver estatísticas sobre o sorteio de hoje ou suas informações, utilize \`a.rifa info\``);

            message.reply({ embeds: [helpEmbed] })
        }

    }
}