const Discord = require("discord.js")
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    name: 'coin',
    aliases: ['moeda', 'coinflip', 'caracoroa', 'caraoucoroa', 'bet'],
    description: "apostar suas moedas no cara ou coroa",

    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {

        if (!args[0] || !args[1]) return message.reply({
            embeds: [{
                color: '#b3c20c',
                title: 'Você precisa mencionar alguém para desafiar, e colocar o valor da aposta',
                description: 'Exemplo: a.moeda @Louie 200\nPara apostar solo, basta me mencionar. Exemplo: a.coin @area51bot 100'
            }]
        });

        let player1 = message.author;
        let player2 = message.mentions.users.first() || client.users.cache.get(args[0]);

        let valor = parseInt(args[1], 10);

        if (!player2) return message.reply({
            embeds: [{
                color: '#b3c20c', title: 'usuário informado não encontrado'
            }]
        });

        if (valor < 1 || valor == NaN) return message.reply({
            embed: [{
                color: '#b3c20c',
                title: `O valor da aposta precisa ser um número inteiro (sem vírgula) e positivo`,
                description: 'Exemplo: a.moeda @pessoa 200'
            }]
        });

        let profileData1 = await profileModel.findOne({ userID: player1.id });
        let profileData2 = await profileModel.findOne({ userID: player2.id });

        if (!profileData2 && player2.id != client.user.id) return message.reply({
            embeds: [{
                color: '#b3c20c',
                title: 'usuário informado ainda não possui um perfil ou estrelas no bot'
            }]
        });

        if (profileData1.coins < valor) return message.reply({
            embeds: [{
                color: '#b3c20c',
                title: `Você não possui esse valor na carteira.`,
                description: `Você atualmente possui **${profileData1.coins} estrelas**`
            }]
        });
        if (player2.id != client.user.id && profileData2.coins < valor) return message.reply({
            embeds: [{
                color: '#b3c20c',
                title: `${player2.tag} não possui esse valor na carteira.`,
                description: `${player2.tag} atualmente possui **${profileData1.coins} estrelas**`
            }]
        });

        if (player2.id != client.user.id) {

            let startEmbed = new Discord.MessageEmbed()
                .setColor('AQUA')
                .setTitle('👤 Cara ou Coroa 👑')
                .setDescription('Para aceitar, clique no botão abaixo')
                .addField('Valor da aposta', `${valor}`);

            let button = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('aceitar')
                        .setLabel('Aceitar')
                        .setEmoji('✅')
                        .setStyle('PRIMARY')
                )

            let coinMessage = await message.channel.send({
                content: `Olá ${player2}\n${player1} deseja apostar ${valor} estrelas com você. aceitar?`,
                embeds: [startEmbed],
                components: [button]
            });

            let collector = coinMessage.createMessageComponentCollector({
                filter: int => int.isButton() && int.user.id == player2.id && int.message.id == coinMessage.id,
                max: 1
            });

            collector.on('collect', async buttonInteraction => {
                buttonInteraction.deferReply({ ephemeral: false });

                const rand = Math.round(Math.random());
                const winner = rand == 0 ? player1 : player2;
                const looser = rand == 0 ? player2 : player1;

                let resultEmbed = new Discord.MessageEmbed()
                    .setColor('AQUA')
                    .setTitle('👤 Cara ou Coroa 👑')
                    .setDescription(`🎉 Parabéns ${winner}, você venceu, e ganhou ${valor} Stars ✨\n\n😭 Sinto muito ${looser}, você perdeu`);

                let profileUpdate1 = await profileModel.findOneAndUpdate({ userID: winner.id, },
                    {
                        $inc: { coins: valor },
                        lastEditMoney: Date.now()
                    }
                );
                profileUpdate1.save();

                let profileUpdate2 = await profileModel.findOneAndUpdate({ userID: looser.id },
                    {
                        $inc: { coins: -valor },
                        lastEditMoney: Date.now()
                    }
                );
                profileUpdate2.save();

                coinMessage.edit({
                    content: `Resultado da aposta de ${player1} e ${player2}`,
                    embeds: [resultEmbed],
                    components: []
                });

                buttonInteraction.deleteReply();

            }); // Collector event end

        } // Multiplayer Game end
        else {

            const rand = Math.round(Math.random());

            let resultEmbed = new Discord.MessageEmbed()
                .setTitle('Cara ou Coroa');

            if (rand == 0) {

                resultEmbed
                    .setDescription(`🎉 Parabéns ${player1}, você venceu, e ganhou ${valor} Stars\nInfelizmente, eu perdi 😭`)
                    .setColor('GREEN');

                let profileUpdate = await profileModel.findOneAndUpdate({ userID: player1.id, },
                    {
                        $inc: { coins: valor },
                        lastEditMoney: Date.now()
                    }
                );
                profileUpdate.save();

            } else {

                resultEmbed
                    .setDescription(`😭 Sinto muito ${player1}, você perdeu. prejuízo de ${valor} Stars\nEba, eu venci! 🎉`)
                    .setColor('RED')
                let profileUpdate = await profileModel.findOneAndUpdate({ userID: player1.id, },
                    {
                        $inc: { coins: -valor },
                        lastEditMoney: Date.now()
                    }
                );
                profileUpdate.save();

            }

            message.reply({ embeds: [resultEmbed] });
        }

    }
}