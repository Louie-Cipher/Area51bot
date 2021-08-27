const Discord = require('discord.js');

module.exports = {
  async trigger(client, message) {

    let embed = new Discord.MessageEmbed(message.embeds[0])

    if (!message.embeds) return;
    if (!message.embeds[0]) return;
    if (!embed.title || !embed.title.includes('Bom Dia & Cia') ) return;

    const characters = ['a', 'á', 'â', 'ã', 'b', 'c', 'ç', 'd', 'e', 'é', 'ê', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'o', 'ó', 'ô', 'õ', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'v', 'w', 'x', 'y', 'z',
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ' ', '-', '+', ',', '.', '!', '?', '/'];

    const description = embed.description;

    const frase = description.split('`')[1]
      .split('');

    let result = '';

    for (const letter of frase) {
      if (characters.includes(letter)) {
        result += letter;
      }
    }

    message.channel.send('<@466673774142685195>');
    message.channel.send('```\nResposta pronta. agradeça à Louie\n' + result + '\n```');
  }
}