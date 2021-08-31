const Discord = require('discord.js');
const profileModel = require('../mongoSchema/profile');
const prefix = 'a.';
const config = require('../config.json');
const embeds = require('../embeds');

let cooldown = new Map()

module.exports = {

  async event(client, message) {

    if (message.author.id == '297153970613387264' && message.embeds) {
      require('../extra/loritta').trigger(client, message)
    }

    if (message.author.bot) return;

    let dateNow = new Date();

    try {
      let profileData = await profileModel.findOne({ userID: message.author.id });

        if (!profileData) {
          let profileNew = await profileModel.create({
            userID: message.author.id,
            chatXP: 1,
            voiceXP: 1,
            coins: 100,
            bank: 200,
            lastEditXP: Date.now(),
            lastRob: new Date(946684800000),
            lastWork: new Date(946684800000),
            lastEditMoney: Date.now(),
            lastDaily: Date.now(),
            created: Date.now()
          });
          profileNew.save();

          // ----AUMENTAR XP ----//

        } else if (profileData) {

          var randomXP = Math.ceil(Math.random() * 3) + 3;
          var cooldownXP = new Date(Date.now() - profileData.lastEditXP)

          if (cooldownXP > 15) {

            let xpToAdd = await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              }, {
                $inc: { chatXP: randomXP },
                lastEditXP: Date.now()
              }
              );
            xpToAdd.save()
          }

        }
        } catch (erro) {
          console.log(erro)
        }


    if (message.guild) {
    if (message.channel.id == '874731227729498123' || message.channel.id == '874877733447012402') {
      message.react('<a:carregando:833798958165786706>')
    }
  }
  
  const triggerWords = process.env['trigger_warning'].split(' ');
  const msgContent = message.content.toLowerCase();

	if ( msgContent == (`<@${client.user.id}>`) || msgContent == (`<@!${client.user.id}>`) ) {
		message.channel.send(embeds.botHello);
	}
  if (msgContent == 'bom dia' && !message.author.bot)
    return message.channel.send('Bom dia humano');
  if (msgContent == 'bom dia fml' && !message.author.bot)
    return message.channel.send({embed: {title: 'Bom dia'}})
  if (msgContent == 'boa noite' && !message.author.bot)
    return message.react('😴');
  if (msgContent == 'cu' || msgContent == 'cu?' && !message.author.bot) {
    message.react('🇨').then(message.react('🇺'));
    message.channel.send({embed: {description: 'CU'}});
  }
  if (msgContent == 'fodase' || msgContent == 'foda-se' || msgContent == 'foda-se?' || msgContent == 'fodase?' && !message.author.bot)
    return message.react('<:fodase:867536967004717057>');

	if (message.author.bot || !msgContent.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	let cmdName = args.shift().toLowerCase();

  if (!cmdName || cmdName.length == 0) {
    cmdName = args[0];
    let emptyCmdName = args.shift();
  }

	const cmd =	client.commands.get(cmdName) ||	client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if (!cmd) return message.reply(`\`${cmdName}\` não é um comando válido.`);

  if (cooldown.has(message.author.id)) {
    
    let lastMsg = cooldown.get(message.author.id);

    return message.reply(`Epa, você está usando comandos muito rápido!\nVocê precisa esperar 4 segundos entre um comando e outro`);

  } else {

    cooldown.set(message.author.id, dateNow);

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, 4000);
  }

  if(message.guild) {

    let clientMember = await message.guild.members.cache.get(client.user.id)

    if (!config.commandChannels.includes(message.channel.id) &&	!message.member.permissions.has('MANAGE_MESSAGES'))
      return message.channel.send(`${message.author}`, embeds.blockedCommands);

    if (cmd.booster && !message.member.roles.cache.has('828983379135299634') &&	!message.member.permissions.has('MANAGE_MESSAGES'))
      return message.channel.send(`${message.author}`, embeds.booster);

    if (cmd.userPermissions) {
      if (!message.member.permissions.has(cmd.userPermissions))
        return embeds.userPermission(client, message, cmd);
    }

    if (cmd.botPermissions) {
      if (!clientMember.permissions.has(cmd.botPermissions))
        return message.channel.send(`${message.author}`, embeds.botPermission);
    }

    if (cmd.nsfw && !message.channel.nsfw)
      return message.channel.send(embeds.nsfw);

    if (cmd.inVoiceChannel) {
      if (!message.member.voice.channel) return message.channel.send(embeds.inVoiceChannel);
      if(clientMember.voice.channel) {
        if(clientMember.voice.channel.id != message.member.voice.channel.id) return message.channel.send(embeds.sameVoiceChannel);
      }
    }
  }
  else{
    if(!cmd.dmAllow) return message.channel.send('❌ Esse comando só pode ser utilizado dentro do servidor\n   Atualmente, os unicos comandos disponíveis via DM são os comando `a.cupido`, `a.hate`, `a.desabafo`')
  }

	try {
		cmd.execute(client, message, args);
	} catch (err) {
		message.reply(`houve um erro ao executar esse comando`);
		console.log(err);
	} finally {

    cooldown.set( message.author.id, new Date() )

  }

  }

}
