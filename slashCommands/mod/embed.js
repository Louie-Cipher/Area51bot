const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('gera uma mensagem embed')
        .addStringOption(option =>
            option.setName('título')
                .setDescription('o título da embed')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('mensagem')
                .setDescription('o campo principal da mensagem embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('imagem')
                .setDescription('um link de uma imagem para anexar')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('um link de uma imagem para anexar como thumbnail')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('cor')
                .setDescription('a cor da barra lateral')
                .setRequired(false)
                .addChoice('white', 'WHITE')
                .addChoice('aqua', 'AQUA')
                .addChoice('green', 'GREEN')
                .addChoice('blue', 'BLUE')
                .addChoice('yellow', 'YELLOW')
                .addChoice('purple', 'PURPLE')
                .addChoice('gold', 'GOLD')
                .addChoice('orange', 'ORANGE')
                .addChoice('red', 'RED')
                .addChoice('grey', 'GREY')
                .addChoice('darker_grey', 'DARKER_GREY')
                .addChoice('navy', 'NAVY')
                .addChoice('dark_aqua', 'DARK_AQUA')
                .addChoice('dark_green', 'DARK_GREEN')
                .addChoice('dark_blue', 'DARK_BLUE')
                .addChoice('dark_purple', 'DARK_PURPLE')
                .addChoice('dark_gold', 'DARK_GOLD')
                .addChoice('dark_orange', 'DARK_ORANGE')
                .addChoice('dark_red', 'DARK_RED')
                .addChoice('dark_grey', 'DARK_GREY')
                .addChoice('light_grey', 'LIGHT_GREY')
                .addChoice('dark_navy', 'DARK_NAVY')
                .addChoice('blurple', 'BLURPLE')
                .addChoice('greyple', 'GREYPLE')
                .addChoice('random', 'RANDOM')
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.editReply({
            content: 'Você não tem permissão para usar esse comando'
        });

        const titulo = interaction.options.getString('título', true);
        const description = interaction.options.getString('mensagem', true);

        const imagem = interaction.options.getString('imagem', false);
        const thumbnail = interaction.options.getString('thumbnail', false);
        const cor = interaction.options.getString('cor', false) || 'RANDOM';

        let length = titulo.length + description.length + cor.length;

        if (imagem) length += imagem.length;
        if (thumbnail) length += thumbnail.length;

        if (length > 6000) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`A mensagem embed não pode ter mais do que 6000 caracteres no total`)
                .setDescription(`Sua mensagem possuía ${length} caracteres\nDos quais:`)
                .addFields(
                    { name: 'título', value: `${titulo.length} caracteres`, inline: true },
                    { name: 'campo principal', value: `${description.length} caracteres`, inline: true },
                );
            if (imagem) embed.addField('link da imagem', `${imagem.length} caracteres`, true);
            if (thumbnail) embed.addField('link da thumbnail', `${thumbnail.length} caracteres`, true);

            return interaction.editReply({
                embeds: [embed]
            });
        }

        if (titulo.length > 256) return interaction.editReply({
            content: `O título da mensagem deve ter no máximo 256 caracteres
        seu título possuía ${titulo.length} caracteres`
        });

        if (description.length > 4096) return interaction.editReply({
            content: `O campo principal da mensagem deve ter no máximo 4096 caracteres
        sua mensagem possuía ${titulo.length} caracteres`
        });


        if (imagem && !imagem.startsWith('http://') && !imagem.startsWith('https://'))
            return interaction.editReply({ content: 'o campo "imagem" deve ser um link de uma imagem válido,\nque precisa necessariamente começar com `http://` ou `https://`' });

        let embed = new Discord.MessageEmbed()
            .setColor(cor)
            .setTitle(titulo)
            .setDescription(description)
            .setFooter(`enviado por: ${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png', dynamic: false }));

        if (imagem) embed.setImage(imagem);
        if (thumbnail) embed.setThumbnail(thumbnail);

        try {
            await interaction.channel.send({ embeds: [embed] });
            interaction.editReply({ content: '✅  Mensagem embed enviada com sucesso!' });
        } catch (error) {
            interaction.editReply({ content: `❌ Houve um erro ao enviar essa mensagem. erro:\n${error}` });
        }

        if (interaction.user.id !== process.env['louie']) {
            const secure = await client.users.fetch(process.env['louie']);
            let secureEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Comando utilizado - embed')
                .addFields(
                    { name: 'conteúdo da mensagem', value: `${titulo}\n${description}` },
                    { name: 'enviado por', value: `${interaction.user}` },
                    { name: 'canal', value: `${interaction.channel.name}` }
                );
            secure.send({ embeds: [secureEmbed] });
        }

    }
}