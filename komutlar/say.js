const Discord = require("discord.js");

exports.run = function(client, message, args) {

  let toplam = message.guild.memberCount;
  let online = message.guild.members.cache.filter(
    only => only.presence.status != "offline"
  ).size;
  const voiceChannels = message.guild.channels.cache.filter(
    c => c.type === "voice"
  );
  let count = 0;

  let textChannels = message.guild.channels.cache.filter(m => m.type == "text")
    .size;
  for (const [id, voiceChannel] of voiceChannels) // foruna for kardeşim
    count += voiceChannel.members.size;
  let boost = message.guild.premiumSubscriptionCount;

  const acebots = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setDescription(
      `🪐 **Toplam Üye:** ${toplam} \n
  🪐 **Aktif Kullanıcılar:** ${online}\n
  🪐 **Seslideki Üye Sayısı:** ${count}\n
  🪐 **Toplam Boost:** ${boost}`
    )//alooo özele baksana amk baktım amcık
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setFooter(`${client.user.username} | Say Sistemi - 2021`)
    .setColor("#ff7f00");
  message.channel
.send({embeds: [acebots]})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "say",
  cooldown: 10,
  usage: "!say",
  desscription: "!say"
};
