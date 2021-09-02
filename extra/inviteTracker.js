const Discord = require('discord.js');
const { invitesMap } = require('../index');

module.exports = {

    /**
     * @param {Discord.Client} client
     * @param {Discord.Member} member
     */

    async guildMemberAdd(client, member) {

        const invites = await member.guild.invites.fetch()
        const inviteChannel = await client.channels.cache.get('829021601110294570');

        for (const inviteCached of invitesMap) {

            const actualInvite = await member.guild.invites.cache.get(inviteCached[0])
            const inviter = await client.users.fetch(inviteCached[1].inviter);

            if (invites[1].uses != actualInvite.uses) {

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
                        { name: 'Canal do invite', value: inviteCached[0].channel.toString() }
                    );

                inviteChannel.send({ embeds: [embed] });

            }
        }

    },

    /**
     * @param {Discord.Invite} invite 
     */
    async inviteDelete(client, invite) {
        let { promisify } = require('util');
        await promisify(setTimeout)(500);

        invitesMap.delete(invite.code);
    },

    /**
     * @param {Discord.Invite} invite 
     */
    async inviteCreate(client, invite) {
        invitesMap.set(invite.code, invite.uses)
    }

}