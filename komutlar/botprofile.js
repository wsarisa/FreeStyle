const Discord = require("discord.js");
require("discord-reply");

exports.run = (client, message, args) => {
  if (!message.member.roles.cache.has("881506491935375371"))
    return 
  if (!args.slice(0).join(" "))
    return message.reply({content:'Geçerli bir link belirtin.'})
  let ayarlanan = args.slice(0).join(" ");
  try { 
      client.user.setAvatar(ayarlanan);
  } catch {
      return message.reply({content:'An error accuted!'})
  }
  message.react(ayarlar.onayemoji);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["robotpp", "pp-ayarla-robot"],
  permLevel: 0
};

exports.help = {
  name: "botpp",
  description: "Botun avatarını ayarlar. Sen yapamazsın :D",
  usage: "pp "
};

//<a:deadteamonayla:822852728429871124>
