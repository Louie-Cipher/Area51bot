const Discord = require("discord.js");

module.exports = {
  name: 'clear',
  aliases: ['clean', 'apagar', 'limpar', 'delete', 'deletar'],
  description: "apaga uma quantidade de mensagens selecionada",
  userPermissions: 'MANAGE_MESSAGES',

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 1000)
      return message.reply(
        { content: "forneça um número de até **1000 mensagens** a serem excluídas" }
      );

    const fetched = await message.channel.messages.fetch({
      limit: deleteCount + 1
    });

    try {
      await message.channel.bulkDelete(fetched);
    } catch (error) {
      message.reply({ content: `❌ Não foi possível deletar mensagens devido a: \`${error}\`` })
    }

    const msg = await message.reply({ content: `🗑️ | **${args[0]} mensagens limpas nesse chat!\n  por: ${message.author}**` })

    setTimeout(() => {
      msg.delete()
    }, 5000)

  }
}