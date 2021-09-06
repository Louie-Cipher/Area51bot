const Discord = require('discord.js');
const profileModel = require('../mongoSchema/profile');
const lotteryDB = require('../mongoSchema/lottery');

module.exports = {

    /** 
     * @param {Discord.Client} client
    */

    async execute(client) {

        let botChannel = await client.channels.fetch('862354794323902474');
        let guild = await client.guilds.fetch('768565432663539723');

        let lotteryData = await lotteryDB.findOne({ true: true });

        const users = lotteryData.users;
        const premio = (users.length * 150) + 5000;

        if (!users || !users[0] || users.length == 0) {

            let emptyMessage = await botChannel.send({
                embeds: [{
                    color: '#ffff00',
                    title: 'Rifa intergaláctica',
                    description: 'Não houve apostador na Rifa intergalática hoje😕\n\nPara apostar na Rifa intergaláctica, use a.rifa comprar',
                    footer: { text: 'Cada bilhete custa 100 estrelas' }
                }]
            });

            emptyMessage.pin();

            return;

        }

        botChannel.permissionOverwrites.set([
            {
                id: guild.roles.everyone.id,
                deny: [Discord.Permissions.FLAGS.SEND_MESSAGES],
            },
        ], 'anúncio do sorteio ');

        let premiadoID = users[Math.floor(Math.random() * users.length)];

        let premiado = await client.users.fetch(premiadoID);

        let firstEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('🤑 Rifa intergaláctica 🤑')
            .setDescription(`🥁 Rufem os tambores 🥁\n\nO vencedor da Rifa intergaláctica de hoje é:`);

        botChannel.send({ embeds: [firstEmbed] });

        await delay(5000);

        botChannel.send({ content: premiado.toString() });

        let resultMsg = await botChannel.send({
            embeds: [{
                color: '#ffff00',
                title: '🎉 Parabéns ' + premiado.username,
                description: `🌟 Você ganhou ${premio.toString()} estrelas! 🌟`
            }]
        });

        resultMsg.pin();

        await delay(2000);

        botChannel.send({
            embeds: [{
                color: '#ffff00',
                description: `Mais sorte na próxima vez aos demais **${users.length - 1}** apostadores de hoje`
            }]
        });

        botChannel.permissionOverwrites.edit(guild.roles.everyone, {
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
                $inc: { bank: premio },
                lastEditMoney: Date.now()
            }
        )
        profileData.save();

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    }

}
