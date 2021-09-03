const Discord = require("discord.js");
const Canvas = require('canvas');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'profile',
  aliases: ['perfil', 'xp'],
  description: "exibe o seu perfil no bot, com seu nível de XP e Star coins",

  /** 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {String[]} args
 */

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (args[0] && !user)
      return message.reply({ embeds: [{ color: '#b3c20c', title: 'usuário informado não encontrado' }] })

    if (!user) user = message.author

    if (user.bot)
      return message.reply({
        embeds: [{
          title: `${user.tag}`, description: 'Bip Bop | Bots não possuem rank de XP ou um perfil no Area51Bot'
        }]
      });

    let member = await message.guild.members.fetch(user.id);

    if (member)
      return message.reply({
        embeds: [{
          title: `${user.tag}`, description: 'Usuário informado não é um membro do servidor Área 51'
        }]
      });


    profileData = await profileModel.findOne({ userID: user.id });

    if (!profileData) return message.reply({
      embeds: [{
        color: '#009999',
        title: 'Esse usuário ainda não possui um perfil no Area51Bot',
        description: 'um perfil será criado automaticamente após o usuário enviar uma mensagem pela primeira vez'
      }]
    });
    /*
        const wallpaper = await Canvas.loadImage('../../assets/wallpaper.jpg');
        let canvas = Canvas.createCanvas(wallpaper.width, wallpaper.height);
        let ctx = canvas.getContext('2d');
    
        ctx.drawImage(wallpaper, 0, 0);
    
        const characters = 'AÁÀÂÃBCÇDEÉÈÊFGHIÍÌJKLMNOÓÒÕÔPQRSTUÚÙVWXYZaáàâãbcçdeéèêfghiíìjklmnoóòõôpqrstuúùvwxyz0123456789()[]{}#@*!?$%¨&§ª°=.,;:^~<>/+-_\'\\`"';
        let usernameFormated = '';
    
        user.username.split('').forEach(letter => {
          if (characters.includes(letter)) usernameFormated += letter;
          else usernameFormated += ' ';
        })
    
        let fontSize = 0;
        if (usernameFormated.length < 13) fontSize = 35;
        if (usernameFormated.length > 12) fontSize = 30;
        if (usernameFormated.length > 18) fontSize = 25;
    
        //user fundo
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(canvas.width / 90, canvas.height / 90, (canvas.width / 100) * 80, (canvas.height / 100) * 80);
    
        // UserName //
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillText(usernameFormated, canvas.width / 90, canvas.height / 90);
    
    
    
    
    
        ctx.beginPath();
        ctx.arc(70, 70, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
    
        const avatar = await Canvas.loadImage(user.displayAvatarURL({ dynamic: false, format: 'jpg' }));
        ctx.drawImage(avatar, 20, 20, 100, 100);
    
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `botProfile.png`);
        message.channel.send(attachment);
    */
    let embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${user.tag}`)
      .addFields(
        { name: 'XP por texto', value: profileData.chatXP.toString() },
        { name: 'XP por voz', value: profileData.voiceXP.toString() }
      )
      .setThumbnail(user.avatarURL({ dynamic: true, format: "png", size: 1024 }))
      .setFooter('em breve, esse comando será personalizável,\ncom uma foto de capa, ícones, e muito mais');

    message.reply({ embeds: [embed] });
  }
}