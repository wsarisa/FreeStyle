const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons')
const database = require("coders.db");
const ms = require("ms");
const ayarlar = require("../ayarlar.json");
const moment = require("moment");
moment.locale("tr");

exports.run = async (client, message, args) => {
  let yetkili = ayarlar.muteyetkili;

  if (!message.member.roles.cache.has(yetkili) && !message.member.hasPermission('ADMINISTRATOR'))
    return message.reply({content:'Yetkiniz yok.'}).then(orospu => orospu.delete({timeout:2500}))

  let member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);
  if (!member) return message.reply({content:'Kullanıcı belirtin.'}).then(orospu => orospu.delete({timeout:2500}))
  if (!message.guild.member(member).bannable)
    return message.reply({content:'Bu işlemi yapamazsınız.'}).then(orospu => orospu.delete({timeout:2500}))

  let argument_one = ["saniye", "dakika", "saat", "gün"];
  if (!args[1]) return message.reply({content:'Geçerli bir zaman girin.'}).then(orospu => orospu.delete({timeout:2500}))
  if (!args[2]) return message.reply({content:'Geçerli bir zaman dilimi girin.'}).then(orospu => orospu.delete({timeout:2500}))
  if (!argument_one.includes(args[2]))
    return message.reply({content:'Geçerli bir zaman dilimi girin.\nDoğru Kullanım: **\`.mute @Arisa. 10 dakika spam.\`**'}).then(orospu => orospu.delete({timeout:15000}))

  let reason = "Sebep belirtilmemiş.";
  if (args[3]) reason = args.slice(3).join(" ");
  let end =
    Date.now() +
    ms(
      args[1] +
        " " +
        args[2]
          .replace("dakika", "minutes")
          .replace("saat", "hours")
          .replace("saniye", "seconds")
          .replace("gün", "day")
    );

  database.set(`mute`, member.user.id, {
    end: end,
    start: Date.now(),
    moderatorUsername: message.author.username,
    moderatorID: message.author.id,
    moderatorAvatarURL: message.author.displayAvatarURL({ dynamic: true }),
    reason: reason
  });

  let logChannelID = ayarlar.mutelog; // sizin log kanalızın idsi
  let logChannel = await message.guild.channels.cache.get(logChannelID);

  member.roles.add(ayarlar.susturulmuş); // muteli rolünün idsi
  const arisa = new Discord.MessageEmbed()
    .setAuthor(
      message.author.username,
      message.author.avatarURL({ dynamic: true })
    )
    .setDescription(
      `${member} üyesi **${reason}** sebebiyle ${message.author} tarafından ${args[1]} ${args[2]} süresiyle susturuldu.`
    )
    .setFooter(`${client.user.username} | Mute Sistemi - 2021`)
    .setColor("RANDOM");
    const arisab = new MessageButton()
    .setStyle('green')
    .setLabel('Muteyi Kaldır.')
    .setID(`mute_remove`);
    database.set(`mute_remove`, member.user.id)
  message.channel
.send({embeds: [arisa], buttons: [arisab]})
  const embed = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
  .setColor('RANDOM')
  .setDescription(`<@${member.user.id}> adlı kullanıcı ${reason} sebebiyle ${message.author} tarafından susturuldu.\n\nBitiş zamanı: **${moment(end + ms("3h")).format("DD.MM.YYYY - HH:mm:ss")}**`)
  .setFooter(`${client.user.username} Mute Sistemi - 2021`)
  message.react(ayarlar.onayemoji);
  logChannel.send({embeds: [embed]});
  setTimeout(
    () => {
      return member.roles.remove(ayarlar.susturulmuş).then(
        () =>
          database.delete(`mute`, member.user.id) &&
          logChannel.send({embeds: [
            embed.setColor("GREEN").setTitle("Susturulması açıldı.")
              .setDescription(`**• Moderatör**: ${message.author}
**• Susturulan**: <@!${member.user.id}>
**• Sebep**: ${reason}`)
          ]}) 
      );
    },
    ms(
      args[1] +
        " " +
        args[2]
          .replace("dakika", "minutes")
          .replace("saat", "hours")
          .replace("saniye", "seconds")
          .replace("gün", "day")
    )
  );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sustur'],
  permLevel: 0
};

exports.help = {
    cooldown: 5,
  name: "mute"
};
