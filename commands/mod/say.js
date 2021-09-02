const Discord = require('discord.js');

module.exports = {
  name: 'say',
  aliases: ['falar', 'dizer', 'enviar'],
  description: "o bot repete o que você escreveu",
  userPermissions: 'MANAGE_MESSAGES',

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    if (!args[0]) return message.reply({ content: 'escreva a mensagem a ser repetida após o comando\nexemplo: a.say olá humanos' });

    const sayMessage = args.join(' ');
    try {
      message.delete()
    } catch (error) {
      console.error(error)
    }

    message.channel.send({ content: sayMessage });

    const secure = await client.users.fetch(process.env['louie']);

    let secureEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Comando utilizado - say')
      .addFields(
        { name: 'conteúdo da mensagem', value: `${sayMessage}` },
        { name: 'enviado por', value: `${message.author}` },
        { name: 'canal', value: `${message.channel.name}` }
      );

    secure.send({embeds: [secureEmbed]});
  }
}