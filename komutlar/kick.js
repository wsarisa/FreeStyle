const Discord = require("discord.js");
const db = require("coders.db");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  let acebot = new Discord.MessageEmbed();
  let yetkili = ayarlar.kickyetkili;
  let banlogkanal = ayarlar.kicklog;
  if (!message.member.roles.cache.get(yetkili) && !message.member.hasPermission('ADMINISTRATOR'))
    return message.reply({content:'Yetkiniz yok.'}).then(x => x.delete({timeout:2500}))
  let user = message.guild.member(
    message.mentions.members.first() || message.guild.members.cache.get(args[0])
  );
  let prefix = ayarlar.prefix;
  let banlayan = message.author.id;
  let sebep = args.slice(1).join(" ") || "Sebep belirtilmemiş.";
  if (!user) return message.reply({content:"Geçerli bir üye belirtin."}).then(x => x.delete({timeout:2500}))
  if (user.id === message.author.id)
    return message.reply({content:"Bu işlemi yapamazsınız."}).then(x => x.delete({timeout:2500}))
  if (user.id === client.user.id)
    return message.reply({content:"Bu işlemi yapamazsınız."}).then(x => x.delete({timeout:2500}))
  if (user.id === message.guild.ownerID)
    return message.reply({content:"Bu işlemi yapamazsınız."}).then(x => x.delete({timeout:2500}));
  if (!message.guild.member(user).bannable)
    return message.reply({content:"Bu işlemi yapamazsınız."}).then(x => x.delete({timeout:2500}));

  message.guild.members.cache
    .get(user.id)
    .kick({ reason: `ADMIN: ${message.author.tag} - REASON: ${sebep}` });
  const arisanın = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setDescription(`${user} adlı üye ${sebep} sebebiyle ${message.author} tarafından atıldı.`)
    .setColor("RANDOM")
    .setFooter(`${client.user.username} Kick Sistemi - 2021`)
    .setTimestamp();
  message.channel
.reply({embeds: [arisanın]})
    .then(msg => msg.delete({ timeout: 10000, reason: "mesaj silme" }));
  message.react(ayarlar.onayemoji);
  const sa = new Discord.MessageEmbed()
    .setTitle(":bangbang: Atılma!")
    .setColor("RANDOM")
    .addField("Atılan:", `${user}`)
    .addField("Atan:", `${message.author.tag}`)
    .addField("Sebep:", sebep)
    .setThumbnail(
      message.author.avatarURL({ dynamic: true, format: "png", size: 1024 })
    );
  client.channels.cache.get(banlogkanal).send({embeds: [sa]}); //Log Kanalı
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['kıck','KICK','KİCK','at'],
  permlevel: 0
};

exports.help = {
    cooldown: 5,
  name: "kick"
};
