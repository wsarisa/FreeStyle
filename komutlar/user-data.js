const { Discord, MessageEmbed } = require("discord.js");
const fetch = require('node-fetch')
const moment = require("moment");
moment.locale("tr");

exports.run = function(client, message, args) {
  const kisi = message.mentions.users.first() || message.author;
  if (!kisi) return message.reply({content:'Geçerli bir üye belirtin. [Etiket Atarak]'}).then(a => a.delete({timeout:2500}))
  if (kisi.bot) return message.reply({content:'Geçerli bir **kullanıcıyı** etiketleyin.'}).then(a => a.delete({timeout:2500}))
    let uid = kisi.id;

  let response = fetch(`https://discord.com/api/v8/users/${uid}`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${client.token}`
    }
  });

  let receive = "";
  let banner =
    "https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif";

  response.then(a => {
    if (a.status !== 404) {
      a.json().then(data => {
        receive = data["banner"];
        console.log(data);

        if (receive !== null) {
          let response2 = fetch(
            `https://cdn.discordapp.com/banners/${uid}/${receive}.gif`,
            {
              method: "GET",
              headers: {
                Authorization: `Bot ${client.token}`
              }
            }
          );
          let statut = "";
          response2.then(b => {
            statut = b.status;
            banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`;
            if (statut === 415) {
              banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`;
            }
          });
        }
      });
    }
  });
  let x = kisi.presence.status
    .replace("dnd", `Rahatsız Etmeyin. 🔴`)
    .replace("idle", `Boşta. 🟡`)
    .replace("online", `Çevrimiçi. 🟢`)
    .replace("offline", `Çevrimdışı. ⚪`);
  let baknedicm = {
    web: "Internet Tarayıcısı",
    desktop: "Bilgisayar (Uygulama)",
    mobile: "Mobil"
  };
  let uyy;
  if (kisi.presence.status !== "offline") {
    uyy = `${baknedicm[Object.keys(kisi.presence.clientStatus)[0]]}`;
  } else {
    uyy = "Algılanmadı.";
  }
  var f = "";
  if (kisi.presence.activities.map(a => a.state))
    f = kisi.presence.activities.map(a => a.state);
  if (kisi.presence.activities.map(a => a.state) == "") f = "-";
  let k;
  const m = message.guild.members.cache.find(a => a.id == kisi.id);
    setTimeout(() => {
          if (!receive) {
            message.reply({content:'Banner bulunamadı. [?]'})
            banner = 'Yok.'
          }
  const embed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setColor("RANDOM")
    .setDescription(
      `\`Kullanıcı Adı:\` **${kisi.username}**\n
\`Kullanıcı Tagı:\` **${kisi.tag}**\n
\`Kullanıcı ID:\` **${kisi.id}**\n
\`Kullanıcı Hashtag:\` **${kisi.discriminator}**\n
\`Kullanıcı Cihazı:\` **${uyy}**\n
\`Kullanıcı Oluşturulma Tarihi:\` **${moment(kisi.createdAt).format(
        "D MMMM YYYY"
      )}**\n
\`Kullanıcı Durum:\` **${x}**\n
\`Kullanıcı Özel Durum Mesajı\`: **${f}**\n
\`Sunucuya Katılma Tarihi:\` **${moment(m.joinedAt).format("D MMMM YYYY")}**\n
\`Avatar URL:\` **${kisi.avatarURL({dynamic:true})}**\n
\`Banner URL:\` **${banner}**`
    )
    .setTimestamp()
    .setThumbnail(kisi.avatarURL({dynamic:true}));
  message
.reply({embeds: [embed]})
    }, 1000);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["info", "kullanıcıbilgi"],
  permLevel: 0
};
//firex
exports.help = {
    cooldown: 5,
  name: "i"
};
