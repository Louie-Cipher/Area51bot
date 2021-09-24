const Discord = require('discord.js');
const profileModel = require('../mongoSchema/profile');
const { prefix, commandChannels } = require('../config.json');
const embeds = require('../embeds');

const permissions = Discord.Permissions.FLAGS

let cooldownXP = new Map();
let cooldownCommands = new Map();

/**
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Discord.Collection} commands
 */

module.exports = async (client, message, commands) => {

  if (message.author.bot) return;

  let dateNow = new Date();

  if (!cooldownXP.has(message.author.id)) {

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

      } else {

        let randomXP = Math.ceil(Math.random() * 2) + 2;

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

    } catch (erro) {
      console.log(erro)
    }

    cooldownXP.set(message.author.id, dateNow);

    setTimeout(() => {
      cooldownXP.delete(message.author.id);
    }, 1000 * 15);

  }

  if (message.guild && ['874731227729498123', '874877733447012402'].includes(message.channel.id)) message.react('<a:carregando:833798958165786706>')

  const triggerWords = process.env['trigger_warning'].split(' ');
  const msgContent = message.content.toLowerCase();

  if (msgContent == (`<@${client.user.id}>`) || msgContent == (`<@!${client.user.id}>`)) {
    message.reply({ embeds: [embeds.botHello] });
  }
  if (msgContent == 'bom dia' && !message.author.bot)
    return message.reply({ content: 'Bom dia humano' });
  if (msgContent == 'bom dia fml' && !message.author.bot)
    return message.reply({ embeds: [{ title: 'Bom dia' }] })
  if (msgContent == 'boa noite' && !message.author.bot)
    return message.react('😴');
  if (msgContent == 'cu' || msgContent == 'cu?' && !message.author.bot) {
    message.react('🇨').then(message.react('🇺'));
    return message.reply({ embeds: [{ description: 'CU' }] });
  }
  if (['fodase', 'foda-se', 'foda-se?', 'fodase?'].includes(msgContent) && !message.author.bot)
    return message.react('<:fodase:867536967004717057>');

  if (!msgContent.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  let cmdName = args.shift().toLowerCase();

  if (!cmdName || cmdName.length == 0) cmdName = args.shift().toLowerCase();

  const cmd = commands.get(cmdName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

  if (!cmd) return message.reply({ content: `\`${cmdName}\` não é um comando válido.` });

  if (cooldownCommands.has(message.author.id)) {

    let nextCmd = new Date(cooldownCommands.get(message.author.id).getTime() + 4000)
    let timeLeft = new Date(nextCmd.getTime() - dateNow.getTime());

    let timeLeftString = `${timeLeft.getSeconds()} segundo`;
    if (timeLeft.getSeconds() == 0) timeLeftString = 'alguns milissegundos'
    if (timeLeft.getSeconds() > 1) timeLeftString += 's';

    return message.reply({ content: `Epa, você está usando comandos muito rápido!\nTente novamente em ${timeLeftString}` });

  } else {
    cooldownCommands.set(message.author.id, dateNow);

    setTimeout(() => {
      cooldownCommands.delete(message.author.id);
    }, 1000 * 4);
  }

  if (message.guild) {

    const clientMember = message.guild.me;

    if (!commandChannels.includes(message.channel.id) && !message.member.permissions.has(permissions.MANAGE_MESSAGES))
      return message.reply({ embeds: [embeds.blockedCommands] });

    if (cmd.booster && !message.member.roles.cache.has('828983379135299634') && !message.member.permissions.has(permissions.MANAGE_MESSAGES))
      return message.reply({ embeds: [embeds.booster] });

    if (cmd.userPermissions && !message.member.permissions.has(cmd.userPermissions))
      return embeds.userPermission(client, message, cmd);

    if (cmd.nsfw && !message.channel.nsfw)
      return message.reply({ embeds: [embeds.nsfw] });

    if (cmd.inVoiceChannel) {
      if (!message.member.voice.channel) return message.reply({ embeds: [embeds.inVoiceChannel] });
      if (clientMember.voice.channel) {
        if (clientMember.voice.channel.id != message.member.voice.channel.id) return message.reply({ embeds: [embeds.sameVoiceChannel] });
      }
    }
  }
  else {
    if (!cmd.dmAllow) return message.reply({ content: '❌ Esse comando só pode ser utilizado dentro do servidor\n Atualmente, os comandos disponíveis via DM são: `a.cupido`, `a.hate`, `a.desabafo`' })
  }

  try {
    cmd.execute(client, message, args);
  } catch (err) {
    message.reply({ content: 'houve um erro ao executar esse comando' });
    console.log(err);
  }

}
