const { Discord, Client, Util, Collection } = require("discord.js");
require("discord-replys");
const arisa007 = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const Dc = require('discord.js-self')
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const fs = require("fs");
const db = require("coders.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader.js")(arisa007);
const path = require("path");
const request = require("request");
const fetch = require('node-fetch');
const { MessageButton } = require("discord-buttons");
const snekfetch = require("snekfetch");
const queue = new Map();
const {
    MessageEmbed
} = require('discord.js');

arisa007.cooldowns = new Collection();

setInterval(function() {
  fetch(`https://bright-silky-celestite.glitch.me`)
  console.log(`fetchted`)
}, 180000)

const prefix = ayarlar.prefix;
const güvenlix = ayarlar.güvenli;
const sunucu = ayarlar.sunucuID;
const logkanal = ayarlar.guardlog;
const arr = ayarlar.perm;
const botrole = ayarlar.botrole;

const app = express();

app.get("/", (request, response) => {
  console.log(Date.now() + " A4 Reo conf.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_NAME}.glitch.me`);
}, 1000 * 60 * 3);

const log = message => {
  console.log(`${message}`);
};

arisa007.commands = new Collection();
arisa007.aliases = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    arisa007.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      arisa007.aliases.set(alias, props.help.name);
    });
  });
});

arisa007.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      arisa007.commands.delete(command);
      arisa007.aliases.forEach((cmd, alias) => {
        if (cmd === command) arisa007.aliases.delete(alias);
      });
      arisa007.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        arisa007.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

arisa007.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      arisa007.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        arisa007.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

arisa007.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      arisa007.commands.delete(command);
      arisa007.aliases.forEach((cmd, alias) => {
        if (cmd === command) arisa007.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

arisa007.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

arisa007.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

arisa007.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
  let e1 = new Discord.MessageEmbed()
  .setTitle('HATA ALINDI.')
  .setDesciption(`**Hata alındı: **
  
  ${chalk.bgRed(e.replace(regToken, "that was redacted"))}
  `)
  .setColor('RANDOM')
  .setFooter(`ARISA - ERROR INFO`)
  arisa007.channels.cache.get('890523892974751784').send(e1)
});

arisa007.login(process.env.token);
require("discord-buttons")(arisa007); //864958522075775017

arisa007.on('guildMemberAdd', async member => {
  if (!member.guild.id == '880390703396569098') return
  let user = db.get(`mute`, member.id)
  if (member.id == user) {
    member.roles.add(ayarlar.susturulmuş)
  } else {
    return
  }
})

arisa007.on("ready", () => {
  let sesegir = ayarlar.botses;
  let guild1 = arisa007.guilds.cache.get('880390703396569098')
  let guildü = guild1.memberCount
  arisa007.channels.cache.get(sesegir).join();
  arisa007.user
    .setPresence({ status: "idle"
    })
    .then(console.log)
    .catch(console.error);
  arisa007.guilds.cache.forEach(guild => {
    guild.members.cache.forEach(async member => {
      const fetch = await db.get(member.user.id);
      if (!fetch) return;
      if (Date.now() <= fetch.end || fetch) {
        let kalan = fetch.end - Date.now();
        let logChannelID = ayarlar.mutelog; // sizin log kanalızın idsi
        let logChannel = await guild.channels.cache.get(logChannelID);
        setTimeout(() => {
          const embed = new Discord.MessageEmbed().setAuthor(
            fetch.moderatorUsername,
            fetch.moderatorAvatarURL
          );
          return member.roles.remove(ayarlar.susturulmuş).then(
            () =>
              db.delete(member.user.id) &&
              logChannel.send(
                embed.setColor("GREEN").setTitle("Susturulması açıldı.")
                  .setDescription(`**• Moderatör**: <@!${fetch.moderatorID}>
    **• Susturulan**: <@!${member.user.id}>
    **• Sebep**: ${fetch.reason}`)
              )
          );
        }, kalan);
      }
    });
  });
});

arisa007.on('messageCreate', async message => {// can ♡ b#1010
  if (!message.guild) return
if(message.author.bot) return;
  if (message.member.hasPermission('ADMINISTRATOR')) return
let invites = [];
let kelimeler = message.content.split(' ');

for(const d in kelimeler) {
if(!kelimeler[d].includes('.gg/')) return;
let invite = await arisa007.fetchInvite(kelimeler[d]).catch(err => {
if(err.toString().code == 10006) return;
});

if(invite) invites.push(invite);
};


let logChannelID = '890523892974751784';
let logChannelFetch = message.guild.channels.cache.get(logChannelID);

if(logChannelFetch) {
/*if(message.member.hasPermission('ADMINISTRATOR')) return;*/
message.delete();

invites.forEach(invite => {
logChannelFetch.send({embeds: [new Discord.MessageEmbed()
.setColor('BLUE')
.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
.setTitle('Discord link posted in '+message.channel.name)
.setDescription(`**${message.author.tag}** posted the invite link \`${invite.code}\` that links to the server **${invite.guild.name}**`)
.setFooter(message.author.id)
.setTimestamp()
]})
});

};
}); // codare :hearts:

const logs = require("discord-logs");
logs(arisa007);
//guardian

arisa007.on("guildMemberBoost", member => {
  if (!member.guild.id == '880390703396569098') return
  const channel = member.guild.channels.cache.get("883733936918900736");
  if (!channel) return;
  channel.send({content:`${member} sunucuya boost bastı! Teşekkürler <3`});
});

arisa007.on("guildMemberUnboost", member => {
  if (!member.guild.id == '880390703396569098') return
  const channel = member.guild.channels.cache.get("883733936918900736");
  if (!channel) return;
  channel.send({content:`${member} sunucudan boostunu kaldırdı. :/`});
});

