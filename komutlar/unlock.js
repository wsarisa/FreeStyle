const Discord = require("discord.js");

exports.run = (client, message, args) => {
  // can#0002
  if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply({content: `Yetkiniz yok.`}).then(a => a.delete({timeout:2500}))

  let channel = message.mentions.channels.first() || message.channel;
  message.channel
    .send({content:`Kilit kaldırıldı.`})
    .then(m => m.delete({ timeout: 7000 }));

  let everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
  channel.updateOverwrite(
    everyone,
    { SEND_MESSAGES: null },
    "Unlocked by " + message.author.tag
  );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
    cooldown: 5,
  name: "unlock"
}; // codare ♥
