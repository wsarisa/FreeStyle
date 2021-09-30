const Discord = require("discord.js");
const database = require("coders.db");

exports.run = async (client, message, args) => {
  const error = str =>
    message.channel.send({embeds: [
      new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("Hata")
        .setDescription(str)
    ]}
    );

  if (message.author.id !== "457481463294722050") return message.reply({content:'Bu yetkiyi yalnızca ` ๖ۣۜARISA El Chavo 🪐#3001 kullanabilir.'}).then(a => a.delete({timeout:1250}))

  // !aban ban <user> <reason> || !aban <user> <reason> || !aban <user> || !aban unban <user> || !aban liste || !aban sorgu
  const option = args[0];
  const options = ["ban", "unban", "liste", "sorgu"];

  const ban = async (user, reason) => {
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return error("Bu işlemi yapabilmek için yeterli yetkim yok.");

    try {
      const executor = await message.author;
      const bans = database.get(`acilmayanBan.arisa.${message.guild.id}`) || [];

      if (user.id == executor.id) return error("Kendini banlayamazsın.");
      if (bans.some(ban => ban.user.id == user.id))
        return error("Bu kullanıcı zaten açılmayacak bir şekilde banlanmış.");
      if (
        message.guild.members.cache.has(user.id) &&
        message.guild.members.cache.get(user.id).roles.highest.position >=
          message.member.roles.highest.position &&
        message.member.id != message.guild.owner.id
      )
        return error("Bu kullanıcıyı banlayamazsınız.");
      if (
        message.guild.members.cache.has(user.id) &&
        !message.guild.members.cache.get(user.id).bannable
      )
        return error("Bu kullanıcıyı banlayamam.");

      const banID = database.add(`acilmayanBanID_${message.guild.id}`, 1);

      user.send({embeds: [
        new Discord.MessageEmbed()
          .setColor("RED")
          .setDescription(
            `> (#${banID}) **${message.guild.name}** adlı sunucudan banlandınız. Sebep: **${reason}**`
          )
      ]}
      );
      message.channel.send({embeds: [
        new Discord.MessageEmbed()
          .setColor("RED")
          .setDescription(
            `> (#${banID}) **${user.tag}** kişisine açılmayan ban atıldı. Sebep: **${reason}**`
          )
      ]}
      );
      message.guild.members.ban(user, { reason });
      database.push(`acilmayanBan.arisa.${message.guild.id}`, {
        id: banID,
        executor,
        user,
        reason,
        time: new Date()
      });
    } catch (err) {
      if (err.code == 50035) {
        error(
          `\`${err.message.split('"')[1]}\` geçerli bir üye veya ID değil.`
        );
      } else {
        error("Bir hata oluştu.");
        console.log(err);
      }
    }
  };

  const unban = async user => {
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return error("Bu işlemi yapabilmek için yeterli yetkim yok.");

    try {
      const executor = await message.author;
      const bans = database.get(`acilmayanBan.arisa.${message.guild.id}`) || [];

      if (!bans.some(ban => ban.user.id == user.id))
        return error("Bu kullanıcı zaten açılmayan şekilde banlanmamış.");
      if (user.id == executor.id) return error("Kendi banını açamazsın.");

      const ban = bans.find(ban => ban.user.id == user.id);

      user.send({embeds: [
        new Discord.MessageEmbed()
          .setColor("RED")
          .setDescription(
            `> (#${ban.id}) **${message.guild.name}** adlı sunucudan banınız açıldı.`
          )
      ]}
      );
      message.channel.send({embeds: [
        new Discord.MessageEmbed()
          .setColor("RED")
          .setDescription(
            `> (#${ban.id}) **${user.tag}** kişisine atılan açılmayan ban açıldı.`
          )
      ]}
      );
      message.guild.members.unban(user);

      bans.splice(bans.findIndex(ban => ban.user.id == user.id), 1);
      database.set(`acilmayanBan.arisa.${message.guild.id}`, bans);
    } catch (err) {
      if (err.code == 50035) {
        error(
          `\`${err.message.split('"')[1]}\` geçerli bir üye veya ID değil.`
        );
      } else {
        error("Bir hata oluştu.");
        console.log(err);
      }
    }
  };

  const list = async () => {
    const bans = database.get(`acilmayanBan.arisa.${message.guild.id}`) || [];
    const banneds = bans
      .map(
        ban =>
          `${ban.user.tag} (${ban.user.id}) | ${ban.executor.tag} (${ban.executor.id})`
      )
      .join("\n");

    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(
        `Toplam **${bans.length}** kişi banlı. Açılmayan banlılar listesini aşağıdaki dosyadan görebilirsiniz.`
      );
    const attachment = new Discord.MessageAttachment(
      Buffer.from(
        banneds + "\n\n\ ❤️ arisaaaa from coderscode",
        "utf-8"
      ),
      "açılmayan-ban-listesi.txt"
    );

    message.channel.send({embeds: [embed]});
    message.channel.send({attachments: [attachment]});
  };

  const query = async user => {
    const bans = database.get(`acilmayanBan.arisa.${message.guild.id}`) || [];
    const ban = bans.find(ban => ban.user.id == user.id);

    if (!ban) return error("Girilen kullanıcı banlı değil.");

    const infoEmbed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
      .setDescription(`Bu kullanıcı açılmayacak bir şekilde banlanmış.`)
      .addFields(
        { name: `Moderatör`, value: `${ban.executor.tag}`, inline: true },
        { name: `Üye`, value: `${ban.user.tag}`, inline: true },
        { name: `Sebep`, value: `${ban.reason}`, inline: true }
      )
      .setFooter(
        `Ban ID: ${ban.id} | Tarih: ${new Date(ban.time).toDateString("tr-TR")}`
      );

    message.channel.send({embeds: [infoEmbed]});
  };

  try {
    if (!options.includes(option)) {
      const bans = database.get(`acilmayanBan.arisa.${message.guild.id}`) || [];
      const user =
        (await message.mentions.users.first()) ||
        (await client.users.fetch(args[0]));

      if (bans.some(ban => ban.user.id == user.id)) {
        unban(user);
      } else {
        const reason = args.slice(1).join(" ") || "Sebep belirtilmemiş.";
        ban(user, reason);
      }
    } else if (options.includes(option)) {
      switch (option) {
        case "ban":
          var user =
            (await message.mentions.users.first()) ||
            (await client.users.fetch(args[1]));
          var reason = args.slice(2).join(" ") || "Sebep belirtilmemiş.";
          ban(user, reason);
          break;
        case "unban":
          var user =
            (await message.mentions.users.first()) ||
            (await client.users.fetch(args[1]));
          unban(user);
          break;
        case "liste":
          list();
          break;
        case "sorgu":
          var user =
            (await message.mentions.users.first()) ||
            (await client.users.fetch(args[1]));
          query(user);
          break;
        default:
      }
    }
  } catch (err) {
    if (err.code == 50035) {
      error(`\`${err.message.split('"')[1]}\` geçerli bir üye veya ID değil.`);
    } else {
      error("Bir hata oluştu.");
      console.log(err);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["açılmayanban", "aban"],
  permLevel: 0
};

exports.help = {
  name: "açılmayan-ban",
  description: "açılmayan ban sistemi, laura tarafından yapıldı."
};