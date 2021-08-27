const Discord = require("discord.js");

module.exports = {
  name: 'userinfo',
  aliases: ['user'],
  description: "exibe informações sobre sua conta, ou do usuário mencionado",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if(!user && args[0]) return message.channel.send(`Usuário "${args[0]}" não encontrado`);

    if(!user) user = message.author;

    let member = await message.guild.members.cache.get(user.id);

    let avatar = user.avatarURL({ dynamic: true, format: "png"});

    const dateNow = new Date();

    const userCreated = new Date(user.createdAt.getTime() - 10800000);

    const userCreatedObj = {
      year: userCreated.getFullYear(),
      month: userCreated.getMonth(),
      day: userCreated.getDate(),
      dayWeek: userCreated.getDay(),
      hour: userCreated.getHours(),
      minute: userCreated.getMinutes(),
      second: userCreated.getSeconds()
    }

    const userCreatedFormated = `${userCreatedObj.day}/${userCreatedObj.month}/${userCreatedObj.year} - ${userCreatedObj.hour}:${userCreatedObj.minute}`;

    const userTime = new Date((dateNow.getTime() - user.createdAt.getTime()) - 10800000);

    let userTimeFormated = 'há';
    let u = 0;
    if (userTime.getFullYear() - 1970 != 0) {
        u++
        userTimeFormated += ` ${userTime.getFullYear() - 1970} ano`;
        if (userTime.getFullYear() - 1970 > 1) { userTimeFormated += 's' }
      }
      if (userTime.getMonth() != 0) {
        if (u>0) {{ userTimeFormated += ',' }}
        u++
        userTimeFormated += ` ${userTime.getMonth()} mes`;
        if (userTime.getMonth() > 1) { userTimeFormated += 'es' }
      }
      if (userTime.getDate() != 0) {
        if (u>0) {{ userTimeFormated += ',' }}
        u++
        userTimeFormated += ` ${userTime.getDate()} dia`;
        if (userTime.getDate() > 1) { userTimeFormated += 's' }
      }
      if (userTime.getHours() != 0) {
        if (u>0) {{ userTimeFormated += ',' }}
        u++
        userTimeFormated += ` ${userTime.getHours()} hora`;
        if (userTime.getHours() > 1) { userTimeFormated += 's' }
      }
      if (userTime.getMinutes() != 0) {
        if (u>0) {{ userTimeFormated += ',' }}
        userTimeFormated += ` ${userTime.getMinutes()} minuto`;
        if (userTime.getMinutes() > 1) { userTimeFormated += 's' }
      }

    let embed = new Discord.MessageEmbed()
      .setColor('#008f81')
      .setTitle(`${user.tag}`)
      .setDescription(`${user}`)
      .setThumbnail(avatar)
      .setFooter('(Data e hora em GMT -3 | horário de Brasília)')
      .addFields(
        {name: '🆔 Discord ID', value: `${user.id}`, inline: true},
        {
          name: '📅 Conta criada em',
          value: `${userCreatedFormated} \n${userTimeFormated}`,
          inline: true
        }
      );

    if(member){

      //member = await message.guild.members.fetch(user);

      const memberTime = new Date((dateNow.getTime() - member.joinedAt.getTime()) - 10800000);
      const memberJoined = new Date(member.joinedAt.getTime() - 10800000);

      const memberJoinedObj = {
        year: memberJoined.getFullYear(),
        month: memberJoined.getMonth(),
        day: memberJoined.getDate(),
        dayWeek: memberJoined.getDay(),
        hour: memberJoined.getHours(),
        minute: memberJoined.getMinutes(),
        second: memberJoined.getSeconds()
      }

      const memberJoinedFormated = `${memberJoinedObj.day}/${memberJoinedObj.month}/${memberJoinedObj.year} - ${memberJoinedObj.hour}:${memberJoinedObj.minute}`;

      let memberTimeFormated = 'há';
      let m = 0;

      if (memberTime.getFullYear() - 1970 != 0) {
        m++
        memberTimeFormated += ` ${memberTime.getFullYear() - 1970} ano`;
        if (memberTime.getFullYear() - 1970 > 1) { memberTimeFormated += 's' }
      }
      if (memberTime.getMonth() != 0) {
        if (m>0) {{ memberTimeFormated += ',' }}
        m++
        memberTimeFormated += ` ${memberTime.getMonth()} mes`;
        if (memberTime.getMonth() > 1) { memberTimeFormated += 'es' }
      }
      if (memberTime.getDate() != 0) {
        if (m>0) {{ memberTimeFormated += ',' }}
        m++
        memberTimeFormated += ` ${memberTime.getDate()} dia`;
        if (memberTime.getDate() > 1) { memberTimeFormated += 's' }
      }
      if (memberTime.getHours() != 0) {
        if (m>0) {{ memberTimeFormated += ',' }}
        m++
        memberTimeFormated += ` ${memberTime.getHours()} hora`;
        if (memberTime.getHours() > 1) { memberTimeFormated += 's' }
      }
      if (memberTime.getMinutes() != 0) {
        if (m>0) {{ memberTimeFormated += ',' }}
        memberTimeFormated += ` ${memberTime.getMinutes()} minuto`;
        if (memberTime.getMinutes() > 1) { memberTimeFormated += 's' }
      }

      embed.addFields(
        {
          name: '✨ Entrou no servidor em',
          value: `${memberJoinedFormated} \n${memberTimeFormated}`
        })

      if(member.premiumSince) {

        const premiumSince = new Date(member.premiumSince.getTime() - 10800000)

        const memberBoosted = {
          year: premiumSince.getFullYear(),
          month: premiumSince.getMonth(),
          day: premiumSince.getDate(),
          dayWeek: premiumSince.getDay(),
          hour: premiumSince.getHours(),
          minute: premiumSince.getMinutes(),
          second: premiumSince.getSeconds()
        }

        embed.addFields(
          {name: '<a:o_booster:862157168086220810> impulsionando o servidor desde', value: `${memberBoosted.day}/${memberBoosted.month}/${memberBoosted.year} - ${memberBoosted.hour}:${memberBoosted.minute}` }
        )
      }

      if (member.nickname){
        embed.addFields(
        {
          name: 'nickname no servidor', value: member.nickname
        })
      }
    }

    message.channel.send(embed);

  }
}
