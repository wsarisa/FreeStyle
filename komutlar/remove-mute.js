const Discord = require("discord.js");
const db = require('coders.db')
const { MessageButton } = require('discord-buttons')
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  let yetkili = ayarlar.muteyetkili;
  let susturulmuş = ayarlar.susturulmuş;
  let mutelogkanal = ayarlar.mutelog;

if (!message.member.roles.cache.has(yetkili) && !message.member.hasPermission('ADMINISTRATOR')) return message.reply({content:`Yetkiniz yok.`}).then(a => a.delete({timeout:2500}))
  let kullanıcı = message.guild.member(
    message.mentions.members.first() || message.guild.members.cache.get(args[0])
  );
  if (!kullanıcı)
    return message.channel
      .send({embeds: [
        new Discord.MessageEmbed().setDescription("⛔️ Kullanıcı belirtin.")
      ]}
      )
      .then(msg => msg.delete({ timeout: 7500 }));
  let user = message.guild.member(
    message.mentions.members.first() || message.guild.members.cache.get(args[0])
  );
  let rol = message.mentions.roles.first();
  let member = message.guild.member(kullanıcı);
  member.roles.remove(susturulmuş);
db.delete(`mute`, user.id)
let embed = new Discord.MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
.setColor('RANDOM')
.setDescription(`<@${member.user.id}> üyesi ${message.author} tarafından susturulmuş üyelerden çıkarıldı.`)
.setFooter(`${client.user.username} Mute Sistemi`);
let button = new MessageButton()
.setStyle('red')
.setLabel('Susturulmuşa Geri Gönder')
.setID(`mute_add`);
message.channel.send({embeds: [embed], buttons: [button]})

db.set(`mute_add`, member.user.id)

message.react(ayarlar.onayemoji)

  const ace = new Discord.MessageEmbed()
    .setAuthor("UnMute İşlemi")
    .setColor("RANDOM")
    .addField(`Açılan Muteli Kullanıcı:`, ` ${kullanıcı}`)
    .addField(`Açan Yetkili:`, ` <@${message.author.id}>`)
    .setThumbnail(
      message.author.avatarURL({ dynamic: true, format: "png", size: 1024 })
    );
  client.channels.cache.get(mutelogkanal).send({embeds: [ace]});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  kategori: "Yetkili Komutları",
  permLevel: 0
};

exports.help = {
  name: "unmute",
    cooldown: 5,
  description: "Unmute.",
  usage: "-unmute"
};
