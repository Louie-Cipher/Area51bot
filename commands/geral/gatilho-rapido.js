const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    name: 'gatilho-rapido',
    aliases: ['gatilho-rápido', 'saque-rapido', 'saque-rápido', 'gun'],
    description: "um jogo de atirar e recarregar sua arma",

    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */

    async execute(client, message, args) {

        let aposta = false;
        let betValue = 0;

        const player1 = message.author;
        const player2 = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!player2) return message.reply({ content: 'usuário informado não encontrado' });

        if (player2.id == client.user.id || player1.id == player2.id) return message.reply({ content: 'Para jogar solo (contra o bot), utilize /gatilho-rapido' });

        if (player2.bot) return message.reply({
            embeds: [{
                title: '<:bot_tag:861720010283417611> Bip bop',
                description: 'Acho que meus colegas bots não sabem jogar esse jogo...'
            }]
        });

        let profile1Data;
        let profile2Data;

        if (args[1]) {

            betValue = parseInt(args[1], 10);

            if (!betValue || betValue == NaN) return message.reply({
                embeds: [{
                    title: 'Valor informado inválido',
                    description: `Caso deseje apostar, digite o valor após o nome da pessoa\nExemplo: a.gatilho-rapido @pessoa 200`
                }]
            });

            profile1Data = await profileModel.findOne({ userID: message.author.id });

            if (profile1Data.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `Seu saldo em carteira atual é de ${profile1Data.coins} estrelas`
                }]
            });

            profile2Data = await profileModel.findOne({ userID: player2.id });

            if (!profile2Data) return message.reply({ content: `usuário informado não encontrado no banco de dados\nUm perfil será criado automaticamente quando ${player2} enviar uma mensagem` });

            if (profile2Data.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `${player2} não possui esse valor em carteira para apostar`
                }]
            });

            aposta = true;

        }

        let startEmbed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setTitle('🔫 Gatilho Rápido')
            .setThumbnail('https://64.media.tumblr.com/7587c2cea0235edbd082b54aa93334c4/df4f8432524595f1-e8/s540x810/3a90cf31314ccffa349fe212617cb6a068829e26.gif')
            .setDescription(`Clique nos botões abaixo para jogar`)
            .addField('Regras', `Você começa com 1 bala.
        você tem 3 opções a cada rodada:
        **1 •** Recarregar: acrescenta 1 bala a sua munição;
        **2 •** Atirar: Dispara contra o inimigo diminuindo uma bala
        **3 •** Defender: Usa seu escudo e bloqueia o tiro do inimigo\n
        O vencedor é aquele que conseguir atingir o inimigo primeiro
        🤠 Boa sorte, forasteiros!`)

        if (aposta === true) startEmbed.addField('Valor da aposta', `${betValue}`);

        let startButtons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('recarregar')
                    .setLabel('recarregar')
                    .setStyle('PRIMARY')
                    .setEmoji('🔄'),
                new Discord.MessageButton()
                    .setCustomId('atirar')
                    .setLabel('atirar')
                    .setStyle('PRIMARY')
                    .setEmoji('🔫'),
                new Discord.MessageButton()
                    .setCustomId('defender')
                    .setLabel('defender')
                    .setStyle('PRIMARY')
                    .setEmoji('🛡'),
            );

        let gameMessage = await message.reply({
            content: `Olá ${player2}\n${player1} deseja desafiar você para um desafio de "gatilho rápido"`,
            embeds: [startEmbed],
            components: [startButtons]
        });

        let playAgainButton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('again')
                    .setLabel('Jogar Novamente')
                    .setStyle('SUCCESS')
                    .setEmoji('↩')
            );

        const movimentos = ['recarregar', 'atirar', 'defender'];
        const emojis = ['🔄', '🔫', '🛡'];

        let p1Balas = 1;
        let p2Balas = 1;
        let round = 1;

        let partidas = 1;
        let vitoriasP1 = 0;
        let vitoriasP2 = 0;
        let empates = 0;

        let lucroP1 = 0;
        let lucroP2 = 0;

        let playAgain = [];

        let playersMap = new Discord.Collection();

        client.on('interactionCreate', async interaction => {

            if (
                !interaction.inGuild() || !interaction.isButton() || interaction.message.id != gameMessage.id ||
                (interaction.user.id != player1.id && interaction.user.id != player2.id)
            ) return;

            const roundPlayer = (interaction.user.id == player1.id) ? player1 : player2;
            const otherPlayer = (interaction.user.id == player1.id) ? player2 : player1;

            const move = interaction.customId;

            if (movimentos.includes(interaction.customId)) {

                // Retornar caso player já tenha escolhido seu movimento
                if (playersMap.has(interaction.user.id)) return interaction.reply({
                    content: `Opa ${roundPlayer}, você já escolheu sua ação! Aguarde ${otherPlayer} jogar`,
                    ephemeral: true
                });

                if (// Retornar caso player esteja sem balas
                    (p1Balas == 0 && roundPlayer.id == player1.id && move == 'atirar') ||
                    (p2Balas == 0 && roundPlayer.id == player2.id && move == 'atirar')
                ) return interaction.reply({
                    content: `Opa ${roundPlayer}, você está sem balas! Escolha outra ação`,
                    ephemeral: true
                });

                await interaction.deferReply({ ephemeral: false });

                playersMap.set(interaction.user.id, interaction.customId);

                if (playersMap.size == 1) return interaction.deleteReply();

                round++

                const p1Move = playersMap.get(player1.id);
                const p2Move = playersMap.get(player2.id);
                const p1Number = movimentos.indexOf(p1Move);
                const p2number = movimentos.indexOf(p2Move);
                const p1Emoji = emojis[p1Number];
                const p2Emoji = emojis[p2number];

                if (p1Move == 'recarregar') p1Balas++
                else if (p1Move == 'atirar') p1Balas--

                if (p2Move == 'recarregar') p2Balas++
                else if (p2Move == 'atirar') p2Balas--

                let roundEmbed = new Discord.MessageEmbed()
                    .setColor(startEmbed.color)
                    .setTitle(startEmbed.title)
                    .setThumbnail(startEmbed.thumbnail.url)
                    .addFields(
                        { name: 'Round', value: `${round}`, inline: true },
                        { name: `Balas de ${player1.username}`, value: `${p1Balas}`, inline: true },
                        { name: `Balas de ${player2.username}`, value: `${p2Balas}`, inline: true },
                    );

                let description = `${player1.username} escolheu **${p1Move}** ${p1Emoji}\n\n${player2.username} escolheu **${p2Move}** ${p2Emoji}\n\n`


                if ((p1Move == 'recarregar' && p2Move == 'recarregar') || p1Move == 'defender' || p2Move == 'defender') {
                    // Movimentos que não terminam o jogo

                    description += '⏳ Preparem-se para o próximo round e façam suas novas ações';
                    roundEmbed.setDescription(description);

                    gameMessage.edit({
                        content: `Partida de ${player1} e ${player2}`,
                        embeds: [roundEmbed],
                        components: [startButtons]
                    });

                }
                // Empate morte dupla - game over
                else if (p1Move == 'atirar' && p2Move == 'atirar') {
                    empates++

                    description += '☠ Fogo cruzado! Fim de jogo para vocês 2';
                    if (aposta === true) description += `\n\nVocês não ganharam ou perderam suas ${betValue} estrelas`

                    roundEmbed.setDescription(description)
                        .addFields(
                            { name: 'partidas', value: `${partidas}` },
                            { name: `Vitórias de ${player1.username}`, value: `${vitoriasP1}`, inline: true },
                            { name: `Vitórias de ${player2.username}`, value: `${vitoriasP2}`, inline: true },
                            { name: 'empates', value: `${empates}`, inline: true },
                        );
                    if (aposta === true) roundEmbed.addField('Lucro/prejuízo', `${lucro}`, true);

                    gameMessage.edit({
                        content: `Partida de ${player1} e ${player2}`,
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }
                // Vitória player 1
                else if (p1Move == 'atirar' && p2Move == 'recarregar') {
                    vitoriasP1++;

                    description += `🎉 Parabéns ${player1.username}, você venceu!\n\n☠ ${player2.username} perdeu`;

                    if (aposta === true) {
                        lucroP1 += betValue;
                        let profileUpdate1 = await profileModel.findOneAndUpdate({ userID: player1.id }, {
                            $inc: { coins: betValue }
                        });
                        profileUpdate1.save();

                        let profileUpdate2 = await profileModel.findOneAndUpdate({ userID: player2.id }, {
                            $inc: { coins: -betValue }
                        });
                        profileUpdate2.save();

                        description += `\n\n${player1.username} ganhou ${betValue} estrelas`
                    }
                    roundEmbed.setDescription(description)
                        .addFields(
                            { name: 'partidas', value: `${partidas}` },
                            { name: `Vitórias de ${player1.username}`, value: `${vitoriasP1}`, inline: true },
                            { name: `Vitórias de ${player2.username}`, value: `${vitoriasP2}`, inline: true },
                            { name: 'empates', value: `${empates}`, inline: true },
                        );

                    gameMessage.edit({
                        content: `Partida de ${player1} e ${player2}`,
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }
                // Vitoria player 2
                else if (p1Move == 'recarregar' && p2Move == 'atirar') {
                    vitoriasP2++;

                    description += `🎉 Parabéns ${player2.username}, você venceu!\n\n☠ ${player1} perdeu`;

                    if (aposta === true) {
                        lucroP2 += betValue
                        let profileUpdate1 = await profileModel.findOneAndUpdate({ userID: player1.id }, {
                            $inc: { coins: -betValue }
                        });
                        profileUpdate1.save();

                        let profileUpdate2 = await profileModel.findOneAndUpdate({ userID: player2.id }, {
                            $inc: { coins: betValue }
                        });
                        profileUpdate2.save();

                        description += `\n\n${player2} ganhou ${betValue} estrelas`
                    }

                    roundEmbed.setDescription(description)
                        .addFields(
                            { name: 'partidas', value: `${partidas}` },
                            { name: `Vitórias de ${player1.username}`, value: `${vitoriasP1}`, inline: true },
                            { name: `Vitórias de ${player2.username}`, value: `${vitoriasP2}`, inline: true },
                            { name: 'empates', value: `${empates}`, inline: true },
                        );

                    if (aposta === true) roundEmbed.addFields(
                        { name: `Lucro de ${player1.username}`, value: `${lucroP1}`, inline: true },
                        { name: `Lucro de ${player2.username}`, value: `${lucroP2}`, inline: true }
                    );

                    gameMessage.edit({
                        content: `Partida de ${player1} e ${player2}`,
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }

                playersMap.delete(player1.id);
                playersMap.delete(player2.id);

                interaction.deleteReply();

            }// botões de movimentos end
            else if (interaction.customId == 'again') {

                if (playAgain.includes(interaction.user.id)) return interaction.reply({
                    content: `Você já votou por jogar novamente. espere ${otherPlayer.tag} decidir`,
                    ephemeral: true
                });

                await interaction.deferReply({ ephemeral: false });

                if (aposta === true) {

                    let profileData;
                    if (interaction.user.id == player1.id) profileData = profile1Data;
                    else profileData = profile2Data;

                    if ((roundPlayer.id == player1.id && profileData.coins < lucroP2) || (roundPlayer.id == player2.id && profileData.coins < lucroP1))
                        return interaction.editReply({
                            content: `${interaction.user}, Você não possui mais saldo suficiente para continuar essa aposta`
                        });
                }

                playAgain.push(interaction.user.id);

                if (playAgain.length == 1) {
                    let reply = await interaction.editReply({
                        content: `Okay ${interaction.user}. você votou por jogar novamente. Aguardando ${otherPlayer} decidir`
                    });

                    setTimeout(() => {
                        try { reply.delete() }
                        catch (err) { }
                    }, 5000);
                    return;
                }

                playAgain = []
                playersMap.delete(player1.id);
                playersMap.delete(player2.id);

                round = 0;
                p1Balas = 1;
                p2Balas = 1;
                partidas++

                gameMessage.edit({
                    embeds: [startEmbed],
                    components: [startButtons]
                });

                interaction.deleteReply();

            }

        }); // interaction event end

    }
}