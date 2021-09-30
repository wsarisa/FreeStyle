const Discord = require("discord.js");
const client = new Discord.Client();
const bot = new Discord.Client();
const { RichEmbed } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const chalk = require("chalk");
const fs = require("fs");
const { stripIndents } = require("common-tags");
const moment = require("moment");
const { Client, Util } = require("discord.js");
const db = require("coders.db");
const Jimp = require("jimp");

exports.run = (client, message, args) => {
  if (!message.author.id == "457481463294722050")
    return message.reply({content:'Bu yetkiyi yalnızca ` ๖ۣۜARISA El Chavo 🪐#3001 kullanabilir.'}).then(a => a.delete({timeout:1500}))
  try {
    var code = args.join(" ");
    var evaled = eval(code);

    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    let Embed = new Discord.MessageEmbed()
      .addField("Giriş", "```js\n" + code + "```")
      .setColor('RANDOM')
      .setFooter(`ARISA Eval Code`)
      .setDescription("```js\n" + clean(evaled) + "```");
    if (Embed.description.length >= 2048)
      Embed.description = Embed.description.substr(0, 2042) + "```...";
    return message.channel
.send({embeds: [Embed]})
  } catch (err) {
    message.reply(`\`HATA\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
  function clean(text) {
    if (typeof text === "string")
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "eval",
  description: "Kod denemek için kullanılır.",
  usage: "eval [kod]"
};
