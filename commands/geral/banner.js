const Discord = require("discord.js");

module.exports = {
    name: 'banner',
    aliases: ['capa'],
    description: "mostra o banner de fundo de um usuário",

    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */

    async execute(client, message, args) {

        let user = message.mentions.users.first() || client.users.cache.get(args[0])

        if (args[0] && !user) return message.reply({ content: 'usuário informado não encontrado' });
        if (!user) user = message.author;

        let userFetch = await client.users.fetch(user.id, { force: true });

        let banner = userFetch.bannerURL({ dynamic: true });

        if (!banner) return message.reply({ content: 'Não foi possível obter o banner do usuário informado' });

        let embed = new Discord.MessageEmbed()
            .setColor(userFetch.hexAccentColor || 'RANDOM')
            .setTitle('Banner de ' + user.tag)
            .setImage(banner);


        await message.reply({ embeds: [embed] });

    }
}