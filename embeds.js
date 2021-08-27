const Discord = require('discord.js');

module.exports = {

  botHello: new Discord.MessageEmbed()
    .setColor('#00a1a1')
    .setTitle('Olá, eu sou o bot oficial da Área 51')
    .setDescription('meu prefixo é `a.`'),

  blockedCommands: new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setDescription('❌ Ei, você não pode usar comandos do bot Area51 nesse chat\nTente nos chats <#862354794323902474> ou <#850403283155288137>'),

  inVoiceChannel: new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setDescription('🔊 você precisa estar em um canal de voz para usar esse comando'),

  sameVoiceChannel: new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setDescription('🔊 você precisa estar no mesmo canal de voz que eu para usar esse comando\n   eu atualmente já estou reproduzindo música em outra call'),

  nsfw: new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setTitle('❎ esse comando só pode ser usado em um canal marcado como NSFW')
    .setImage('https://i.kym-cdn.com/entries/icons/original/000/033/758/Screen_Shot_2020-04-28_at_12.21.48_PM.png')
    .setFooter('De acordo com as diretrizes do Discord, mensagens que possuirem conteúdo explícito, ou NSFW (Not Safe For Work), só podem ser enviados em um canal marcado como de conteúdo adulto'),

  booster: new Discord.MessageEmbed()
    .setColor('#6200a3')
    .setTitle('Funcionalidade Premium <a:o_booster:862157168086220810>')
    .setDescription(`Olá humano. Esse comando está disponível apenas para boosters do servidor.
    Impulsionando o servidor, você libera funções exclusivas do bot Area51`)
    .setThumbnail('https://cdn.discordapp.com/emojis/862157168086220810.gif?size=2048'),

  async userPermission(client, message, cmd) {
    const userPermission = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Você é fraco, lhe falta permissão para usar esse comando')
      .setThumbnail('https://i.imgur.com/HMbty0g.jpeg')
      .setFooter(`para usar esse comando, é necessário a permissão "${cmd.userPermissions}"`);
    message.channel.send(`${message.author}`, userPermission);
  },

  botPermission: new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setTitle('eu não tenho permissão para realizar essa função.')
    .setDescription('Por favor, contate os administradores do servidor para mais informações'),


}