arisa007.on('voiceStateUpdate', async (oldState, newState) => {
  let embed = new Discord.MessageEmbed()
  let a = '890952003801481256'
  if (oldState.channel == newState.channel) return
            let entry = await oldState.guild.fetchAuditLogs({type: 'MUTE_MEMBER'}).then(audit => audit.entries.first())
let yt = arisa007.users.cache.get(entry.executor.id)
        let entry3 = await oldState.guild.fetchAuditLogs({type: 'UNMUTE_MEMBER'}).then(audit => audit.entries.first())
let yt3 = arisa007.users.cache.get(entry.executor.id)
        let entry4 = await oldState.guild.fetchAuditLogs({type: 'UNDEAFEN_MEMBER'}).then(audit => audit.entries.first())
let yt4 = arisa007.users.cache.get(entry.executor.id)
        let entry2 = await oldState.guild.fetchAuditLogs({type: 'DEAFEN_MEMBER'}).then(audit => audit.entries.first())
let yt2 = arisa007.users.cache.get(entry.executor.id)
    let user = newState.guild.members.cache.get(newState.id)
    let yenikanal = newState.guild.channels.cache.get(newState.channelID)
    let eskikanal = newState.guild.channels.cache.get(oldState.channelID)
  if (!oldState.channelID && newState.channelID) return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor('#0d0636').setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ${yenikanal} adlı sesli kanala girdi!`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  if (oldState.channelID && !newState.channelID) return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor('#0d0636').setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ${eskikanal} adlı sesli kanaldan çıkış yaptı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
       if(oldState.streaming === false && newState.streaming === true) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${oldState.member.user} üyesi ${newState.channel.name} adlı kanalda yayın başlattı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
         if(oldState.streaming === true && newState.streaming === false) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${oldState.member.user} üyesi ${newState.channel.name} adlı kanalda yayını durdurdu.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
         if(oldState.serverMute === false && newState.serverMute === true) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ses kanallarında ${yt} tarafından **sunucuda** susturuldu.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
      if(oldState.serverMute === true && newState.serverMute === false) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesinin ses kanallarında olan susturulması ${yt3} tarafından kaldırıldı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
  
      if(oldState.serverDeaf === false && newState.serverDeaf === true) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ses kanallarında ${yt2} tarafından **sunucuda** sağırlaştırıldı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
  
      if(oldState.serverDeaf === true && newState.serverDeaf === false) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesinin ses kanallarında olan sağırlaştırılması ${yt4} tarafından kaldırıldı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
  
      if(oldState.selfVideo === false && newState.selfVideo === true) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ${newState.channel.name} adlı kanalda kamera paylaşımı açtı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
 
     if(oldState.selfMute === false && newState.selfMute === true)
       return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ses kanallarında kendini susturdu.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
    if(oldState.selfMute === true && newState.selfMute === false)
      return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ses kanallarında kendi susturmasını kaldırdı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
    if(oldState.selfDeaf === false && newState.selfDeaf === true)
      return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ses kanallarında kendini sağırlaştırdı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
    if(oldState.selfDeaf === true && newState.selfDeaf === false)
      return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ses kanallarında kendin sağırlaştırmasını kaldırdı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
  
      if(oldState.selfVideo === true && newState.selfVideo === false) 
  return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ${newState.channel.name} adlı kanalda kamera paylaşımını kapattı.`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})

    if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) return newState.guild.channels.cache.get(a).send({embeds: [embed.setColor(oldState.guild.me.displayHexColor).setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true })).setDescription(`${user} üyesi ses kanalını değiştirdi: \n${eskikanal} => ${yenikanal}`).setThumbnail(user.user.avatarURL({dynamic:true})).setTimestamp().setFooter(`${arisa007.user.username} Log Sistemi - 2021`)]})
})

