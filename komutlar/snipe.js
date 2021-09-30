const { MessageEmbed } = require('discord.js')
const db = require('coders.db')

   exports.run = async(client, message, args) => {
    const emirhan = await db.get(`snipe.id.${message.guild.id}`)
    if(!emirhan) {
    const codare2 = new MessageEmbed()
  .setAuthor(client.user.username, client.user.avatarURL())
  .setDescription(`Mesaj bulunamadı!`)
.setColor(`#f3c7e1`)
    message.channel.send({embeds: [codare2]});
          } else {
  let kullanıcı = client.users.cache.get(emirhan);
  const emran = await db.get(`snipe.mesaj.${message.guild.id}`)
  const codare = new MessageEmbed()
  .setAuthor(kullanıcı.tag, kullanıcı.avatarURL({dynamic:true}))
  .setDescription(`**Silinen Mesaj:**\n\n${emran}`)
.setColor(`RANDOM`)
  message.channel.send({embeds: [codare]}) }
}
exports.conf = {
    enabled:true,
    guildOnly: false,
    aliases: [],
    permLevel: 0,
}
exports.help = {
    cooldown: 5,
  name: "snipe"
} 