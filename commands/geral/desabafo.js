const Discord = require('discord.js');

module.exports = {
  name: 'desabafo',
  aliases: ['desabafar'],
  description: "envia sua mensagem de desabafo no chat \"desabafos\"",
  dmAllow: true,

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    const isDM = message.channel.type == 'DM' ? true : false;

    if (!args[0]) {
      let reply = await message.reply({
        embeds: [{
          color: 'BLURPLE',
          title: 'Desabafo',
          description: `digite sua mensagem de desabafo junto com o comando`,
          footer: { text: `Obs: por padrão, as mensagens de desabafo são pseudo-anônimas\n(apenas a staff pode ver o remetente, para evitar usos indevidos do comando. o remetente não irá ser mostrado publicamente no chat de desabafo)\nmas caso queira se identificar, apenas acrescente seu nome na própria mensagem onde quiser` }
        }]
      });

      if (isDM === false) {
        try { message.delete() } catch (err) { }
        setTimeout(() => {
          try { reply.delete() } catch (err) { }
        }, 10 * 1000);
      }
      return;
    }

    let texto

    for (const word of args) {

      if (word.length == 18) {
        const snowFlake = Discord.SnowflakeUtil.deconstruct(word)
        if (snowFlake && snowFlake.date) texto += `<@${word}> `
        else texto += word
      }
      else if (word == undefined || word == 'undefined') { }
      else if (word == '@everyone') texto += `@ everyone `
      else texto += `${word} `

    }

    if (texto.length > 2048) {
      let reply = await message.reply({ embeds: [{ color: '#ff00a2', description: `O tamanho limite das mensagens são de 2048 caracteres. sua mensagem possui ${texto.length} caracteres` }] })

      if (isDM === false) {
        try { message.delete() } catch (err) { }
        setTimeout(() => {
          try { reply.delete() } catch (err) { }
        }, 10 * 4000);
      }
      return;
    }

    if (texto.startsWith('undefined')) texto = texto.substring(9);

    let aproveChannel = await client.channels.fetch('880547880065187901');

    let aproveEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Nova mensagem de desabafo')
      .setDescription(texto)
      .addField('Mensagem de', message.author)
      .setFooter('Clique no botão abaixo para aprovar essa mensagem');

    let buttons = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('aprovar')
          .setLabel('Aprovar')
          .setStyle('PRIMARY')
          .setEmoji('✅')
      );

    let reply = await message.reply({
      embeds: [{
        color: '#00f000',
        title: 'Mensagem enviada com sucesso',
        description: 'Aguardando aprovação da staff para a mensagem ser publicada no chat de desabafos',
      }]
    });

    try { message.delete(); } catch (err) { }

    setTimeout(() => {
      reply.delete()
    }, 4 * 1000);

    aproveChannel.send({ embeds: [aproveEmbed], components: [buttons] })

  }
}