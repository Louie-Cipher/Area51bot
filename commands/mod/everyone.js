module.exports = {
  name: 'mention',
  aliases: ['mencao', 'menção', 'mencionar'],
  description: "menciona @everyone pelo bot",
  userPermissions: 'MANAGE_GUILD',
  async execute(client, message, args) {
    
    message.channel.send('@everyone');
  }
}