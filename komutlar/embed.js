const Discord = require('discord.js')
const { MessageButton } = require('discord-buttons')

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return
  let acık = args.slice(0).join(' ')
let e1 = new Discord.MessageEmbed()
.setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
.setDescription(`
${acık}
`)
.setThumbnail(message.guild.iconURL({dynamic:true}))
.setColor('#ff7f00')
.setFooter(`・Center Community`)
message.channel.send({embeds: [e1]})
}

exports.conf = {
  aliases: []
}

exports.help = {
  name: 'embed'
}