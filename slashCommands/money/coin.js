const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('aposta no cara ou coroa')
        .addIntegerOption(option =>
            option.setName('valor')
                .setDescription('o valor que deseja apostar')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('lado')
                .setDescription('o lado da moeda em que deseja apostar')
                .setRequired(false)
                .addChoice('cara', 'cara')
                .addChoice('coroa', 'coroa')
        ),



    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: false })

        let value = await interaction.options.get('valor', true).value;

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

        let values = ['cara', 'coroa'];

        let lado = await interaction.options.getString('lado', false);

        if (!lado || lado === undefined) lado = values[Math.floor(Math.random() * 2)]


        let user = values.indexOf(lado);
        let bot = Math.floor(Math.random() * 2);

        let embed = new Discord.MessageEmbed()
            .setTitle('Cara ou coroa');

        let description =
            `Você escolheu: **${values[user]}**\n O Resultado foi: **${values[bot]}**\n\n`;

        if (user == bot) {
            embed.setColor('GREEN');
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
        else {
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


        embed.setDescription(description + result)

        interaction.editReply({ embeds: [embed], ephemeral: false });

    }
}