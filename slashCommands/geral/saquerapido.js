const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gatilho-rapido')
        .setDescription('um jogo de atirar e recarregar sua arma'),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: false })

        let startEmbed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setTitle('🔫 Saque Rápido ')
            .setThumbnail('https://64.media.tumblr.com/7587c2cea0235edbd082b54aa93334c4/df4f8432524595f1-e8/s540x810/3a90cf31314ccffa349fe212617cb6a068829e26.gif')
            .setDescription(`Clique nos botões abaixo para jogar`)
            .addField('Regras', `Você começa com 1 bala.
            você tem 3 opções a cada rodada:
            1 - Recarregar: acrescenta 1 bala a sua munição;
            2 - Atirar: Disparar contra o inimigo diminuindo uma bala
            3 - Defender: Usa seu escudo e bloqueia o tiro do inimigo\n
            O vencedor é aquele que conseguir atingir o inimigo primeiro
            Boa sorte, forasteiro!`)

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

        let gameMessage = await interaction.editReply({ embeds: [startEmbed], components: [startButtons], fetchReply: true });

        let playerBalas = 1;
        let botBalas = 1;
        let round = 1;
        const movimentos = ['recarregar', 'atirar', 'defender'];
        const emojis = ['🔄', '🔫', '🛡'];

        let playAgainButton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('again')
                    .setLabel('Jogar Novamente')
                    .setStyle('SUCCESS')
                    .setEmoji('↩')
            );

        client.on('interactionCreate', async buttonInteraction => {

            if (!buttonInteraction.isButton() || buttonInteraction.message.id != gameMessage.id || buttonInteraction.user.id != interaction.user.id) return;

            await buttonInteraction.deferReply({ ephemeral: false });

            if (movimentos.includes(buttonInteraction.customId)) {

                const playerNumber = movimentos.indexOf(buttonInteraction.customId);
                let botNumber = Math.floor(Math.random() * 3);

                while (botNumber == 1 && botBalas == 0) {
                    botNumber = Math.floor(Math.random() * 3);
                }

                const playerJogada = movimentos[playerNumber];
                const botJogada = movimentos[botNumber];

                const playerEmoji = emojis[playerNumber];
                const botEmoji = emojis[botNumber];

                if (playerJogada == 'atirar' && playerBalas == 0) return buttonInteraction.editReply({ content: 'Ei, você está sem balas!\Tente outra ação' });

                let roundEmbed = new Discord.MessageEmbed()
                    .setColor(startEmbed.color)
                    .setTitle(startEmbed.title)
                    .setThumbnail(startEmbed.thumbnail.url);

                let description = '';

                if (playerJogada == 'recarregar') playerBalas++
                else if (playerJogada == 'atirar') playerBalas--

                if (botJogada == 'recarregar') botBalas++
                else if (botJogada == 'atirar') botBalas--

                roundEmbed.addFields(
                    { name: 'Round', value: `${round}`, inline: true },
                    { name: 'Suas balas', value: `${playerBalas}`, inline: true },
                    { name: 'Minhas balas', value: `${botBalas}`, inline: true },
                );

                description += `Você escolheu **${playerJogada}** ${playerEmoji}\n\nEu escolhi **${botJogada}** ${botEmoji}\n\n`

                if (
                    (playerJogada == 'recarregar' && botJogada == 'recarregar') ||
                    (playerJogada == 'recarregar' && botJogada == 'defender') ||
                    (playerJogada == 'defender' && botJogada == 'recarregar') ||
                    (playerJogada == 'defender' && botJogada == 'defender')   // Jogadas sem disparos que dão empate
                ) {

                    description += 'Prepare-se para o próximo round';
                    roundEmbed.setDescription(description);

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [startButtons]
                    });

                }
                // Empates com disparos
                else if (playerJogada == 'atirar' && botJogada == 'defender') {

                    description += 'Prepare-se para o próximo round';
                    roundEmbed.setDescription(description);

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [startButtons]
                    });

                } else if (playerJogada == 'defender' && botJogada == 'atirar') {

                    description += 'Prepare-se para o próximo round';
                    roundEmbed.setDescription(description);

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [startButtons]
                    });

                }
                // Empate morte dupla
                else if (playerJogada == 'atirar' && botJogada == 'atirar') {

                    description += '☠ Fogo cruzado! Fim de jogo para nós 2';
                    roundEmbed.setDescription(description);

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }
                // Derrota player
                else if (playerJogada == 'recarregar' && botJogada == 'atirar') {

                    description += '☠ Você perdeu, forasteiro!';
                    roundEmbed.setDescription(description).setColor('RED');

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }
                // Vitória player
                else if (playerJogada == 'atirar' && botJogada == 'recarregar') {

                    description += 'Parabéns, você venceu! ';
                    roundEmbed.setDescription(description).setColor('GREEN');

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }



            } // botões de movimentos end
            else if (buttonInteraction.customId == 'again') {

                round = 0;
                playerBalas = 1;
                botBalas = 1;

                gameMessage.edit({
                    embeds: [startEmbed],
                    components: [startButtons]
                });

            }

            buttonInteraction.deleteReply();


        }); // buttonInteraction event end

    }
}


/*
                if (botJogada == 'atirar') {
                    let gameOverEmbed = new Discord.MessageEmbed()
                        .setColor('DARK_RED')
                        .setTitle('🔫 Saque Rápido - Fim de jogo ☠')
                        .description('Seu inimigo atirou enquanto você estava recarregando!\nFim de jogo, forasteiro')

                    gameMessage.edit({
                        embeds: [gameOverEmbed],
                        components: [playAgainButton]
                    });
                }
                else if (botJogada == 'recarregar') botBalas++
 */