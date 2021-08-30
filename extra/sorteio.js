const Discord = require('discord.js');
const profileModel = require('../mongoSchema/profile');
const lotteryDB = require('../mongoSchema/lottery');

module.exports = {

    /** 
     * @param {Discord.Client} client
    */

    async execute(client) {

        let botChannel = await client.channels.fetch('862354794323902474');

        let lotteryData = await lotteryDB.findOne({true: true});

        let users = lotteryData.users;

        if (!users || !users[0] || users.length == 0) {

            let emptyMessage = await botChannel.send({embed: {
                color: '#ffff00',
                title: 'Loteria intergaláctica',
                description: 'Não houve apostador na loteria intergalática hoje😕\n\nPara apostar na loteria intergaláctica, use a.loteria',
                footer: { text: 'Cada bilhete custa 100 estrelas' }
            }});

            emptyMessage.pin();

            return;

        }

        botChannel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });

        let premiadoID = users[Math.floor( Math.random() * users.length )];

        let premiado = await client.users.fetch(premiadoID);

        let firstEmbed = new Discord.MessageEmbed()
            .setColor()
            .setTitle('🤑 Loteria intergaláctica 🤑')
            .setDescription(`🥁 Rufem os tambores 🥁\n\nO vencedor da Loteria intergaláctica de hoje é:`);


        botChannel.send(firstEmbed);

        await delay(5000);

        botChannel.send({content: `${premiado}`});

        let resultMsg = await botChannel.send({embed: {
            color: '#ffff00',
            title: '🎉 Parabéns ' + premiado.username,
            description: `🌟 Você ganhou ${(users.length * 150) + 5000} estrelas! 🌟`
        }});

        resultMsg.pin();

        await delay(5000);

        botChannel.send({embed: {
            color: '#ffff00',
            description: `Mais sorte na próxima vez aos demais **${users.length - 1}** apostadores de hoje`
        }});

        botChannel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: null });

        let lotteryUpdate = await lotteryDB.findOneAndUpdate(
            {true: true},
            {
                $push: { winners: premiadoID },
                $pullAll: { users },
                lastSort: Date.now()
            }
        )
        lotteryUpdate.save();

        let profileData = await profileModel.findOneAndUpdate(
            {userID: premiado.id},
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

