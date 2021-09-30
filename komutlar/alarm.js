const Discord = require('discord.js')
const db = require('coders.db')
const ms = require('ms')

exports.run = async (client, message, args) => {
    let member = message.guild.members.cache.get(message.author.id)
    let time = args[0]
      let argument_one = ["saniye", "dakika", "saat", "gün"];
    let am = args[1]
    if (!time) return message.reply({content:'Geçerli bir zaman belirtin. Doğru Kullanım: `.alarm 1 saat`'}).then(x => x.delete({timeout:5000}))
    if (!am) return message.reply({content:'Geçerli bir zaman dilimi belirtin. Doğru Kullanım: `.alarm 1 saat`'}).then(x => x.delete({timeout:5000}))
      if (!argument_one.includes(args[1])) return message.reply({content:'Geçerli bir zaman dilimi belirtin. Doğru Kullanım: `.alarm 1 saat`'}).then(x => x.delete({timeout:5000}))
      let end =
      Date.now() +
      ms(
        args[0] +
          " " +
          args[1]
            .replace("dakika", "minutes")
            .replace("saat", "hours")
            .replace("saniye", "seconds")
            .replace("gün", "day")
      );
      db.set(`alarm`, message.author.id, {
      end: end,
      start: Date.now()
    })
    member.roles.add('891674925193113600').then(() => message.reply({content:'Başarılı.'}).then(x => x.delete({timeout:5000})) && message.react('✅'))
      setTimeout(
      () => {
        return member.roles.remove('891674925193113600').then(
          () =>
            db.delete(`alarm`, message.author.id) &&
            message.channel.send({content:`
            <@${message.author.id}> belirtilen süre doldu!
            `})
        );
      },
      ms(
        args[0] +
          " " +
          args[1]
            .replace("dakika", "minutes")
            .replace("saat", "hours")
            .replace("saniye", "seconds")
            .replace("gün", "day")
      )
    );
    
}

exports.conf = {
    aliases: ['ALARM']
  }
  
  exports.help = {
    name: 'alarm',
    cooldown: 10,
  }