const Discord = require('discord.js');
const { client, invitesMap } = require('../index');

client.on('guildMemberAdd', async member => {

    const invites = await member.guild.invites.fetch()
    const inviteChannel = await client.channels.cache.get('829021601110294570');

    for (const inviteCached of invitesMap) {

        const actualInvite = await member.guild.invites.cache.get(inviteCached[0])
        const inviter = await client.users.fetch(inviteCached[1].inviter);

        if (invites[1].uses != inviteData.uses) {

            const createdAt = new Date(member.user.createdAt.getTime() - 10800000)
            const createdAtFormated =
                createdAt.getDate() + '/' + createdAt.getMonth() + '/' + createdAt.getDate() + ' - ' +
                createdAt.getHours() + ':' + createdAt.getMinutes();


            let embed = new Discord.MessageEmbed()
                .setColor('#00ff30')
                .setTitle(member.user.tag + ' Entrou no servidor')
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'ID', value: member.id },
                    { name: 'Conta criada em', value: createdAtFormated },
                    { name: 'Convite por', value: inviter },
                    { name: 'Código do convite', value: inviteCached[0] },
                    {name: 'Canal do invite', value: inviteCached[0].channel.toString()}
                );

            inviteChannel.send({ embeds: [embed] });

        }
    }

});

client.on('inviteDelete', async invite => {
    let { promisify } = require('util');
    await promisify(setTimeout)(500);

    invitesMap.delete(invite.code);
});

client.on('inviteCreate', async invite => {
    invitesMap.set(invite.code, invite.uses)
});