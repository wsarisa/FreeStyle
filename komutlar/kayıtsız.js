const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons')
const datab = require("coders.db");
const ms = require("ms");
const moment = require("moment");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  let kayıtyetkili = ayarlar.kayıtyetkili;

if (!message.member.roles.cache.has(ayarlar.kayıtyetkili) && !message.member.hasPermission('ADMINISTRATOR'))
    return message.reply({content:'Yetkiniz yok.'}).then(x => x.delete({timeout:2500}))

  const erkekrol = message.guild.roles.cache.find(
    r => r.id === ayarlar.erkekrol1
  );
  const kayıtsız = message.guild.roles.cache.find(
    r => r.id === ayarlar.kayıtsızrol1
  );

  const member = message.guild.member(
    message.mentions.members.first() || message.guild.members.cache.get(args[0])
  );

  if (!member) return message.reply({content:'Geçerli bir üye belirtin.'}).then(x => x.delete({timeout:2500}))
  if (member.id === message.author.id)
    return message.reply({content:'Bu işlemi yapamazsınız.'}).then(x => x.delete({timeout:2500}))
  if (member.id === client.user.id)
    return message.reply({content:'Bu işlemi yapamazsınız.'}).then(x => x.delete({timeout:2500}))
  if (member.id === message.guild.OwnerID)
    return message.reply({content:"Bu işlemi yapamazsınız."}).then(x => x.delete({timeout:2500}))
  if (member.roles.highest.position >= message.member.roles.highest.position)
    return message.reply({content:"Bu işlemi yapamazsınız."}).then(x => x.delete({timeout:2500}))

  member.roles.add(kayıtsız);
  member.roles.cache.forEach(r => {
    member.roles.remove(r.id);
  });

  const arisa = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setDescription(
      `${member} adlı üyeye ${kayıtsız} rolü verilip tüm rolleri ${message.author}'un komudu üzerine alındı.`
    )
    .setColor("RANDOM")
    .setTimestamp();
    const buton = new MessageButton()
    .setStyle('green')
    .setLabel('İşlemi Geri al.')
    .setID(`kayitsiz_remove`);
    datab.set(`kayıtsız_remove`, member.id)
  message.channel
.send({embeds: [arisa], buttons: [buton]})
  const sa = new Discord.MessageEmbed()
    .setTitle(":bangbang: Kayıtsız İşlemi.")
    .setColor("RANDOM")
    .addField("Kayıtsıza ATILAN", `${member}`)
    .addField("Kayıtsıza ATAN", `${message.author.tag}`)
    .setThumbnail(
      message.author.avatarURL({ dynamic: true, format: "png", size: 1024 })
    );
  client.channels.cache.get(ayarlar.kayıtlog).send({embeds: [sa]});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unregistered'],
  permLevel: 0
};

exports.help = {
  name: "kayıtsız",
    cooldown: 5,
  description: "Etiketlenen kişiyi erkek rolleriyle kayıt eder.",
  usage: ".kayıt @etiket/id İsim Yaş"
};
