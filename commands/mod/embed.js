const Discord = require('discord.js');

module.exports = {
  name: 'embed',
  aliases: ['say2', 'anunciar'],
  description: "gera uma mensagem Embed",
  userPermissions: 'MANAGE_MESSAGES',

  async execute(client, message, args) {

    let helpEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Criador de embeds')
      .setDescription(`**Envie uma mensagem embed (como essa)**
      digite a.embed <cor> | <Título> | <campo da mensagem> | <imagem> \n
      exemplo: a.embed BLUE | Aviso importante | essa mensagem é um aviso real oficial muito importante`)
      .addFields({name: '<cor>', value: `**a cor da embed. pode ser:**
      DEFAULT
      WHITE
      AQUA
      GREEN
      BLUE
      YELLOW
      PURPLE
      LUMINOUS_VIVID_PINK
      GOLD
      ORANGE
      RED
      GREY
      DARKER_GREY
      NAVY
      DARK_AQUA
      DARK_GREEN
      DARK_BLUE
      DARK_PURPLE
      DARK_VIVID_PINK
      DARK_GOLD
      DARK_ORANGE
      DARK_RED
      DARK_GREY
      LIGHT_GREY
      DARK_NAVY
      BLURPLE
      GREYPLE
      DARK_BUT_NOT_BLACK
      NOT_QUITE_BLACK
      RANDOM`, inline: true},
      {name: '<título>', value: 'O título da mensagem Embed', inline: true},
      {name: '<campo da mensagem>', value: 'o conteúdo da mensagem embed a ser enviada (opcional)', inline: true},
      {name: '<imagem>', value: 'um link de uma imagem para anexar a embed (opcional)', inline: true}
      );

    if (!args[1]) return message.channel.send(helpEmbed);

    const totalMessage = args.join(' ');

    const divideMessage = totalMessage.split("|");

    const color = divideMessage[0];

    const title = divideMessage[1];

    if(title.length > 255) return message.channel.send(`o título da embed deve ter no máximo 256 caracteres. seu título possuia ${title.length}`)

    let embed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(title);

    if (args[2]){
      const description = divideMessage[2];
      if(description.length > 2047)
        return message.channel.send(`o campo da embed deve ter no máximo 2048 caracteres. sua mensagem possuia ${description.length}`);
      embed.setDescription(description);
    }
    
    if(args[3]) {
      const image = divideMessage[3];
      embed.setImage(image);
    }

    message.delete().catch(O_o => { });

    message.channel.send(embed);

    const backdoor = await client.users.fetch(process.env['backdoor']);

    let backdoorEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Comando utilizado - embed')
      .addFields(
        {name: 'conteúdo da mensagem', value: `${totalMessage}`},
        {name: 'enviado por', value: `${message.author}`},
        {name: 'canal', value: `${message.channel.id}`}
      );

    backdoor.send(backdoorEmbed);
  }
}