arisa007.on("guildBanAdd", async (guild, user) => {
  const logs = await guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD" });
  const log = logs.entries.first();
  if (!log) return;
  const target = log.target;
  const id = log.executor.id;
  if (!güvenlix.includes(id)) {
    let users = guild.members.cache.get(id);
    let kullanici = guild.members.cache.get(arisa007.user.id);
    users.ban({ reason: `Arisa - Koruma Sistemleri` });
    const embed = new Discord.MessageEmbed()
      .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
      .setColor("RANDOM")
      .setDescription(
        `${users} (\`${users.id}\`) Kullanıcısı Bir Üyeyi Yasakladı. :warning:
**Yasaklanan Kullanıcı Bilgisi**
Kullanıcı: ${target}
ID: \`${target.id}\`
Tag: \`${target.tag}\`

**Yasaklayan Kullanıcı Bilgisi**
Kullanıcı: \`${users}\`
ID: \`${users.id}\`
Tag: \`${users.user.tag}\`

**${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor :))`
      )
      .setThumbnail(users.user.avatarURL({ dynamic: true }))
      .setFooter(
        arisa007.user.username,
        arisa007.user.avatarURL({ dynamic: true })
      );
    arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
  }
});
arisa007.on("guildBanRemove", async (guild, user) => {
  const logs = await guild.fetchAuditLogs({
    type: "MEMBER_BAN_REMOVE"
  });
  const log = logs.entries.first();
  if (!log) return;
  const target = log.target;
  const id = log.executor.id;
  if (!güvenlix.includes(id)) {
    let users = guild.members.cache.get(id);
    let kullanici = guild.members.cache.get(arisa007.user.id);
    users.ban({ reason: `Arisa - Koruma Sistemleri` });
    const embed = new Discord.MessageEmbed()
      .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
      .setColor("RANDOM")
      .setDescription(
        `${users} (\`${users.id}\`) Kullanıcısı Bir Üyenin Yasağını Kaldırdı. :warning:
  **Yasaklaması Kaldırılan Kullanıcı Bilgisi**
  Kullanıcı: ${target}
  ID: \`${target.id}\`
  Tag: \`${target.tag}\`
  
  **Yasaklamayı Açan Kullanıcı Bilgisi**
  Kullanıcı: \`${users}\`
  ID: \`${users.id}\`
  Tag: \`${users.user.tag}\`
  
  **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor :))`
      )
      .setThumbnail(users.user.avatarURL({ dynamic: true }))
      .setFooter(
        arisa007.user.username,
        arisa007.user.avatarURL({ dynamic: true })
      );
    arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
  }
});
// KANAL AÇMA KORUMASI
arisa007.on("channelCreate", async channel => {
  const guild = channel.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `CHANNEL_CREATE`) {
      const id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        const users = guild.members.cache.get(id);
        const kullanici = guild.members.cache.get(arisa007.user.id);
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        channel.delete();
        const embed = new Discord.MessageEmbed()
          .setAuthor(
            channel.guild.name,
            channel.guild.iconURL({ dynamic: true })
          )
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Kanal Oluşturdu. :warning:
    **Kullanıcı Bilgisi**
    Kullanıcı: ${users}
    ID: \`${users.id}\`
    Tag: \`${users.user.tag}\`
    
    **Kanal Bilgisi**
    Kanal: #${channel.name}
    ID: \`${channel.id}\` 
    
    **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor :))
    Oluşturulan **${channel.name}** Kanalını Sildim.`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.resolve(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});
// KANAL SİLME KORUMASI
arisa007.on("channelDelete", async channel => {
  const guild = channel.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `CHANNEL_DELETE`) {
      const id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        const users = guild.members.cache.get(id);
        const kullanici = guild.members.cache.get(arisa007.user.id);

        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        await channel.clone().then(async kanal => {
          if (channel.parentID != null) await kanal.setParent(channel.parentID);
          await kanal.setPosition(channel.position);
          if (channel.type == "category")
            await channel.guild.channels.cache
              .filter(k => k.parentID == channel.id)
              .forEach(x => x.setParent(kanal.id));
        });
        const embed = new Discord.MessageEmbed()
          .setAuthor(
            channel.guild.name,
            channel.guild.iconURL({ dynamic: true })
          )
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Kanal Sildi. :warning:
    **Kullanıcı Bilgisi**
    Kullanıcı: ${users}
    ID: \`${users.id}\`
    Tag: \`${users.user.tag}\`
    
    **Kanal Bilgisi**
    Kanal: #${channel.name}
    ID: \`${channel.id}\` 
    
    **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
    Silinen **${channel.name}** Kanalını Tekrar Oluşturdum.`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});
// rol silme
arisa007.on("roleDelete", async role => {
  const guild = role.guild;
  let sil = guild.roles.cache.get(role.id);
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `ROLE_DELETE`) {
      const id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        const users = guild.members.cache.get(id);
        const kullanici = guild.members.cache.get(arisa007.user.id);
        let yeniRol = await role.guild.roles.create({
          data: {
            name: role.name,
            color: role.hexColor,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions,
            mentionable: role.mentionable
          }
        });
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(role.guild.name, role.guild.iconURL({ dynamic: true }))
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Rol Sildi. :warning:
      **Kullanıcı Bilgisi**
      Kullanıcı: ${users}
      ID: \`${users.id}\`
      Tag: \`${users.user.tag}\`
      
      **Rol Bilgisi**
      Rol: @${role.name}
      ID: \`${role.id}\`
      Renk: \`${role.hexColor}\` 
     
      **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
      Silinen **${role.name}** Rolünü Tekrar Oluşturdum.`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});

arisa007.on("emojiCreate", async emoji => {
  let guild = emoji.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `EMOJI_CREATE`) {
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        let users = guild.members.cache.get(id);
        let kullanici = guild.members.cache.get(arisa007.user.id);
        emoji.delete();
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(emoji.guild.name, emoji.guild.iconURL({ dynamic: true }))
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Emoji Oluşturdu. :warning:
    **Kullanıcı Bilgisi**
    Kullanıcı: ${users}
    ID: \`${users.id}\`
    Tag: \`${users.user.tag}\`
    
    **Emoji Bilgisi**
    Rol: @${emoji.name}
    ID: \`${emoji.id}\` 
   
    **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
    Oluşturulan **${emoji.name}** Emojisini Sildim.`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});

arisa007.on("emojiDelete", async emoji => {
  let guild = emoji.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `EMOJI_DELETE`) {
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        let users = guild.members.cache.get(id);
        let kullanici = guild.members.cache.get(arisa007.user.id);
        emoji.delete();
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(emoji.guild.name, emoji.guild.iconURL({ dynamic: true }))
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Emoji Sildi. :warning:
    **Kullanıcı Bilgisi**
    Kullanıcı: ${users}
    ID: \`${users.id}\`
    Tag: \`${users.user.tag}\`
    
    **Emoji Bilgisi**
    Rol: @${emoji.name}
    ID: \`${emoji.id}\` 
   
    **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
    Silinen **${emoji.name}** Emojisi Yok Oldu Gitti..]`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});

arisa007.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let guild = oldEmoji.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `EMOJI_UPDATE`) {
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        let users = guild.members.cache.get(id);
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(
            oldEmoji.guild.name,
            oldEmoji.guild.iconURL({ dynamic: true })
          )
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Rol Düzenledi. :warning:
      **Kullanıcı Bilgisi**
      Kullanıcı: ${users}
      ID: \`${users.id}\`
      Tag: \`${users.user.tag}\`
      
      **Düzenlenen Emoji Bilgisi**
      Rol: @${oldEmoji.name}
      ID: \`${oldEmoji.id}\`

      **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
      Düzenlenen **${oldEmoji.name}** Emojisi Yok Oldu Gitti..`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});
// rol oluşturma
arisa007.on("roleCreate", async role => {
  let guild = role.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `ROLE_CREATE`) {
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        let users = guild.members.cache.get(id);
        let kullanici = guild.members.cache.get(arisa007.user.id);
        role.delete();
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(role.guild.name, role.guild.iconURL({ dynamic: true }))
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Rol Oluşturdu. :warning:
    **Kullanıcı Bilgisi**
    Kullanıcı: ${users}
    ID: \`${users.id}\`
    Tag: \`${users.user.tag}\`
    
    **Rol Bilgisi**
    Rol: @${role.name}
    ID: \`${role.id}\` 
    HexColor: \`${role.hexColor}\` 
   
    **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
    Oluşturulan **${role.name}** Rolünü Sildim.`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});
