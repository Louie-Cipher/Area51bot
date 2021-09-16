const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('exibe itens da loja intergaláctica'),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        let embed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Loja intergaláctica')
            .setDescription('Para comprar um item, selecione os botões abaixo de acordo com o item desejado')
            .addFields(
                { name: 'Tabela de preços', value: '\u200B' },
                { name: 'VIP Bronze', value: '3.000 estrelas', inline: true },
                { name: 'VIP Prata', value: '6.000 estrelas', inline: true },
                { name: 'VIP Gold', value: '15.000 estrelas', inline: true },
                { name: 'VIP Diamond', value: '24.000 estrelas', inline: true },
                { name: 'VIP Platinum', value: '30.000 estrelas', inline: true },
            );


        let buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('bronze')
                    .setEmoji('🥉')
                    .setLabel('VIP bronze')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('prata')
                    .setEmoji('🥈')
                    .setLabel('VIP Prata')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('ouro')
                    .setEmoji('🥇')
                    .setLabel('VIP Gold')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('diamante')
                    .setEmoji('💎')
                    .setLabel('VIP Diamond')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('platinum')
                    .setEmoji('👑')
                    .setLabel('VIP Platinum')
                    .setStyle('PRIMARY'),
            );

        interaction.reply({ embeds: [embed], components: [buttons], ephemeral: false });

        let mainMessage = await interaction.fetchReply();

        client.on('interactionCreate', async buttonInteraction => {

            await buttonInteraction.fetchReply({ ephemeral: true });

            if (
                !buttonInteraction.inGuild() || !buttonInteraction.isButton() ||
                buttonInteraction.message.id != mainMessage.id || buttonInteraction.user.id != interaction.user.id
            ) return;

            let profileData = await profileModel.findOne({ userID: interaction.user.id });

            let preco = 0;

            if (buttonInteraction.customId == 'bronze') preco = 3000
            else if (buttonInteraction.customId == 'prata') preco = 6000
            else if (buttonInteraction.customId == 'ouro') preco = 15000
            else if (buttonInteraction.customId == 'diamante') preco = 24000
            else if (buttonInteraction.customId == 'platinum') preco = 30000

            if (profileData.coins < preco) return buttonInteraction.editReply({
                embeds: [{
                    title: 'Saldo insuficiente para comprar esse item',
                    description: `Seu saldo em carteira atualmente é de ${profileData.coins} estrelas\nE o saldo em banco é de ${profileData.bank} estrelas`
                }]
            });

            let cargo;
            if (buttonInteraction.customId == 'bronze') cargo = '836413042547359744'
            else if (buttonInteraction.customId == 'prata') cargo = '836413054157062186'
            else if (buttonInteraction.customId == 'ouro') cargo = '836413059861053441'
            else if (buttonInteraction.customId == 'diamante') cargo = '836414249341026334'
            else if (buttonInteraction.customId == 'platinum') cargo = '836414253807697974'

            let member = await interaction.guild.members.fetch(interaction.user.id);

            if (member.roles.cache.has(cargo)) return buttonInteraction.editReply({
                content: 'Você já possui esse cargo. Não é possivel comprar o mesmo cargo mais de uma vez'
            });

            let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id },
                {
                    $inc: { coins: -preco },
                    lastEditMoney: Date.now()
                }
            );
            profileUpdate.save();

            member.roles.add(cargo);

            buttonInteraction.editReply({
                embeds: [{
                    title: 'Item adquirido com sucesso!',
                    description: `Parabéns por adquirir o item "${buttonInteraction.customId}"`,
                    footer: {text: 'Caso o item seja um cargo, ele já foi adicionado automaticamente no seu perfil!\ncaso seja outro tipo de item, ele estará presente no seu inventário'}
                }]
            })

        });

    }
}
