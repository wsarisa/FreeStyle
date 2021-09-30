exports.run = async (client, message, args) => {
    let dc = require('discord.js')
    let { MessageButton } = require('discord-buttons')
    if(!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.has('890525957461528607')) return message.reply({content:`Yetkiniz yok.`}).then(a => a.delete({timeout:2500}))
    if(!args[0]) return message.reply({content:'Geçerli bir argüman belirtin. (rol ver, rol al)'})
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[1])
    if(!user) return message.reply({content:'Geçerli bir üye belirtiniz.\n\nDoğru kullanım: `.rol ver/al ÜYEID ROLID`'})
    if(!rol) return message.reply({content:'Geçerli bir rol belirtiniz.\n\nDoğru kullanım: `.rol ver/al ÜYEID ROLID'})
    if (args[0] === 'ver') {
   user.roles.add(rol)
      let e1 = new dc.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
      .setDescription(`<@${user.id}> adlı kullanıcıya <@&${rol.id}> rolü verildi.`)
      .setColor('RANDOM')
      .setThumbnail(user.user.avatarURL({dynamic:true}))
      .setFooter(`・Center Community`);
      let b1 = new MessageButton()
      .setStyle('red')
      .setLabel('Rolü Geri Al')
      .setID(`role_remove`);
      message.channel.send({embeds: [e1], buttons: [b1]})
    }
    if (args[0] === 'al') {
      user.roles.remove(rol)
      let e1 = new dc.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
      .setDescription(`<@${user.id}> adlı kullanıcının <@&${rol.id}> rolü alındı.`)
      .setColor('RANDOM')
      .setThumbnail(user.user.avatarURL({dynamic:true}))
      .setFooter(`・Center Community`);
      let b1 = new MessageButton()
      .setStyle('green')
      .setLabel('Rolü Geri Ver')
      .setID(`role_add`);
      message.channel.send({embeds: [e1], buttons: [b1]})
    }
  }
  
  exports.conf = {
    aliases: ['role']
  }
  
  exports.help = {
      cooldown: 5,
    name: 'rol'
  }