// rol düzenleme koruma
arisa007.on("roleUpdate", async (oldRole, newRole) => {
  let guild = newRole.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `ROLE_UPDATE`) {
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        let users = guild.members.cache.get(id);
        if (
          arr.some(
            p => !oldRole.permissions.has(p) && newRole.permissions.has(p)
          )
        ) {
          newRole.setPermissions(oldRole.permissions);
          newRole.guild.roles.cache
            .filter(
              r =>
                !r.managed &&
                (r.permissions.has("ADMINISTRATOR") ||
                  r.permissions.has("MANAGE_ROLES") ||
                  r.permissions.has("MANAGE_GUILD"))
            )
            .forEach(r => r.setPermissions(36818497));
        }
        newRole.edit({
          name: oldRole.name,
          color: oldRole.hexColor,
          hoist: oldRole.hoist,
          permissions: oldRole.permissions,
          mentionable: oldRole.mentionable
        });
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(
            oldRole.guild.name,
            oldRole.guild.iconURL({ dynamic: true })
          )
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Rol Düzenledi. :warning:
      **Kullanıcı Bilgisi**
      Kullanıcı: ${users}
      ID: \`${users.id}\`
      Tag: \`${users.user.tag}\`
      
      **Düzenlenen Rol Bilgisi**
      Rol: @${newRole.name}
      ID: \`${newRole.id}\`
      Renk: \`${newRole.hexColor}\` 
     
      **Eski Haline Getirilen Rol Bilgisi**
      Rol: @${oldRole.name}
      ID: \`${oldRole.id}\` 
      Renk: \`${oldRole.hexColor}\`

      **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
      Düzenlenen **${oldRole.name}** Rolünü Eski Haline Getirdim.`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});
// kanal düzenleme koruma
arisa007.on("channelUpdate", async (oldChannel, newChannel) => {
  let guild = newChannel.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `CHANNEL_UPDATE`) {
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        let users = guild.members.cache.get(id);
        if (
          newChannel.type !== "category" &&
          newChannel.parentID !== oldChannel.parentID
        )
          newChannel.setParent(oldChannel.parentID);
        if (newChannel.type === "category") {
          newChannel.edit({
            name: oldChannel.name
          });
        } else if (newChannel.type === "text") {
          newChannel.edit({
            name: oldChannel.name,
            topic: oldChannel.topic,
            nsfw: oldChannel.nsfw,
            rateLimitPerUser: oldChannel.rateLimitPerUser
          });
        } else if (newChannel.type === "voice") {
          newChannel.edit({
            name: oldChannel.name,
            bitrate: oldChannel.bitrate,
            userLimit: oldChannel.userLimit
          });
        }
        oldChannel.permissionOverwrites.forEach(perm => {
          let thisPermOverwrites = {};
          perm.allow.toArray().forEach(p => {
            thisPermOverwrites[p] = true;
          });
          perm.deny.toArray().forEach(p => {
            thisPermOverwrites[p] = false;
          });
          newChannel.createOverwrite(perm.id, thisPermOverwrites);
        });
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(
            oldChannel.guild.name,
            oldChannel.guild.iconURL({ dynamic: true })
          )
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Kanal Düzenledi. :warning:
        **__Kullanıcı Bilgisi__**
        Kullanıcı: ${users}
        ID: \`${users.id}\`
        Tag: \`${users.user.tag}\`
        
        **Düzenlenen Kanal Bilgisi**
        Rol: #${newChannel.name}
        ID: \`${newChannel.id}\` 
       
        **Eski Haline Getirilen Kanal Bilgisi**
        Rol: #${oldChannel.name}
        ID: \`${oldChannel.id}\`
  
        **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
        Düzenlenen **${oldChannel.name}** Kanalını Eski Haline Getirdim.`
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});
// weebhok koruma
arisa007.on("webhookUpdate", async channel => {
  let guild = channel.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `WEBHOOK_CREATE`) {
      let yetkili = logs.entries.first().executor;
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        let users = guild.members.cache.get(id);
        let kullanic = guild.members.cache.get(arisa007.user.id);
        users.ban({ reason: `Arisa - Koruma Sistemleri` });
        const embed = new Discord.MessageEmbed()
          .setAuthor(
            channel.guild.name,
            channel.guild.iconURL({ dynamic: true })
          )
          .setColor("RANDOM")
          .setDescription(
            `${users} (\`${users.id}\`) Kullanıcısı Bir Webhook (Açtı - Düzenledi - Sildi). :warning:
      **__Kullanıcı Bilgisi__**
      Kullanıcı: ${users}
      ID: \`${users.id}\`
      Tag: \`${users.user.tag}\`
      
      **Webhook Bilgisi**
      Webhook Kanalı: #${channel.name}
     
      **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor :))
      `
          )
          .setThumbnail(users.user.avatarURL({ dynamic: true }))
          .setFooter(
            arisa007.user.username,
            arisa007.user.avatarURL({ dynamic: true })
          );
        arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
      }
    }
  });
});
/// bot koruma
arisa007.on("guildMemberAdd", async member => {
  const guild = member.guild;
  guild.fetchAuditLogs().then(async logs => {
    if (logs.entries.first().action === `BOT_ADD`) {
      const id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
        if (member.user.bot) {
          const users = guild.members.cache.get(id);
          const kullanici = guild.members.cache.get(arisa007.user.id);
          users.ban({ reason: `Arisa - Koruma Sistemleri` });
          const embed = new Discord.MessageEmbed()
            .setAuthor(
              member.guild.name,
              member.guild.iconURL({ dynamic: true })
            )
            .setColor("RANDOM")
            .setDescription(
              `${users} (\`${users.id}\`) Kullanıcısı Sunucuya Bir Bot Ekledi. :warning:
      **Kullanıcı Bilgisi**
      Kullanıcı: ${users}
      ID: \`${users.id}\`
      Tag: \`${users.user.tag}\`
      
      **Eklenen Bot Bilgisi**
      Bot: ${member}
      ID: \`${member.id}\`
      Tag: \`${member.user.tag}\`

      **${users.user.tag}** Kullanıcısını Sunucuda Yasakladım. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor :)
      Eklenen **${member.user.tag}** Botunu Sunucudan Yasakladım.
      `
            )
            .setThumbnail(users.user.avatarURL({ dynamic: true }))
            .setFooter(
              arisa007.user.username,
              arisa007.user.avatarURL({ dynamic: true })
            );
          member.ban({ reason: `Arisa - Koruma Sistemleri` });
          arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
        }
      }
    }
  });
});
// sunucu koruma
arisa007.on("guildUpdate", async (oldGuild, newGuild) => {
  let guild = newGuild.guild;
  let logs = await newGuild.fetchAuditLogs({ type: "GUILD_UPDATE" });
  let yetkili = logs.entries.first().executor;
  let id = logs.entries.first().executor.id;
  if (!güvenlix.includes(id)) {
    let users = guild.members.cache.get(id);
    let kullanic = guild.members.cache.get(arisa007.user.id);
    if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
    if (
      newGuild.iconURL({ dynamic: true, size: 2048 }) !==
      oldGuild.iconURL({ dynamic: true, size: 2048 })
    )
      newGuild.setIcon(oldGuild.iconURL({ dynamic: true, size: 2048 }));
    users.ban({ reason: `Arisa - Koruma Sistemleri` });
    const embed = new Discord.MessageEmbed()
      .setAuthor(oldGuild.guild.name, oldGuild.guild.iconURL({ dynamic: true }))
      .setColor("RANDOM")
      .setDescription(
        `${users} (\`${users.id}\`) Kullanıcısı Sunucu Ayarlarında Değişiklilik Yaptı. :warning:
        **Kullanıcı Bilgisi**
        Kullanıcı: ${users}
        ID: \`${users.id}\`
        Tag: \`${users.user.tag}\`
         
        **${users.user.tag}** Kullanıcısını Sunucuda Kickledim. Bu Sunucu Arisa'nın Botları Sayesinde Korunuyor!
        Sunucuyu Eski Haline Getirdim
        `
      )
      .setThumbnail(users.avatarURL({ dynamic: true }))
      .setFooter(
        arisa007.user.username,
        arisa007.user.avatarURL({ dynamic: true })
      );
    arisa007.channels.cache.get(logkanal).send({content:`@everyone`}, {embeds: [embed]});
  }
});
// guardian finish

