const Discord = require('discord.js');
const db = require('coders.db')
const ayarlar = require('../ayarlar.json')
const { MessageButton } = require('discord-buttons')
const ms = require("ms");

exports.run = (client, message, args) => {

        if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(ayarlar.muteyetkili)) {
        return message.reply({content:' Yetkiniz yok. '}).then(a => a.delete({timeout:2500}))
    }
let kullanici = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!kullanici) return message.reply({content:"Lütfen susturulacak kişiyi belirtiniz."})
  if(kullanici.hasPermission("MANAGE_MESSAGES")) return message.reply({content:"Benden yetkili birini susturamam."});
  if (kullanici.id === message.author.id) return message.reply({content:"Kendinizi susturamazsınız."});
  
    let süre = args[1]
  if(!süre) return message.reply({content:`Lütfen doğru bir zaman dilimi giriniz. Örneğin: **.vmute @kişi 1s/m/h/d sebep**`});
  let sebep = args[2]
  if (!sebep) return message.reply({content:`Lütfen bir sebep giriniz. Örneğin: **.vmute @kişi 1s/m/h/d sebep**`});
  db.set(`vmute_remove`, kullanici.user.id)
     let embed =  new Discord.MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL)
              .setDescription(`${kullanici}, ${süre} süreliğine ${message.author} tarafından ${sebep} sebebiyle susturuldu!`)
              .setColor("#ffffff");
              let button = new MessageButton()
              .setStyle('green')
              .setLabel('Muteyi Kaldır')
              .setID(`vmute_remove`);
  kullanici.voice.setMute(true, `Susturan yetkili: ${message.author.tag} - Susturma süresi: ${süre}`)
        .then(() => message.reply({embeds: [embed], buttons: [button]}))
        setTimeout(() => {
 kullanici.voice.setMute(false,`Süresi dolduğu için susturması kaldırıldı.`)
          let sembed =  new Discord.MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setDescription(`${kullanici} üyesinin, ${süre} sürelik susturulması, otomatik olarak kaldırıldı.`)
                .setColor("#ffffff");
        message.reply({embeds: [sembed]})

    }, ms(süre))
  let s = message.guild.channels.cache.get(ayarlar.mutelog)
  let s1 = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
  .setDescription(`<@${kullanici.id}> adlı kullanıcıya ${message.author} tarafından sesli mute atıldı.`)
  .setColor('RANDOM')
  .setFooter(`${client.user.username} - VMute`)
  s.send({embeds: [s1]})
}
exports.conf = {
      name: 'vmute',
    enabled: true,
    guildOnly: true,
    aliases: ['sesli-mute','voice-mute'],
    permLevel: 0
};

exports.help = {
    name: 'vmute',
    description: 'seslide sustur',
      cooldown: 5      ,
    usage: "vmute"
};