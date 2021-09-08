const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jokenpo')
        .setDescription('joga uma partida de pedra papel tesoura')
        .addIntegerOption(option =>
            option.setName('valor')
                .setDescription('caso deseje apostar, informe o valor')
                .setRequired(false)
        ),


    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: false })

        let aposta = false;

        let betValue = interaction.options.getInteger('valor', false);

        let profileData;

        if (betValue && betValue != NaN) {

            profileData = await profileModel.findOne({ userID: interaction.user.id });

            if (profileData.coins < betValue) return interaction.editReply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `Seu saldo em carteira atual é de ${profileData.coins} estrelas`
                }]
            });

            aposta = true;

        }

        let startEmbed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('Pedra 🪨 papel 📃 tesoura ✂')
            .setDescription('Para jogar, clique nos botões abaixo');

        let startButtons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('pedra')
                    .setLabel('pedra')
                    .setEmoji('🪨')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('papel')
                    .setLabel('papel')
                    .setEmoji('📃')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('tesoura')
                    .setLabel('tesoura')
                    .setEmoji('✂')
                    .setStyle('PRIMARY')
            );

        await interaction.editReply({
            embeds: [startEmbed],
            components: [startButtons]
        });

        let gameMessage = await interaction.fetchReply();

        const values = ['pedra', 'papel', 'tesoura'];
        const emojis = ['🪨', '📃', '✂'];

        let rounds = 0;
        let vitorias = 0;
        let derrotas = 0;
        let empates = 0;
        let ganhos = 0;

        let vitoriaPercent = ''
        let derrotaPercent = ''
        let empatePercent = ''

        client.on('interactionCreate', async buttonInteraction => {

            if (!buttonInteraction.isButton() || buttonInteraction.message.id != gameMessage.id || buttonInteraction.user.id != interaction.user.id)
                return;

            if (values.includes(buttonInteraction.customId)) {

                await buttonInteraction.deferReply({ ephemeral: false });

                rounds++

                const player = values.indexOf(buttonInteraction.customId);

                const playerValue = values[player];
                const playerEmoji = emojis[player];

                const bot = Math.floor(Math.random() * 3);

                const botValue = values[bot];
                const botEmoji = emojis[bot];

                let resultEmbed = new Discord.MessageEmbed()
                    .setTitle('Pedra 🪨 papel 📃 tesoura ✂');

                let description = `Você jogou ${playerValue} ${playerEmoji}\nEu joguei ${botValue} ${botEmoji}\n\n`

                if (playerValue == botValue) {
                    empates++
                    resultEmbed.setColor('YELLOW');
                    description += 'Foi um empate! 🤝';
                    if (aposta === true) {
                        description += `\nVocê não ganhou nem perdeu seus ${betValue} estrelas`;
                    }

                } else if (
                    (playerValue == 'pedra' && botValue == 'tesoura') ||
                    (playerValue == 'papel' && botValue == 'pedra') ||
                    (playerValue == 'tesoura' && botValue == 'papel')
                ) {
                    vitorias++
                    ganhos += betValue;
                    resultEmbed.setColor('GREEN');
                    description += `🎉 Parabéns ${interaction.user}, você venceu!\n\n😭 Infelizmente, eu perdi`;

                    if (aposta === true) {
                        description += `\nVocê ganhou ${betValue} estrelas`;

                        let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                            $inc: { coins: betValue }
                        });
                        profileUpdate.save();
                    }

                } else {

                    derrotas++
                    ganhos -= betValue;
                    resultEmbed.setColor('RED');
                    description += `😭 Sinto muito ${interaction.user}, você perdeu.\n\n🎉 Eba, eu venci!`

                    if (aposta === true) {
                        description += `\nVocê perdeu ${betValue} estrelas`;

                        let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                            $inc: { coins: -betValue }
                        });
                        profileUpdate.save();
                    }

                }

                vitoriaPercent = ((vitorias * 100) / rounds).toFixed(2);
                derrotaPercent = ((derrotas * 100) / rounds).toFixed(2);
                empatePercent = ((empates * 100) / rounds).toFixed(2);

                if (vitoriaPercent.endsWith('00')) vitoriaPercent = vitoriaPercent.substring(0, vitoriaPercent.length - 3);
                if (derrotaPercent.endsWith('00')) derrotaPercent = derrotaPercent.substring(0, derrotaPercent.length - 3);
                if (empatePercent.endsWith('00')) empatePercent = empatePercent.substring(0, empatePercent.length - 3);

                resultEmbed
                    .setDescription(description)
                    .addFields(
                        { name: 'partidas', value: rounds.toString(), inline: true },
                        { name: 'vitórias', value: `${vitorias} • ${vitoriaPercent}%`, inline: true },
                        { name: 'derrotas', value: `${derrotas} • ${derrotaPercent}%`, inline: true },
                        { name: 'empates', value: `${empates} • ${empatePercent}%`, inline: true }
                    );

                if (aposta === true && betValue != NaN) resultEmbed.addField('ganhos', ganhos.toString(), true);

                let playAgain = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('again')
                            .setLabel('jogar novamente')
                            .setEmoji('🔁')
                            .setStyle('SUCCESS')
                    );



                gameMessage.edit({
                    embeds: [resultEmbed],
                    components: [playAgain]
                })

                buttonInteraction.deleteReply()

            }
            else if (buttonInteraction.customId == 'again') {

                if (aposta === true && ganhos * -1 > profileData.coins) return buttonInteraction.reply({ content: 'Você não possui mais saldo suficiente para continuar essa aposta', ephemeral: true });

                buttonInteraction.deferReply({ ephemeral: false });

                let newGameEmbed = new Discord.MessageEmbed()
                    .setColor('#00ffff')
                    .setTitle('Pedra 🪨 papel 📃 tesoura ✂')
                    .setDescription('Para jogar, clique nos botões abaixo')
                    .addFields(
                        { name: 'partidas', value: rounds.toString(), inline: true },
                        { name: 'vitórias', value: `${vitorias} • ${vitoriaPercent}%`, inline: true },
                        { name: 'derrotas', value: `${derrotas} • ${derrotaPercent}%`, inline: true },
                        { name: 'empates', value: `${empates} • ${empatePercent}%`, inline: true }
                    );

                if (aposta === true && betValue != NaN) newGameEmbed.addField('ganhos', ganhos.toString(), true);

                gameMessage.edit({
                    embeds: [newGameEmbed],
                    components: [startButtons]
                });

                buttonInteraction.deleteReply()

            }



        });

    }
}
