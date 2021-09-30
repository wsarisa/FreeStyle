const Discord = require('discord.js')
const { MessageButton } = require('discord-buttons')

exports.run = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author
    let embed = new Discord.MessageEmbed()
.setAuthor(member.user.tag, member.user.avatarURL({dynamic:true}))
.setColor('RANDOM')
.setImage(member.user.avatarURL({dynamic: true, size: 2048}))
.setFooter(`${message.author.tag} tarafından istendi.`, message.author.avatarURL({dynamic:true}));
let button = new MessageButton()
.setStyle('url')
.setURL(member.user.avatarURL({dynamic:true, size: 2048}))
.setLabel(`Fotoğraf Linki`);
message.channel.send({embeds: [embed], buttons: [button]})
}

exports.conf = {
    aliases: ['pp','av','Avatar','profilfoto']
}

exports.help = {
    name: 'avatar',
    cooldown: 10
}