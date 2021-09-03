const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');
const lotteryDB = require('../../mongoSchema/lottery');

module.exports = {

    name: 'sorteio',
    aliases: ['manualsort'],
    description: "sorteia manualmente a Rifa Intergaláctica",
    userPermissions: 'ADMINISTRATOR',

    /** 
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */


    async execute(client, message, args) {

        if (message.author.id != process.env.louie) return message.channel.send({
            embed: {
                color: '#ffff00',
                title: 'Rifa intergaláctica',
                description: 'Por questões de segurança do banco de dados e instabilidade, apenas a Louie pode executar essa função'
            }
        });

        let botChannel = await client.channels.fetch('862354794323902474');

        let lotteryData = await lotteryDB.findOne({ true: true });

        let users = lotteryData.users;

        if (!users || !users[0] || users.length == 0) {

            let emptyMessage = await botChannel.send({
                embed: {
                    color: '#ffff00',
                    title: 'Rifa intergaláctica',
                    description: 'Não houve apostador na Rifa intergalática hoje😕\n\nPara apostar na Rifa intergaláctica, use a.rifa comprar',
                    footer: { text: 'Cada bilhete custa 100 estrelas' }
                }
            });

            emptyMessage.pin();

            return;

        }

        botChannel.permissionOverwrites.edit(message.guild.roles.everyone, {
            'SEND_MESSAGES': false
        })

        let premiadoID = users[Math.floor(Math.random() * users.length)];

        let premiado = await client.users.fetch(premiadoID);

        let firstEmbed = new Discord.MessageEmbed()
            .setColor()
            .setTitle('🤑 Rifa intergaláctica 🤑')
            .setDescription(`🥁 Rufem os tambores 🥁\n\nO vencedor da Rifa intergaláctica de hoje é:`);


        botChannel.send({ embeds: [firstEmbed] });

        await delay(5000);

        botChannel.send({ content: `${premiado}` });

        let resultMsg = await botChannel.send({
            embeds: [{
                color: '#ffff00',
                title: '🎉 Parabéns ' + premiado.tag,
                description: `🌟 Você ganhou ${(users.length * 150) + 5000} estrelas! 🌟`
            }]
        });

        resultMsg.pin();

        await delay(5000);

        botChannel.send({
            embeds: [{
                color: '#ffff00',
                description: `Mais sorte na próxima vez aos demais **${users.length - 1}** apostadores de hoje`
            }]
        });

        botChannel.permissionOverwrites.edit(message.guild.roles.everyone, {
            'SEND_MESSAGES': null
        })

        let lotteryUpdate = await lotteryDB.findOneAndUpdate(
            { true: true },
            {
                $push: { winners: premiadoID },
                $pullAll: { users },
                lastSort: Date.now()
            }
        )
        lotteryUpdate.save();

        let profileData = await profileModel.findOneAndUpdate(
            { userID: premiado.id },
            {
                $inc: { bank: (users.length * 150) + 5000 },
                lastEditMoney: Date.now()
            }
        )
        profileData.save();

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    }

}