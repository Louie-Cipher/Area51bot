const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jokenpo')
        .setDescription('joga uma partida de pedra papel tesoura')
        .addStringOption(option =>
            option.setName('jogadas')
                .setDescription('a jogada que você deseja fazer')
                .setRequired(true)
                .addChoice('pedra', 'pedra')
                .addChoice('papel', 'papel')
                .addChoice('tesoura', 'tesoura')
        )
        .addIntegerOption(option =>
            option.setName('valor')
                .setDescription('o valor que deseja apostar')
                .setRequired(true)
        ),



    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: false })

        let value = await interaction.options.getInteger('valor', true);

        let dateNow = new Date();

        if (!value || value === NaN || value < 1) return interaction.editReply({
            embeds: [{
                color: '#ff5900',
                title: 'Valor informado inválido',
                description: 'O valor precisa ser um número inteiro (sem virgula), e positivo'
            }]
        });

        let profileData = await profileModel.findOne({ userID: interaction.user.id });

        if (!profileData) return interaction.editReply({ content: 'Houve um erro de comunicação com o banco de dados. por favor, tente novamente mais tarde' });

        if (value > profileData.coins || profileData.coins - value < 0) return interaction.editReply({
            embeds: [{
                color: '#ff5900',
                title: 'Você não possui esse valor para apostar',
                description: `Você atualmente possui **${profileData.coins} estrelas**`
            }]
        });

        let jogada = await interaction.options.getString('jogadas', true);

        if ( !['pedra', 'papel', 'tesoura'].includes(jogada) ) return interaction.editReply({
            embeds: [{
                color: 'RED',
                title: 'Jogada informada inválida',
                description: 'Você precisa escolher uma das opções:\n`pedra`, `papel` ou `tesoura`'
            }]
        }); 

        let values = ['pedra', 'papel', 'tesoura'];
        let emojis = ['🪨', '📃', '✂'];

        let user = values.lastIndexOf(jogada);
        let bot = Math.floor(Math.random() * 3);

        let embed = new Discord.MessageEmbed()
            .setTitle('Pedra 🪨 papel 📃 tesoura ✂');

        let description =
            `Você jogou: *${values[user]}* ${emojis[user]}\n Eu joguei: *${values[bot]}* ${emojis[bot]}\n\n`;

        if (user == bot) {
            embed.setColor('YELLOW');
            result = '🤝 Empate. foi um bom jogo';
        }
        else if (
            (values[user] == 'pedra' && values[bot] == 'papel') ||
            (values[user] == 'papel' && values[bot] == 'tesoura') ||
            (values[user] == 'tesoura' && values[bot] == 'pedra')
        ) {
            embed.setColor('RED');
            result = `😭 Sinto muito, você perdeu! prejuízo de ${value} estrelas`;

            let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id },
                {
                    $inc: {
                        coins: -value
                    },
                    lastEditMoney: dateNow
                });
            profileUpdate.save();
        }
        else {
            embed.setColor('GREEN')
            result = `🎉 Parabéns, você venceu! E ganhou ${value} estrelas`

            let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id },
                {
                    $inc: {
                        coins: value
                    },
                    lastEditMoney: dateNow
                });
            profileUpdate.save();
        }

        if (values[user] == 'tesoura' && values[bot] == 'tesoura') {
            result = '✂ Empate ✂\nFoi uma bela partida'
        }

        embed.setDescription(description + result)

        interaction.editReply({ embeds: [embed], ephemeral: false });

    }
}