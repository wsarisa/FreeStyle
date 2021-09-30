const Discord = require('discord.js')
const db = require('coders.db')
const ayarlar = require('../ayarlar.json')

exports.run = async (client, message, args) => {
    const kisi = db.get(`afkid_${message.author.id}_${message.guild.id}`);
    if (kisi) return;
    const sebep = args[0];
      if (ayarlar.reklamlar.some(word => message.content.includes(word.toLowerCase()))) {
      return message.delete()
      && message.reply({content:'Bir daha reklam yapmamalısın aksi takdirde cezalandırılacaksın.'}).then(msg => msg.delete({timeout:4500}))
    }
    if (ayarlar.küfürler.some(word => message.content.includes(word.toLowerCase()))) {
      return message.delete()
      && message.reply({content:'Bir daha küfür etmemelisin aksi takdirde cezalandırılacaksın.'}).then(msg => msg.delete({timeout:4500}))
    }
    if (!args[0]) {
      let kullanıcı = message.guild.members.cache.get(message.author.id);
      const b = kullanıcı.displayName;
  
      await db.set(
        `afkSebep_${message.author.id}_${message.guild.id}`,
        "Sebep Belirtilmemiş."
      );
      await db.set(
        `afkid_${message.author.id}_${message.guild.id}`,
        message.author.id
      );
      await db.set(`afkAd_${message.author.id}_${message.guild.id}`, b);
  
      const a = await db.get(`afkSebep_${message.author.id}_${message.guild.id}`);
      const arisa = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ dynamic: true })
        )
        .setDescription(
          `${message.author} adlı üye AFK moduna girdi. \n \nSebep: **${a}**`
        )
        .setColor("RANDOM")
        .setFooter(
          `${client.user.username} AFK Sistemi - 2021`,
          client.user.avatarURL({ dynamic: true })
        );
      message.reply({embeds: [arisa]}).then(msg => msg.delete({ timeout: 5000 }))
        
  
      message.react("✅");
  
      message.member.setNickname(`[AFK] ` + b);
    }
    if (args[0]) {
      let sebep = args.join(" ");
      let kullanıcı = message.guild.members.cache.get(message.author.id);
      const b = kullanıcı.displayName;
      await db.set(`afkSebep_${message.author.id}_${message.guild.id}`, sebep);
      await db.set(
        `afkid_${message.author.id}_${message.guild.id}`,
        message.author.id
      );
      await db.set(`afkAd_${message.author.id}_${message.guild.id}`, b);
      const a = await db.get(`afkSebep_${message.author.id}_${message.guild.id}`);
      const arisa = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ dynamic: true })
        )
        .setDescription(
          `${message.author} adlı üye AFK moduna girdi. \n \nSebep: **${a}**`
        )
        .setColor("RANDOM")
        .setFooter(
          `${client.user.username} AFK Sistemi - 2021`,
          client.user.avatarURL({ dynamic: true })
        );
      message
 .reply({embeds: [arisa]}).then(msg => msg.delete({ timeout: 5000 }))
          
      message.react("✅");
  
      message.member.setNickname(`[AFK] ` + b);
    }
}

exports.conf = {
    aliases: ['AFK','Afk']
}

exports.help = {
    name: 'afk',
    cooldown: 10
}