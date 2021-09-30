const Discord = require("discord.js");
const db = require("coders.db");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply({content:'Yetkiniz yok.'}).then(a => a.delete({timeout:3000}))

  const onayembed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setAuthor("Nuke Komutu")
    .setFooter("Onay için 👍 emojisine, red için 👎 tıklayın.")
    .setDescription(
      "Dikkat! Bu işlemi onaylarsanız şâyet; kanal silinip, kopyası oluşturulacak!"
    );
  message.channel
   .send({embeds: [onayembed]})
    .then(msg => {
      msg.react("👍").then(() => msg.react("👎"));

      const filter = (reaction, user) => {
        return (
          ["👍", "👎"].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      msg
        .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
        .then(collected => {
          const reaction = collected.first();

          if (reaction.emoji.name === "👍") {
            message.channel.clone({ position: message.channel.position });
            message.channel.delete();
          } else {
            message.reply({content:"Nuke operation has been canceled!"});
            msg.delete({ timeout: 3000 });
          }
        })
        .catch(collected => {
          message.reply({content:"Somethings very wrong.. Please try again."});
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3,
  kategori: "sunucu"
};

exports.help = {
  name: "nuke",
    cooldown: 5,
  description: "Bot bulunduğunuz kanalı siler ve yeniden oluşturur.",
  usage: "nuke"
};