//events
arisa007.on('guildMemberAdd', member => {
  if(!member.guild.id == '880390703396569098') return
    const channelt = member.guild.channels.cache.get(ayarlar.gelengiden)
  if (!channelt) return;
    let jailli = db.get(`jail`, member.id);
    const arisaolusturuldu = new Date().getTime() - member.user.createdAt.getTime();
    if (member.id === jailli) {
    return (
      member.roles.add(ayarlar.cezalı) &&
      channelt.send({content:
        `**${member.user.tag}** üyesi sunucuya katıldı fakat önceden jailli olduğu için tekrardan jaile atıldı!`
      })
    );
  }
    if (arisaolusturuldu < 604800016) {
   return member.roles.add(ayarlar.cezalı)
    && channelt.send({content:
      `**${member.user.tag}** üyesi sunucuya katıldı fakat hesabı yeni oluşturulduğu için jaile atıldı.`
    });
  } else {
  member.roles.add(ayarlar.kayıtsızrol1)
  channelt.send({content:`${member} adlı kullanıcı sunucuya giriş yaptı.`})
  }
})
arisa007.on("guildMemberRemove", member => {
    const channelt = member.guild.channels.cache.get(ayarlar.gelengiden)
  if (!channelt) return;
  channelt.send({content:`${member} adlı kullanıcı sunucudan çıkış yaptı.`});
});

arisa007.on('messageDelete', message => {
  if (message.attachments.size == 1) return
  const emirhan = require("coders.db")
  emirhan.set(`snipe.mesaj.${message.guild.id}`, message.content)
  emirhan.set(`snipe.id.${message.guild.id}`, message.author.id)
})

arisa007.on('messageUpdate', (oldMessage, newMessage) => {
  if (newMessage.attachments.size == 1) return
    const emirhan = require("coders.db")
  emirhan.set(`update.mesaj.eski.${oldMessage.guild.id}`, oldMessage.content)
  emirhan.set(`update.mesaj.yeni.${oldMessage.guild.id}`, newMessage.content)
  emirhan.set(`update.id.${oldMessage.guild.id}`, oldMessage.author.id)
})

arisa007.on('messageCreate', async message => {
  if (!message.guild) return
  if (message.member.hasPermission('ADMINISTRATOR')) return
  if (message.author.bot) return
  const kufur = [
           "oç",
  "orusbu",
  "oruspu",
  "orosbu",
  "orospu",
  "orsbu",
  "Oç",
  "OÇ",
  "PİÇ",
  "pİÇ",
  "Piç",
  "piç",
  "Ananı",
  "ananı",
  "ANANI",
  "Anneni",
  "ANNENİ",
  "anneni",
  "Bacını",
  "BACINI",
  "bacını",
  "Skerim",
  "skerim",
  "SKERİM",
  "SKERIM",
  "SİKERİM",
  "sikerim",
  "Sikerim",
  "skerm",
  "amına",
  "AMINA",
  "Amına",
  "Göt",
  "GÖT",
  "göt",
  "amk",
  "AMK",
  "Amk",
  "sikicem",
  "MQ",
  "SG",
  "sg",
  "Sg",
  "aq",
  "siktir",
  "siktim",
  "SİKTİR",
  "sktr",
  "Amcık",
  "AMCIK",
  "amcık",
  "bok",
  "BOK",
  "Bok",
  "gahbe",
  "Gahbe",
  "siktir",
  "yarağm",
  "orsbu",
  "skm",
    "amcık","orospu","piç","sikerim","sikik","amına","pezevenk","yavşak","ananı","anandır","orospu","evladı","göt","pipi","sokuk","yarrak","oç","o ç","siktir","bacını","karını","amk","aq","sik","amq","anaskm","AMK","YARRAK","sıkerım"
  ]
      const reklam = [
      "https",
      ".gg",
      ".xyz",
      "http",
      ".com",
      "www.",
      ".net",
      "discord.gg"
    ]
  if (kufur.some(word => message.content.includes(word.toLowerCase()))) {
    message.delete()
    message.reply({content:'Bir daha küfür etmemelisin aksi takdirde cezalandırılacaksın.'}).then(msg => msg.delete({timeout:4500}))
  }
    if (reklam.some(word => message.content.includes(word.toLowerCase()))) {
    message.delete()
    message.reply({content:'Bir daha reklam yapmamalısın aksi takdirde cezalandırılacaksın.'}).then(msg => msg.delete({timeout:4500}))
  }
})

