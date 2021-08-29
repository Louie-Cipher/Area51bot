const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');
const lotteryDB = require('../../mongoSchema/lottery');

module.exports = {
    name: 'lottery',
    aliases: ['loteria', 'ticket', 'bilhete', 'sorteio'],
    description: "compra um bilhete da Loteria Intergaláctica",

    /** 
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    async execute(client, message, args) {

        if (!args[0] || !['info', 'informacao', 'informação', 'status', 'stats', 'dados'].includes(args[0])) {

            let profileData = await profileModel.findOne({ userID: message.author.id });

            if (profileData.coins < 100) return message.channel.send({content: message.author, 
                content: message.author, embed: {
                    color: '#b3c20c',
                    title: 'Saldo insuficiente para realizar a compra',
                    description: `Cada bilhete da Loteria Intergaláctica custa 100 estrelas. seu saldo atual na carteira é de ${profileData.coins} estrelas`
                }
            });

            let profileUpdate = await profileModel.findOneAndUpdate({ userID: message.author.id },
                {
                    $inc: { coins: -100 },
                    lastEditMoney: Date.now()
                }
            )
            profileUpdate.save();

            let lotteryData = await lotteryDB.findOne({true: true});

            if (!lotteryData) {
                let createLottery = await lotteryDB.create({
                    true: true,
                    users: [message.author.id],
                    lastSort: Date.now(),
                    winners: [process.env.louie]
                })
                createLottery.save();
            }

            let lotteryUpdate = await lotteryDB.findOneAndUpdate({true: true},
                {
                    $push: { users: message.author.id }
                }
            );
            lotteryUpdate.save()

            message.channel.send({content: message.author,
                embed: {
                    color: '#00ff30',
                    title: 'Bilhete da Loteria Intergaláctica adquirido com sucesso',
                    description: `O sorteio ocorrerá as 21:00, no chat <#862354794323902474>\nPara ver mais informações sobre o sorteio de hoje, utilize \`a.loteria info\``
                }
            })

        } else {

            let lotteryData = await lotteryDB.findOne({true: true});

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
                .setTitle('💰 Loteria Intergaláctica - Estatísticas 📊')
                .addFields(
                    { name: 'Suas estatísticas', value: '\u200B' },
                    { name: 'Hoje você comprou', value: userTickets + ' bilhetes', inline: true },
                    { name: 'Você já venceu', value: userWins + ' vezes', inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Estatísticas geral', value: '\u200B' },
                    { name: 'Concorrendo hoje', value: lotteryData.users.length, inline: true },
                    { name: 'Prêmio atual', value: lotteryData.users.length * 150, inline: true },
                    { name: 'Último vencedor', value: lastWinner, inline: true },
                );

            message.channel.send(message.author, infoEmbed);

        }

    }
}