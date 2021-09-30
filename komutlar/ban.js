const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons')
const db = require("coders.db");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  let yetkili = ayarlar.banyetkili;
  let banlogkanal = ayarlar.banlog;
  if (!message.member.roles.cache.has(yetkili) && !message.member.hasPermission('ADMINISTRATOR'))
    return message.reply({content:'Yetkiniz yok.'})
  let wen = args[0] || message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (wen == message.author.id)
    return message.reply({content:'Bu işlemi gerçekleştiremezsiniz.'})
  let samita = args.slice(1).join(" ") || "Sebep belirtilmemiş.";
  if (isNaN(wen)) return message.reply({content:'Geçerli bir üye veya ID belirtin.'})
  if (message.guild.members.cache.get(wen)) {
    let neiva = message.guild.members.cache.get(wen);
    message.guild.members
      .ban(wen, { reason: `Yetkili: ${message.author.tag} - Sebep: ${samita}` })
      let a = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
      .setColor('RANDOM')
      .setDescription(`<@${args[0]}> adlı kullanıcı ${samita} sebebiyle ${message.author} tarafından sunucudan yasaklandı.`)
      .setFooter(`${client.user.username} Ban Sistemi - 2021`);
      let b = new MessageButton()
      .setStyle('green')
      .setLabel('Banı Kaldır.')
      .setID(`ban_remove`);
        message.channel.send({embeds: [a], buttons: [b]})
        db.set(`ban_remove`, wen.id)
      .catch(e => {
        console.log(e);
      });
  } else {
    message.guild.members.ban(wen, {
      reason: `Yetkili: ${message.author.tag} - Sebep: ${samita}`
    });
let a = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
      .setColor('RANDOM')
      .setDescription(`<@${args[0]}> adlı kullanıcı ${samita} sebebiyle ${message.author} tarafından sunucudan yasaklandı.`)
      .setFooter(`${client.user.username} Ban Sistemi - 2021`);
      let b = new MessageButton()
      .setStyle('green')
      .setLabel('Banı Kaldır.')
      .setID(`ban_remove`);
        message.channel.send({embeds: [a], buttons: [b]})
        db.set(`ban_remove`, wen.id)
    message.react(ayarlar.onayemoji).catch(e => {
      if (e == "DiscordAPIError: Unknown User")
        message.reply(`Bu, geçerli bir ID değil.`);
      else console.log(e);
    });
  }
  let e1 = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
  .setColor('RANDOM')
  .setDescription(`<@${args[0]}> adlı kullanıcı ${samita} sebebiyle ${message.author} tarafından sunucudan yasaklandı.`)
  .setFooter(`${client.user.username} Ban Sistemi - 2021`)
  client.channels.cache.get(ayarlar.banlog).send({embeds: [e1]})
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['yasakla'],
  permLevel: 0
};

exports.help = {
  name: "ban",
    cooldown: 5,
  description: "forceban by WenSamita Neiva for AntiCode Development.",
  usage: "!forceban <kullanıcı ID>"
};