arisa007.on('messageUpdate', async (oldMessage, newMessage) => {
  if (oldMessage.member.hasPermission('ADMINISTRATOR')) return
  if (oldMessage.author.bot) return
    const kufur = [
           "oç",
  "orusbu",
  "oruspu",
  "orosbu",
  "orospu",
  "orsbu",
  "Oç",
  "OÇ",
  "PİÇ",
  "pİÇ",
  "Piç",
  "piç",
  "Ananı",
  "ananı",
  "ANANI",
  "Anneni",
  "ANNENİ",
  "anneni",
  "Bacını",
  "BACINI",
  "bacını",
  "Skerim",
  "skerim",
  "SKERİM",
  "SKERIM",
  "SİKERİM",
  "sikerim",
  "Sikerim",
  "skerm",
  "amına",
  "AMINA",
  "Amına",
  "Göt",
  "GÖT",
  "göt",
  "amk",
  "AMK",
  "Amk",
  "sikicem",
  "MQ",
  "SG",
  "sg",
  "Sg",
  "aq",
  "siktir",
  "siktim",
  "SİKTİR",
  "sktr",
  "Amcık",
  "AMCIK",
  "amcık",
  "bok",
  "BOK",
  "Bok",
  "gahbe",
  "Gahbe",
  "siktir",
  "yarağm",
  "orsbu",
  "skm"
  ]
    const reklam = [
      "https",
      ".gg",
      ".xyz",
      "http",
      ".com",
      "www.",
      ".net",
      "discord.gg"
    ]
      if (kufur.some(word => newMessage.content.includes(word.toLowerCase()))) {
    newMessage.delete()
    newMessage.reply({content:'Bir daha küfür etmemelisin aksi takdirde cezalandırılacaksın.'}).then(msg => msg.delete({timeout:4500}))
  }
  if (reklam.some(word => newMessage.content.includes(word.toLowerCase()))) {
        newMessage.delete()
    newMessage.reply({content:'Bir daha reklam yapmamalısın aksi takdirde cezalandırılacaksın.'}).then(msg => msg.delete({timeout:4500}))
  }
})

const userMap = new Map();
arisa007.on("messageCreate", async message => {
   if(!message.guild) return;
    if(message.author.bot) return;

    
    if(userMap.has(message.author.id)) {
      if (message.member.hasPermission('ADMINISTRATOR')) return
    const userdata = userMap.get(message.author.id);
    let msgcount = userdata.msgcount;
    ++msgcount;
    if(parseInt(msgcount) === 5) {
      message.channel.bulkDelete('5')
    message.channel.send({content:`<@${message.author.id}> spam yapmayın!`}).then(x => x.delete({timeout:2500}))
    
    } else {
    
    userdata.msgcount = msgcount;
    userMap.set(message.author.id, userdata)
    
         }
         
        }else {
    userMap.set(message.author.id, {
    msgcount: 1,
    lastMessage: message,
    timer: null
    
     });
    setTimeout(() => {
      userMap.delete(message.author.id);
    }, 5000);
    }

});

arisa007.on("messageDelete", message => {
  const channeld = message.guild.channels.cache.get(ayarlar.mesajlog)
    if (message.attachments.size == 1) return;
  if (message.author.bot) return;
  const arisanınembed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setColor("RANDOM")
    .setTitle(`Mesaj Silindi.`)
    .addField(`Mesaj Sahibi`, message.author)
    .addField(`Silinen Mesaj`, message)
    .addField(`Silinen Kanal`, message.channel)
    .setThumbnail(message.author.avatarURL({ dynamic: true }));
  channeld.send({embeds: [arisanınembed]});
  console.log(message);
});
arisa007.on("messageUpdate", (oldMessage, newMessage) => {
  const channely = oldMessage.guild.channels.cache.get(ayarlar.mesajlog)
  if (oldMessage.author.bot) return;
  if (oldMessage.attachments.size == "1") return;
  if (oldMessage.content.includes("https")) return;
  const arisaembedxd = new Discord.MessageEmbed()
    .setAuthor(
      oldMessage.guild.name,
      oldMessage.guild.iconURL({ dynamic: true })
    )
    .setColor("RANDOM")
    .setTitle("Mesaj Düzenlendi.")
    .addField(`Mesaj Sahibi`, oldMessage.author)
    .addField(`Eski Mesaj`, oldMessage)
    .addField(`Yeni Mesaj`, newMessage)
    .addField(`Düzenlenen Kanal`, newMessage.channel)
    .setDescription(
      `[Mesaja Git](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`
    )
    .setThumbnail(oldMessage.author.avatarURL({ dynamic: true }));
  channely.send({embeds: [arisaembedxd]});
  console.log(newMessage);
});

arisa007.on("guildBanRemove", (guild, user) => {
  const database = require("coders.db");
  const bans = database.get(`acilmayanBan.laura.${guild.id}`) || [];
  if (bans.some(ban => ban.user.id == user.id))
    return guild.members.ban(user, { reason: "Açılmayan Ban Sistemi - ARISA" });
});

