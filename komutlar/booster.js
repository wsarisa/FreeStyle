const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons')
const db = require('coders.db')
const ayarlar = require("../ayarlar.json");

exports.run = function(client, message, args) {
  let acebot = new Discord.MessageEmbed();
  let yetkili = ayarlar.booster;
  if (!message.member.roles.cache.has(yetkili))
    return message.reply({content:'Yalnızca booster üyeler bu komutu kullanabilir.'}).then(a => a.delete({timeout:2500}))

  let user = message.author;
  let kad = args.slice(0).join(" ");

  if (!kad) return message.reply({content:'Geçerli bir kullanıcı adı belirtin.'}).then(a => a.delete({timeout:4500}))
  
  if (kad >= 32) return message.reply({content:'Kullanıcı adı en fazla 32 karakter olabilir.'}).then(a => a.delete({timeout:4500}))

  message.guild.members.cache.get(user.id).setNickname(kad);

  message.react("✅");

  const arisa = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
    .setDescription(
      `**${message.author.tag}** adlı kullanıcının sunucu takma adı **${kad}** olarak güncellendi.`
    )
    .setColor("RANDOM");
    const ab = new MessageButton()
    .setStyle('red')
    .setLabel('İşlemi Geri Al.')
    .setID(`booster_uye`);
  message.channel.send({embeds: [arisa], buttons: [ab]})
  db.set(`booster`, message.author.id)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "me",
  cooldown: 10,
  usage: "!say",
  desscription: "!say"
};
