const Discord = require('discord.js')
const { MessageButton } = require('discord-buttons')
const db = require('coders.db')
const ayarlar = require('../ayarlar.json')
exports.run = async (client, message, args) => {
  let he = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!he) return message.reply({content:'Bir kullanıcı belirtin.'})
  let she = message.guild.channels.cache.get(ayarlar.mutelog)
  let e1 = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
  .setDescription(`<@${he.user.id}> adlı kullanıcının sesli mutesi ${message.author} tarafından kaldırıldı.`)
  .setColor('RANDOM')
  .setFooter(`${client.user.username} - VMute`);
  let b1 = new MessageButton()
  .setStyle('red')
  .setLabel('İşlemi Geri Al!')
  .setID(`vmute_add`);
  message.channel.send({embeds: [e1], buttons: [b1]})

  db.set(`vmute_add`, he.user.id)

  let e2 = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
    .setDescription(`<@${he.user.id}> adlı kullanıcının sesli mutesi ${message.author} tarafından kaldırıldı.`)
  .setColor('RANDOM')
  .setFooter(`${client.user.username} - VMute`)
  she.send({embeds: [e2]})
  he.voice.setMute(false)
}

exports.conf = {
  aliases: ['v-unmute','V-UNMUTE']
}

exports.help = {
  name: 'v-unmute'
}