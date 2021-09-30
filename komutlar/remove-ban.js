const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons')
const db = require('coders.db')
const ayarlar = require("../ayarlar.json");

module.exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.has(ayarlar.banyetkili) && !message.member.hasPermission('ADMINISTRATOR')) {
    return message.reply({content:'Yetkiniz yok.'}).then(a => a.delete({timeout:2500}))
  }

  let unbanid = args[0];
  if (!unbanid) return message.reply({content:"⛔️ ID belirtin!"}).then(a => a.delete({timeout:4000}))

  message.guild.members.unban(unbanid);
let embed = new Discord.MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
.setColor('RANDOM')
.setDescription(`<@${unbanid}> adlı üyenin yasağı ${message.author} tarafından kaldırıldı.`)
.setTimestamp();
let button = new MessageButton()
.setStyle('red')
.setLabel('Tekrar Yasakla!')
.setID(`ban_add`);
message.channel.send({embeds: [embed], buttons: [button]})
  db.delete(`ban_remove`, unbanid)
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["unban",'removeban','UNBAN'],
  permlevel: 2
};
exports.help = {
  name: "unban",
    cooldown: 5,
  description: "Herhangi bir kullanıcının banını açarsınız.",
  usage: "unban kullanıcı"
};

//firex commands
