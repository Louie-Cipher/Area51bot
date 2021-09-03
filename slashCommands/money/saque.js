const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saque')
        .setDescription('transfere as estrelas do banco para sua carteira')
        .addStringOption(option =>
            option.setName('valor')
                .setDescription('o valor que deseja sacar (ou "tudo")')
                .setRequired(true)
        ),



    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        let profileData = await profileModel.findOne({ userID: interaction.user.id });

        if (!profileData) return interaction.editReply({ content: 'Houve um erro de comunicação com o banco de dados. por favor, tente novamente mais tarde' });

        let valueString = await interaction.options.get('valor', true).value;

        let value = 0;

        if (['all', 'tudo', 'total'].includes(valueString)) {
            value = profileData.bank
        } else {
            value = parseInt(valueString, 10);
        }

        let dateNow = new Date();

        if (value == 0 || value == NaN || value < 1) return interaction.editReply({
            embeds: [{
                color: '#ff5900',
                title: 'Valor informado inválido',
                description: 'O valor precisa ser um número inteiro (sem virgula), e positivo'
            }]
        });

        let failEmbed = new Discord.MessageEmbed()
            .setColor('#b3c20c')
            .setTitle('Você não possui esse valor na carteira para sacar')
            .setDescription(`Você atualmente tem ${profileData.coins} stars na carteira, e ${profileData.bank} no banco`);

        if (profileData.bank < valor) return message.reply({ embeds: [failEmbed] });

        let profileUpdate = await profileModel.findOneAndUpdate(
            {
                userID: message.author.id,
            }, {
            $inc: {
                bank: -valor,
                coins: valor
            },
            lastEditMoney: dateNow
        }
        );
        profileUpdate.save();

        let embed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('Saque efetuado com sucesso')
            .addFields(
                { name: 'valor', value: valor.toString() },
                { name: 'valor atual na carteira', value: (profileData.coins + valor).toString() },
                { name: 'saldo atual no banco', value: (profileData.bank - valor).toString() }
            );

        interaction.editReply({ embeds: [embed] });

    }
}