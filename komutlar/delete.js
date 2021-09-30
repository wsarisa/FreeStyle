const Discord = require("discord.js");
require("discord-reply");
const ayarlar = require("../ayarlar.json");

exports.run = function(client, message, args) {
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply({content:
      `Yetkiniz yok.`
    }).then(a => a.delete({timeout:2500}))
// format : 'gif',
  if (isNaN(args[0])) {
    var acebots = acebot
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true, size: 1024 })
      )
      .setDescription(`1 ila 100 arası değer giriniz.`)
      .setColor("RANDOM")
      .setTimestamp();
    return message.channel.send({embeds: [acebots]});
  }

  if (args[0] < 1) return message.reply({content:"⛔️ 1'den küçük mesaj silemem."});
  if (args[0] > 100) return message.reply({content:"⛔️ 100'den büyük mesaj silemem."});

  let silinecek = args[0];
  let kanal = client.channels.cache.get("890308994701332480");

  message.channel.bulkDelete(silinecek).then(deletedMessages => {
    if (deletedMessages.size < 1) return message.reply({content:"⛔️ Error"});
    kanal.send({content: `${message.author.tag} temizledi: ${args[0]} mesaj. ${message.channel} kanalında.`});
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sil", "clear", "temizle", "delete"],
  permLevel: 0
};

exports.help = {
  name: "sil",
    cooldown: 5,
  description: "Belirtilen miktarda mesaj siler.",
  usage: "!sil <miktar>"
};
