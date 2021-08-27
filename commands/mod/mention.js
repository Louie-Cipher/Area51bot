module.exports = {
  name: 'everyone',
  aliases: ['pingeveryone', 'mention'],
  description: "menciona @everyone pelo bot",
  userPermissions: 'MANAGE_GUILD',
  async execute(client, message, args) {
    message.channel.send('@everyone');
  }
}