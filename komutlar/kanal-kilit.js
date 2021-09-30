const Discord = require("discord.js");

exports.run = (client, message, args) => {
  // ' Arisa#0007
  if (!message.member.hasPermission("MANAGE_CHANNELS"))
    return message.reply({content:'Yetkiniz yok.'}).then(a => a.delete({timeout:2500}))

  let channel = message.mentions.channels.first() || message.channel;

  let reason;
  if (!message.mentions.channels.first()) {
    if (args[0]) reason = args.slice(0).join(" ");
  }
  if (message.mentions.channels.first()) {
    if (args[1]) reason = args.slice(1).join(" ");
  }

  let reasonn;
  if (!reason) reasonn = ". No reason given.";
  if (reason) reasonn = ` for ${reason} reason.`;

  let everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
  channel.updateOverwrite(
    everyone,
    { SEND_MESSAGES: false },
    "Locked by " + message.author.tag
  );
  message.react(ayarlar.onayemoji);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
    cooldown: 5,
  name: "lock"
}; // coderscode