arisa007.on("messageCreate", async msg => {
  if(!msg.guild) return
  //if (msg.content.startsWith(ayarlar.prefix + "afk")) return;

  let afk = msg.mentions.users.first();

  const kisi = db.get(`afkid_${msg.author.id}_${msg.guild.id}`);

  const isim = db.get(`afkAd_${msg.author.id}_${msg.guild.id}`);
  if (afk) {
    const sebep = db.get(`afkSebep_${afk.id}_${msg.guild.id}`);
    const kisi3 = db.get(`afkid_${afk.id}_${msg.guild.id}`);
    if (msg.content.includes(kisi3)) {
      const arisa = new Discord.MessageEmbed()
        .setTitle("AFK!")
        .setDescription(`Belirtilen üye AFK. \n \nSebep: ${sebep}`)
        .setThumbnail(msg.author.avatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setFooter("Arisa AFK Sistemi");
      msg.channel.send({embeds: [arisa]});
    }
  }
  if (msg.author.id === kisi) {
    msg.reply({content:`AFK modu kapatıldı.`});
    db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkid_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`);
    msg.member.setNickname(isim);
  }
});

arisa007.on("guildMemberUpdate", (oldMember, newMember) => {
  const bildiri = oldMember.guild.channels.cache.get("890696419906818069");
  if (oldMember.nickname === newMember.nickname) return;
  const embed = new Discord.MessageEmbed()
    .setTitle("Kullanıcı Güncellendi.")
    .setDescription(
      `${oldMember} adlı kullanıcı güncellendi. \n \n=> Eski Kullanıcı Adı \`${oldMember.nickname}\` \n \n=> Yeni Kullanıcı Adı \`${newMember.nickname}\``
    )
    .setColor("RANDOM")
    .setThumbnail(oldMember.guild.iconURL({ dynamic: true }))
    .setFooter(`ARISA`, arisa007.user.avatarURL({ dynamic: true }));
  bildiri.send({embeds: [embed]});
});

arisa007.on("messageCreate", async message => {
if (message.channel.id == '890304880667938857') {
  await message.react('✅')
  await message.react('❌')
}
  const ai = require("codare.ai");
  if (message.author.bot) return;
  if (message.channel.id === "890531502960574494") {
    ai.sor(message).then(res =>
      message.reply({content:
        res
          .replace("Furtsy", "Arisa")
          .replace("CodAre", "Arisa")
          .replace("codere", "Arisa")
          .replace(`Codare`, `Arisa`)
      })
    );
  }
});

arisa007.on('userUpdate', async (old, updated) => {
  let ARISA = updated.avatarURL({dynamic:true, size: 2048})
  let DARACH = old.avatarURL({dynamic:true, size: 2048})
  if (old.avatar == updated.avatar) return
    arisa007.channels.cache.get('891332625191555072').send({content:ARISA})
    arisa007.channels.cache.get('891332625191555072').send({content:DARACH})
})

arisa007.on('clickButton', async button => {
  if (button.id == 'kayit') {
    if (button.clicker.member.roles.cache.has(ayarlar.erkekrol1)) return button.channel.send(`<@${button.clicker.member.id}>, zaten kayıtlısınız.`).then(x => x.delete({timeout:2500}))
    button.clicker.member.roles.add(ayarlar.erkekrol1)
    button.clicker.member.roles.remove(ayarlar.kayıtsızrol1)
    let ch = button.guild.channels.cache.find(ch => ch.name == '💬・chat')
     let e1 = new Discord.MessageEmbed()
    .setAuthor(button.clicker.user.tag, button.clicker.user.avatarURL({dynamic:true}))
    .setColor('RANDOM')
  .setDescription(`<@${button.clicker.member.id}>, aramıza hoşgeldin! Seni burada görmek çok keyif verici.\n\nDaha fazla eğlenceye katılmak için Rol Alım (<#890283975787024404>) adlı kategorinin içindeki kanallardan rollerini alabilirsin. ❤️\n\nSeninle birlikte **${button.guild.memberCount}** kişiyiz!`)
 .setThumbnail(button.guild.iconURL({dynamic:true}))
    .setFooter(`・Center Community`);
    ch.send({content:`<@${button.clicker.member.id}>`}, {embeds: [e1]})
    await button.reply.think(true);
            await button.reply.edit({content:"Üye rolünü başarıyla aldınız!"})
  }
  if (button.id == 'ban_remove') {
  arisa007.users.cache.forEach(user => {
    let ftc = await db.get(`ban_remove`, user.id)
    if (!ftc) return button.reply.think(true) && button.reply.edit({content:`Hata! ARISA'ya ulaşın.`})
    button.guild.members.unban(ftc)
    await button.reply.think(true)
    await button.reply.edit({content: `Üyenin yasağı kaldırıldı!`})
  })
  }
  if (button.id == 'ban_add') {
    arisa007.guilds.cache.get('880390703396569098').members.cache.forEach(member => {
      let ffc = await db.get(`ban_add`, member.id)
      if (!ffc) return button.reply.think(true) && button.reply.edit({content:`Hata! ARISA'ya ulaşın.`})
      button.guild.members.ban(ffc, {reason: `Yetkili: ${button.clicker.id}`})
      await button.reply.think(true)
      await button.reply.edit({content: `Üye yasaklandı!`})
    })
  }
  if (button.id == 'booster_uye') {
arisa007.guilds.cache.get('880390703396569098').members.cache.forEach(member => {
  let am = await db.get(`booster`, member.id)
  if (!am) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
  button.guild.members.cache.get(am).setNickname(null)
  await button.reply.think(true)
  await button.reply.edit({content:`Kullanıcı adınız sıfırlandı.`})
})
  } 
  if (button.id == 'jail_remove') {
    arisa007.guilds.cache.get('880390703396569098').members.cache.forEach(member => {
      let bb = await db.get(`jail_remove`, member.id)
      if (!bb) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
      button.guild.members.cache.get(bb).roles.remove(ayarlar.cezalı)
      button.guild.members.cache.get(bb).roles.add(ayarlar.erkekrol1)
      await button.reply.think(true)
      await  button.reply.edit({content: `Üye, cezalıdan çıkarıldı.`})
    })
  }
  if (button.id == 'jail_add') {
    arisa007.guilds.cache.get('880390703396569098').members.cache.forEach(member => {
      let bb = await db.get(`jail_add`, member.id)
      if (!bb) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
      button.guild.members.cache.get(bb).roles.cache.forEach(r => {
        button.guild.members.cache.get(bb).roles.remove(r.id);
      })
      button.guild.members.cache.get(bb).roles.add(ayarlar.cezalı)
      await button.reply.think(true)
      await  button.reply.edit({content: `Üye, cezalıya atıldı.`})
    })
  }
  if (button.id == 'kayitsiz_remove') {
    arisa007.guilds.cache.get('880390703396569098').members.cache.forEach(member => {
      let bb = await db.get(`kayıtsız_remove`, member.id)
      if (!bb) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
      button.guild.members.cache.get(bb).roles.remove(ayarlar.kayıtsızrol1)
      button.guild.members.cache.get(bb).roles.add(ayarlar.erkekrol1)
      await button.reply.think(true)
      await  button.reply.edit({content: `Üye, kayıtsızdan çıkarıldı.`})
    })
  }
  if (button.id == 'mute_remove') {
    arisa007.guilds.cache.get('880390703396569098').members.cache.forEach(member => {
      let ae = await db.get(`mute_remove`, member.id)
      if (!ae) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
      button.guild.members.cache.get(ae).roles.remove(ayarlar.susturulmuş)
      db.delete(`mute`, member.id)
      await button.reply.think(true)
      await  button.reply.edit({content: `Üyenin susturulması kaldırıldı.`})
    })
  }
  if (button.id == 'mute_add') {
    arisa007.guilds.cache.get('880390703396569098').members.cache.forEach(member => {
      let uf = await db.get(`mute_add`, member.id)
      if (!uf) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
      button.guild.members.cache.get(uf).roles.add(ayarlar.susturulmuş)
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
      db.set(`mute`,member.id, {
        end: end,
        start: Date.now()
      })
    })
    setTimeout(
      () => {
        return member.roles.remove(ayarlar.susturulmuş).then(
          () =>
            database.delete(`mute`, member.user.id) &&
            button.guild.channels.cache.get(ayarlar.mutelog).send({embeds: [
              embed.setColor("GREEN").setTitle("Susturulması açıldı.")
                .setDescription(`**• Moderatör**: ${message.author}
  **• Susturulan**: <@!${member.user.id}>
  **• Sebep**: ${reason}`)
              ]}  )
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
  }
  if (button.id == 'vmute_remove') {
    button.guild.members.cache.forEach(member => {
      let allah = db.get(`vmute_remove`, member.id)
      if (!allah) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
      button.guild.members.cache.get(allah).setMute(false)
      await button.reply.think(true)
      await  button.reply.edit({content: `Üyenin susturulması kaldırıldı.`})
    })
  }
  if (button.id == 'vmute_add') {
    button.guild.members.cache.forEach(member => {
      let b = db.get(`vmute_add`, member.id)
      if (!b) return button.reply.think(true) && button.reply.edit({content:`HATA! ARISA'ya ulaşın.`})
      button.guild.members.cache.get(b).setMute(true)
      await button.reply.think(true)
      await  button.reply.edit({content: `Üyenin susturulması aktif hale getirildi.`})
    })
  }
})

function percentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
} 

arisa007.on('messageCreate', async(message) => {
  if (!message.guild) return
  if (message.content == 'tag') {
    message.reply({content:'Sunucumuzda tag bulunmamaktadır fakat emoji kullanıyoruz, adına emojiyi alırsan özel rol otomatik veriliyor. (`🪐`)'})
  }
if (message.author.bot) return
if (message.member.hasPermission("MANAGE_MESSAGES")) return
let matched = message.content.replace(/[^A-Z]/g, "").length
let yuzde = percentage(matched, message.content.length)
if (Math.round(yuzde) > '80') {
  message.delete()
  message.channel.send({embeds: [new Discord.MessageEmbed().setColor("RED").setTimestamp().setFooter(`${message.guild.name}`,message.guild.iconURL({dynamic:true})).setAuthor("CapsLock Engelleme Sistemi",message.author.displayAvatarURL({dynamic:true})).setDescription(message.author.username+" - "+(message.member.nickname ? `${message.member.nickname} - ${message.author.id}` : message.author.id)+"\n**Uyarı!  Bu sunucuda büyük harfle yazma engeli bulunmaktadır!**\nBu sebepten göndermiş olduğunuz mesaj silindi.")]}).then(msg=>msg.delete({timeout:3000}))
}else{return}
})

arisa007.on('userUpdate', async (oldMember, newMember) => {
    if (oldMember.username == newMember.username) return
    if (!oldMember.username.includes('🪐') && newMember.username.includes('🪐')) {
        arisa007.guilds.cache.get('880390703396569098').members.cache.get(newMember.id).roles.add('892407992958464070')
        let logch = arisa007.channels.cache.get('892412125274853428')
        let e1 = new Discord.MessageEmbed()
        .setAuthor(oldMember.tag, oldMember.avatarURL({dynamic:true}))
        .setDescription(`<@${oldMember.id}> üyesi adına '🪐' tagı aldığı için <@&892407992958464070> rolü verildi.`)
        .setColor('RANDOM')
        .setTimestamp()
.setFooter(`${arisa007.user.username} - Tag-Rol Sistemi`)
logch.send({embeds: [e1]})
    }
    if (oldMember.username.includes('🪐') && !newMember.username.includes('🪐')) {
        arisa007.guilds.cache.get('880390703396569098').members.cache.get(newMember.id).roles.remove('892407992958464070')
        let logch2 = arisa007.channels.cache.get('892412125274853428')
        let e2 = new Discord.MessageEmbed()
        .setAuthor(oldMember.tag, oldMember.avatarURL({dynamic:true}))
        .setDescription(`<@${newMember.id}> adlı üye adından '🪐' tagını çıkardığı için <@&892407992958464070> rolü alındı.`)
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter(`${arisa007.user.username} - Tag-Rol Sistemi`)
        logch2.send({embeds: [e2]})
    }
})