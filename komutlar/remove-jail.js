const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons')
const db = require("coders.db");
const ayarlar = require("../ayarlar.json");
//acebots
exports.run = async (client, message, args) => {
let yetkili = ayarlar.jailyetkili
let jaillogkanal = ayarlar.jaillog
if (!message.member.roles.cache.has(yetkili) && !message.member.hasPermission('ADMINISTRATOR')) return message.reply({content:'Yetkiniz yok.'}).then(a => a.delete({timeout:2500}))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

if(!member) return message.reply({content:'Geçerli bir üye belirtin.'}).then(a => a.delete({timeout:4000}))

member.roles.add(ayarlar.erkekrol1)
member.roles.remove(ayarlar.cezalı)

let embed = new Discord.MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
.setColor('RANDOM')
.setDescription(`<@${member.user.id}> üyesi ${message.author} tarafından cezalıdan çıkarıldı.`)
.setFooter(`${client.user.username} Jail Sistemi`);
let button = new MessageButton()
.setStyle('red')
.setLabel('Cezalıya Geri Gönder')
.setID(`jail_add`);
message.channel.send({embeds: [embed], buttons: [button]})

db.delete(`jail_remove`, member.id)

  const ikrudka = new Discord.MessageEmbed()
    .setAuthor("UnJail!")
    .setColor("RANDOM")
    .addField(`Çıkarılan Kullanıcı:`, ` ${member}`)
    .addField(`Çıkaran Yetkili:`, ` <@${message.author.id}>`)
    .setThumbnail(
      message.author.avatarURL({ dynamic: true})
    );
  client.channels.cache.get(jaillogkanal).send({embeds: [ikrudka]});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};
//acebots
exports.help = {
  name: "unjail",
    cooldown: 5,
  description: "Etiketlenen kişinin tüm rollerini alıp jail'e atar.",
  usage: "!jail @etiket Sebep"
};
