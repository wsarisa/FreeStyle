const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.has("881506491935375371"))
    return message.reply({content:'Bu komutu yalnızca kurucular kullanabilir.'}).then(a => a.delete({timeout:2500}))

  //Cortex botun reboot sistemi hadi h.o
  var embed = new Discord.MessageEmbed()
    .setTitle("**Merhaba Arisa**")
    .setDescription(
      "Beni yeniden başlatmak  istediğine eminsen aşağıdaki **TİK** işaretine, bir kere dokunur musun?"
    )
    .setColor("RANDOM");
  message.channel
.send({embeds: [embed]})
    .then(async function(sentEmbed) {
      const emojiArray = ["✅"];
      const filter = (reaction, user) =>
        emojiArray.includes(reaction.emoji.name) &&
        user.id === message.author.id;
      await sentEmbed.react(emojiArray[0]).catch(function() {});
      var reactions = sentEmbed.createReactionCollector(filter, {
        time: 30000
      });
      reactions.on("end", () =>
        message
          .delete()
          .then(mr => sentEmbed.delete())
          .then(m => message.delete())
          .then(m2 =>
            message.author.send({content:"Yeniden Başlatma İşlemi iptal ettim! "})
          )
      );
      reactions.on("collect", async function(reaction) {
        if (reaction.emoji.name === "✅") {
          try {
            message
              .delete()
              .then(mr => sentEmbed.delete())
              .then(wb => {
                console.log(`BOT: Bot yeniden başlatılıyor...`);
                process.exit(0);
              });
          } catch (err) {
            // Pudochu
            message.reply(`**Hata:** \n\`\`\`js\n${err}\n\`\`\``);
          }
        }
      });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["r", "restart"],
  permLevel: 0
};

exports.help = {
  name: "reboot",
  description: "Sistemi yeniden başlatır",
  usage: "reboot"
};
