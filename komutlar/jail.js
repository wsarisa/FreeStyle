const Discord = require("discord.js");
const db = require("coders.db");
const { MessageButton } = require('discord-buttons')
const ayarlar = require("../ayarlar.json");
db.setLanguage("tr");

exports.run = async (client, message, args) => {
  // Ace Botsif (message.author.id === '852626610602901525') return; message.channel.send("Bu botu kullanmanız '  Arisa 🌙#2012 tarafından yasaklanmıştır.")
  let yetkili = ayarlar.jailyetkili;
  let jaillogkanal = ayarlar.jaillog;
  let cezalı = ayarlar.cezalı;
  //

  let acebots = new Discord.MessageEmbed();
  if (!message.member.roles.cache.get(yetkili) && !message.member.hasPermission('ADMINISTRATOR'))
    return message.reply({content:'Yetkiniz yok.'}).then(a => a.delete({timeout:2500}))

  let kullanıcı =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);
  if (!kullanıcı) return message.reply({content:'Geçerli bir üye belirtin.'}).then(a => a.delete({timeout:2500}))
  let user = message.guild.member(
    message.mentions.members.first() || message.guild.members.cache.get(args[0])
  );
  let reason = args.slice(1).join(" ") || "Sebep Belirtilmemiş."; // Ace Bots
  if (user.id === message.author.id)
    return message.reply({content:'Bu işlemi gerçekleştiremezsiniz.'}).then(a => a.delete({timeout:2500}))
  if (user.id === client.user.id)
    return message.reply({content:'Bu işlemi gerçekleştiremezsiniz.'}).then(a => a.delete({timeout:2500}))
  if (user.id === message.guild.ownerID)
    return message.reply({content:'Bu işlemi gerçekleştiremezsiniz.'}).then(a => a.delete({timeout:2500}))
  if (!message.guild.member(user).bannable)
    return message.reply({content:'Bu işlemi gerçekleştiremezsiniz.'}).then(a => a.delete({timeout:2500}))

  user.roles.add(cezalı);
  db.set(`jail`, user.id);
  let em = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
  .setDescription(`<@${user.id}> adlı kullanıcıya <@&${cezalı}> rolü verilip, tüm rolleri ${message.author}'un komudu üzerine alındı.`)
  .setColor('RANDOM')
  .setFooter(`${client.user.username} - Jail Sistemi | 2021`);
  let bu = new MessageButton()
  .setStyle('green')
  .setLabel('Jailden Çıkart.')
  .setID(`jail_remove`);
  db.set(`jail_remove`, kullanıcı.id)
  message.channel.send({embeds: [em], buttons: [bu]})
  user.roles.cache.forEach(r => {
    user.roles.remove(r.id);
  });
  const ace = new Discord.MessageEmbed()
    .setAuthor("Jail!")
    .addField(`Jaile Atılan:`, ` ${kullanıcı}`)
    .addField(`Jaile Atan:`, ` <@${message.author.id}>`)
    .addField(`Jail Sebep:`, `${reason} `)
    .setThumbnail(
      message.author.avatarURL({ dynamic: true, format: "png", size: 1024 })
    )
    .setColor("RANDOM");
  client.channels.cache.get(jaillogkanal).send({embeds: [ace]}); // Ace Bots

  message.react("✅");
  // Ace Bots
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ceza','JAIL','JAİL'],
  permLevel: 0
};
// Ace Bots
exports.help = {
  name: "jail",
    cooldown: 5,
  description: "Etiketlenen kişinin tüm rollerini alıp jail'e atar.",
  usage: "-jail @etiket Sebep" // Ace Bots
};
