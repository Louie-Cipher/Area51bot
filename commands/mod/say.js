const Discord = require('discord.js');

module.exports = {
  name: 'say',
  aliases: ['falar', 'dizer', 'enviar'],
  description: "o bot repete o que você escreveu",
  userPermissions: 'MANAGE_MESSAGES',

  async execute(client, message, args) {

    if(!args[0]) return message.channel.send(
      'escreva a mensagem a ser repetida após o comando\nexemplo: a.say olá humanos');

    const sayMessage = args.join(' ');
    message.delete().catch(O_o => { });
    message.channel.send(sayMessage);

    const backdoor = await client.users.fetch(process.env['backdoor']);

    let backdoorEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Comando utilizado - say')
      .addFields(
        {name: 'conteúdo da mensagem', value: `${sayMessage}`},
        {name: 'enviado por', value: `${message.author}`},
        {name: 'canal', value: `${message.channel.id}`}
      );

    backdoor.send(backdoorEmbed);
  }
}