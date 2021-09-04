const Discord = require('discord.js');

module.exports = {

    /**
     * @param {Discord.Client} client
     * @param {Discord.GuildMember} member
     */

    async guildMemberAdd(client, member) {

        const invites = await member.guild.invites.fetch()
        const inviteChannel = await client.channels.cache.get('829021601110294570');

        for (const inviteCached of client.invites) {

            const actualInvite = await member.guild.invites.cache.get(inviteCached[0]);
            const inviter = await client.users.fetch(inviteCached[1].inviter);

            if (invites[1].uses != actualInvite.uses) {

                const createdAt = new Date(member.user.createdAt.getTime() - 10800000)
                const createdAtFormated =
                    createdAt.getDate() + '/' + (createdAt.getMonth() + 1) + '/' + createdAt.getDate() + ' - ' +
                    createdAt.getHours() + ':' + createdAt.getMinutes();


                let embed = new Discord.MessageEmbed()
                    .setColor('GREYPLE')
                    .setTitle(member.user.tag + ' Entrou no servidor')
                    .setThumbnail(member.user.displayAvatarURL())
                    .addFields(
                        { name: 'ID', value: member.id },
                        { name: 'Conta criada em', value: createdAtFormated },
                        { name: 'Convite por', value: inviter.toString() },
                        { name: 'Código do convite', value: inviteCached[0] },
                        { name: 'Canal do invite', value: inviteCached[0].channel.toString() }
                    );

                inviteChannel.send({ embeds: [embed] });

            }
        }

    },

    async inviteDelete(client, invite) {
        await delay(500);
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        client.invites.delete(invite.code);
    },

    async inviteCreate(client, invite) {
        client.invites.set(invite.code, invite.uses)
    }

}