const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    name: 'velha',
    aliases: ['tictactoe', 'jogodavelha', 'jogovelha'],
    description: "uma partida de jogo da velha por reações com emojis",

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    async execute(client, message, args) {

        let player1 = message.author;
        let player2 = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!args[0] || !player2) return message.reply({
            embeds: [{
                title: 'Usuário informado não encontrado',
                description: 'Você precisa mencionar alguém para jogar jogo da velha'
            }]
        });

        if (player2.id == client.user.id) return message.reply({
            embeds: [{
                title: 'Desculpa, eu não sei jogar jogo da velha, ainda',
                description: 'Quem sabe na próxima atualização a Louie me ensine a jogar 😊'
            }]
        });

        if (player2.bot) return message.reply({
            embeds: [{
                title: '🤖 Bip bop',
                description: 'Acho que meus colegas bots não sabem jogar jogo da velha...'
            }]
        });

        if (player1.id == player2.id) return message.reply({ content: 'Ei, você não pode jogar jogo da velha solo!' });

        let aposta = false;
        let betValue = parseInt(args[1]);

        if (args[1] && betValue != NaN && betValue > 0) {

            let profileData1 = await profileModel.findOne({ userID: player1.id });

            if (profileData1.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `Seu saldo em carteira atual é de ${profileData1.coins} estrelas`
                }]
            });

            let profileData2 = await profileModel.findOne({ userID: player2.id });

            if (!profileData2) return message.reply({
                embeds: [{
                    title: 'Usuário não encontrado no banco de dados',
                    description: `Um perfil será criado assim que o usuário enviar a primeira mensagem`
                }]
            });

            if (profileData2.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `${player2} não tem saldo em carteira para essa aposta`
                }]
            });

            aposta = true;

        }

        const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

        const empty = '⬜';

        let emojis = new Discord.Collection();

        let line1 = new Discord.MessageActionRow();
        let line2 = new Discord.MessageActionRow();
        let line3 = new Discord.MessageActionRow();

        let i = 1;
        numbers.forEach(number => {
            let line;
            if (i >= 1 && i <= 3) line = line1
            else if (i >= 4 && i <= 6) line = line2
            else line = line3;

            line.addComponents(
                new Discord.MessageButton()
                    .setCustomId(number)
                    .setLabel(empty)
                    .setStyle('PRIMARY')
            );

            emojis.set(number, empty);

            i++
        });


        let startEmbed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('⭕ Jogo da Velha ❎')
            .setDescription('Para jogar, clique nos botões abaixo')
            .addField('vez de', player1.toString());

        if (aposta === true) startEmbed.addField('valor da aposta', betValue.toString());


        let gameMessage = await message.reply({
            embeds: [startEmbed],
            components: [line1, line2, line3]
        });


        let partidas = 1;
        let vitoriasP1 = 0;
        let vitoriasP2 = 0;
        let empates = 0;

        let playAgain = [];

        let round = 1;
        let playerRound = player1;

        let playerEmoji;

        //--BUTTON EVENT--//
        client.on('interactionCreate', async interaction => {

            if (
                !interaction.inGuild() || !interaction.isButton() || interaction.message.id != gameMessage.id ||
                (interaction.user.id == player1.id && interaction.user.id == player2.id)
            ) return;

            await interaction.deferReply({ ephemeral: false });

            if (numbers.includes(interaction.customId) && playerRound.id == interaction.user.id) {

                if (round % 2 != 0) playerEmoji = '❎';
                else playerEmoji = '⭕';

                let jogada = interaction.customId;

                emojis.delete(jogada);
                emojis.set(jogada, playerEmoji);

                let otherPlayer = player1;
                if (playerRound.id == player1.id) otherPlayer = player2

                let roundEmbed = new Discord.MessageEmbed()
                    .setColor('#00ffff')
                    .setTitle('⭕ Jogo da Velha ❎')
                    .setDescription('Para jogar, clique nos botões abaixo')
                    .addField('vez de', otherPlayer.toString());

                let newLine1 = new Discord.MessageActionRow();
                let newLine2 = new Discord.MessageActionRow();
                let newLine3 = new Discord.MessageActionRow();

                let n = 1;
                numbers.forEach(number => {
                    let line;
                    if (n >= 1 && n <= 3) line = newLine1;
                    else if (n >= 4 && n <= 6) line = newLine2;
                    else line = newLine3;

                    let label = emojis.get(number);
                    let disabled = false;

                    if (label != empty) disabled = true

                    line.addComponents(
                        new Discord.MessageButton()
                            .setCustomId(number)
                            .setLabel(label)
                            .setDisabled(disabled)
                            .setStyle('PRIMARY')
                    );
                    n++
                });


                gameMessage.edit({
                    embeds: [roundEmbed],
                    components: [newLine1, newLine2, newLine3]
                });

                round++

                //--VERIFICAR SE A PARTIDA ACABOU--//

                const emoji1 = emojis.get('one');
                const emoji2 = emojis.get('two');
                const emoji3 = emojis.get('three');
                const emoji4 = emojis.get('four');
                const emoji5 = emojis.get('five');
                const emoji6 = emojis.get('six');
                const emoji7 = emojis.get('seven');
                const emoji8 = emojis.get('eight');
                const emoji9 = emojis.get('nine');

                if (
                    [emoji1, emoji2, emoji3].every(emoji => emoji != empty && emoji == emoji3) ||
                    [emoji4, emoji5, emoji6].every(emoji => emoji != empty && emoji == emoji6) ||
                    [emoji7, emoji8, emoji9].every(emoji => emoji != empty && emoji == emoji9) ||
                    //vertical
                    [emoji1, emoji4, emoji7].every(emoji => emoji != empty && emoji == emoji1) ||
                    [emoji2, emoji5, emoji8].every(emoji => emoji != empty && emoji == emoji2) ||
                    [emoji3, emoji6, emoji9].every(emoji => emoji != empty && emoji == emoji3) ||
                    //diagonal
                    [emoji1, emoji5, emoji9].every(emoji => emoji != empty && emoji == emoji1) ||
                    [emoji3, emoji5, emoji7].every(emoji => emoji != empty && emoji == emoji3)
                ) {

                    if (playerRound.id == player1.id) vitoriasP1++;
                    else vitoriasP2++

                    let resultEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffff')
                        .setTitle('⭕ Fim de jogo ❎')
                        .setDescription(`🎉 Parabéns ${playerRound}. Você ganhou!\n😭 Sinto muito ${otherPlayer}. você perdeu!`)
                        .addFields(
                            { name: 'partidas', value: partidas.toString() },
                            { name: `vitórias de ${player1.tag}`, value: vitoriasP1.toString() },
                            { name: `vitórias de ${player2.tag}`, value: vitoriasP2.toString() },
                            { name: 'empates', value: empates.toString() }
                        );

                    let playAgainButton = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('again')
                                .setLabel('jogar novamente')
                                .setEmoji('🔁')
                                .setStyle('SUCCESS')
                        );

                    if (aposta === true && betValue != NaN && betValue > 0) {

                        let profileUpdate1 = await profileModel.findOneAndUpdate({ userID: playerRound.id },
                            {
                                $inc: { coins: betValue },
                                lastEditMoney: Date.now()
                            }
                        );
                        profileUpdate1.save();

                        let profileUpdate2 = await profileModel.findOneAndUpdate({ userID: otherPlayer.id },
                            {
                                $inc: { coins: -betValue },
                                lastEditMoney: Date.now()
                            }
                        );
                        profileUpdate2.save();

                    }

                    //desabilitar todos os botões pra ninguém alterar a partida finalizada
                    newLine1.components.forEach(component => {
                        component.setDisabled(true)
                    });
                    newLine2.components.forEach(component => {
                        component.setDisabled(true)
                    });
                    newLine3.components.forEach(component => {
                        component.setDisabled(true)
                    });

                    gameMessage.edit({
                        embeds: [resultEmbed],
                        components: [newLine1, newLine2, newLine3, playAgainButton]
                    });

                    //--VERIFICAR SE DEU VELHA--//
                } else if (round == 9) {
                    empates++
                    let resultEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffff')
                        .setTitle('⭕ Fim de jogo ❎')
                        .setDescription(`Deu velha! empate 🤝`)
                        .addFields(
                            { name: 'partidas', value: partidas.toString() },
                            { name: `vitórias de ${player1.tag}`, value: vitoriasP1.toString() },
                            { name: `vitórias de ${player2.tag}`, value: vitoriasP2.toString() },
                            { name: 'empates', value: empates.toString() }
                        );

                    let playAgainButton = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('again')
                                .setLabel('jogar novamente')
                                .setEmoji('🔁')
                                .setStyle('SUCCESS')
                        );

                    gameMessage.edit({
                        embeds: [resultEmbed],
                        components: [newLine1, newLine2, newLine3, playAgainButton]
                    });
                }

                if (playerRound.id == player2.id) playerRound = player1;
                else playerRound = player2;

                interaction.deleteReply();

            }
            else if (interaction.customId == 'again' && !playAgain.includes(interaction.user.id)) {

                playAgain.push(interaction.user.id);
                let otherPlayer = player1;
                if (interaction.user.id == player1.id) otherPlayer = player2

                if (playAgain.length == 1) return interaction.editReply({
                    content: `Okay ${interaction.user}, você votou para jogar mais uma partida. esperando ${otherPlayer} votar`
                });


                //resetar valores da partida
                playAgain = [];
                round = 1;
                i = 1;
                numbers.forEach(number => {
                    let line;
                    if (i >= 1 && i <= 3) line = line1
                    else if (i >= 4 && i <= 6) line = line2
                    else line = line3;

                    line.addComponents(
                        new Discord.MessageButton()
                            .setCustomId(number)
                            .setLabel(empty)
                            .setStyle('PRIMARY')
                    );

                    emojis.set(number, empty);

                    i++
                });

                partidas++

                //começar outra emocionante partida
                gameMessage.edit({
                    embeds: [startEmbed],
                    components: [line1, line2, line3]
                });

            }


        })

    }
}