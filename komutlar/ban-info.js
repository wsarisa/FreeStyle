const Discord = require('discord.js')
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
    let yetkili = ayarlar.banyetkili;
    if (!message.member.roles.cache.has(yetkili) && (!message.member.hasPermission('ADMINISTRATOR')))
      return message.reply({content:'Yetkiniz yok.'}).then(x => x.delete({timeout:2500}))
    let kullanici = args[0];
    if (!kullanici)
      return message.reply({content:
        "Geçerli bir ID belirtin."
      }).then(x => x.delete({timeout:2500}))
    message.guild.bans.fetch().then(bans => {
      if (!bans.has(kullanici)) {
        return message.reply({content:`Kullanıcı yasaklanmamış.`})
      }
    });
    message.guild.ban.fetch(kullanici).then(({ user, reason }) => {
      const Embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ dynamic: true })
        )
        .setDescription(
          `${user.tag}, ban sebebi: \n\n**${reason ||
            "SEBEP BELİRTİLMEMİŞ."}**`
        )
        .setFooter(`${client.user.username} | Ban-Info Sistemi - 2021`);
      message.channel
  .send({embeds: [Embed]});
    });
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [
      "bansorgulama",
      "bansorgu",
      "baninfo",
      "BANINFO",
      "BANİNFO",
      "ban-sorgulama",
      "BANSORGULAMA",
      "ban-sorgu"
    ],
    permLevel: 0
  };
  
  exports.help = {
    name: "bansorgulama",
      cooldown: 5,
    description: "Ban sorgulama yaparsınız",
    usage: "bansorgulama"
  };
  