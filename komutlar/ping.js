const Discord = require("discord.js");
require("discord-replys");

exports.run = (client, message, args) => {
  var kontrol;
  if (client.ws.ping <= 70) kontrol = "Very Good :)";
  if (client.ws.ping >= 70) kontrol = "Not Good :(";
  const e1 = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setDescription(
      `📶 Bot Ping: **${client.ws.ping}ms**
🌐 Bot Durum: **${kontrol}**`
    )
    .setThumbnail(message.author.avatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));
  message.channel
.send({embeds: [e1]})
};
exports.conf = {
  enbled: true,
  guildOnly: false,
  permLevel: 0,
  aliases: []
};
exports.help = {
  name: "ping",
    cooldown: 15,
  description: "Ping komutu",
  usage: "ping"
};
