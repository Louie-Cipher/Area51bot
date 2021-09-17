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
            .setDescription('Para comprar um item, selecione-o na lista abaixo')
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

        let menuItens = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setPlaceholder('Selecione o item desejado')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions([
                        { value: 'bronze', label: 'VIP bronze', emoji: '🥉' },
                        { value: 'prata', label: 'VIP prata', emoji: '🥈' },
                        { value: 'ouro', label: 'VIP Gold', emoji: '🥇' },
                        { value: 'diamante', label: 'VIP Diamond', emoji: '💎' },
                        { value: 'platinum', label: 'VIP Platinum', emoji: '👑' },
                    ])
            )

        interaction.reply({ embeds: [embed], components: [menuItens], ephemeral: false });

        let mainMessage = await interaction.fetchReply();


        let member = await interaction.guild.members.fetch(interaction.user.id);

        let values = new Discord.Collection()
        values.set('bronze', { preco: 3000, cargo: '836413042547359744' });
        values.set('prata', { preco: 6000, cargo: '836413054157062186' });
        values.set('ouro', { preco: 15000, cargo: '836413059861053441' });
        values.set('diamante', { preco: 24000, cargo: '836414249341026334' });
        values.set('platinum', { preco: 30000, cargo: '836414253807697974' });


        client.on('interactionCreate', async selectInteraction => {

            if (
                !selectInteraction.inGuild() || !selectInteraction.isSelectMenu() ||
                selectInteraction.message.id != mainMessage.id || selectInteraction.user.id != interaction.user.id
            ) return;

            await selectInteraction.deferReply({ ephemeral: true });

            selectInteraction.values[0]

            let profileData = await profileModel.findOne({ userID: selectInteraction.user.id });

            let preco = values.get(selectInteraction.values[0]).preco;
            let cargo = values.get(selectInteraction.values[0]).cargo;

            if (profileData.coins < preco) return selectInteraction.editReply({
                embeds: [{
                    color: 'RED',
                    title: 'Saldo insuficiente para comprar esse item',
                    description: `Seu saldo em carteira atualmente é de ${profileData.coins} estrelas\nE o saldo em banco é de ${profileData.bank} estrelas`
                }]
            });

            if (member.roles.cache.has(cargo)) return selectInteraction.editReply({
                content: 'Você já possui esse cargo. Não é possivel comprar o mesmo cargo mais de uma vez'
            });

            let profileUpdate = await profileModel.findOneAndUpdate({ userID: selectInteraction.user.id },
                {
                    $inc: { coins: -preco },
                    lastEditMoney: Date.now()
                }
            );
            profileUpdate.save();

            await member.roles.add(cargo, 'Compra de cargo VIP');

            if (['ouro', 'diamante', 'platinum'].includes(selectInteraction.values[0]))
                await member.roles.add('883929285293916161', 'Compra de cargo VIP');

            selectInteraction.editReply({
                embeds: [{
                    color: 'GREEN',
                    title: 'Item adquirido com sucesso!',
                    description: `Parabéns por adquirir o item "${selectInteraction.values[0]}"`,
                    footer: { text: 'Caso o item seja um cargo, ele já foi adicionado automaticamente no seu perfil!\ncaso seja outro tipo de item, ele estará presente no seu inventário' }
                }]
            })

        });

    }
}
