module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'pat',
      description: 'Da un poco de caricias con mucho amor al que tu desees',
      usage: (prefix) => `\`${prefix}pat <@usuario>\``,
      examples: (prefix) => `\`${prefix}\``,
      enabled: true,
      guildOnly: true,
      aliases: ['acariciar'],
      botPermissions: [],
      memberPermissions: [],
      dirname: __dirname,
    });
  }
  async run(message, args, data, embed) {
    let client = this.client;
    try {
      let help = this.help;
      if (!args[0]) return message.channel.send(client.message({ emoji: 'red', razón: 'noargs menciona a quien más amas (?)', usage: this.help.usage(message.prefix), message }));
      else {
        if (!isNaN(args[0])) {
          let uuu = message.guild.members.cache.find((x) => x.id === args[0]);
          if (uuu) return await send(uuu.user);
          else return message.channel.send(client.message({ emoji: 'red', razón: 'esa ID no pertenece a nadie, al menos no en este servidor', usage: this.help.usage(message.prefix), message }));
        }
        if (message.mentions.users.size > 0) return await send(message.mentions.users.first());
        let u = message.guild.members.cache.array().filter((x) => `${x.user.tag}||${x.displayName}`.toLowerCase().includes(args[0].toLowerCase()));
        if (u.length <= 0) return message.channel.send(client.message({ emoji: 'red', razón: 'no hay usuarios que coincidan con tu búsqueda, intenta ser más específico', usage: this.help.usage(message.prefix), message }));
        if (u.length === 1) return await send(u[0].user);
        if (u.length > 10) return message.channel.send(client.message({ emoji: 'red', razón: 'muchos usuarios coinciden con tu búsqueda, intenta ser más específico', usage: this.help.usage(message.prefix), message }));
        else {
          let m = 'Selecciona un número entre 1 y ' + u.length + '```';
          for (let x = 0; x < u.length; x++) {
            m += `${x + 1} ~ ${u[x].nickname ? `${u[x].displayName} (${u[x].user.tag})` : `${u[x].user.tag}`}\n`;
          }
          let msg = await message.channel.send({ embed: { color: client.fns.selectColor('lightcolors'), description: m + '```' } }),
            i = await message.channel.awaitMessages((m) => m.author.id === message.author.id && m.content > 0 && m.content < u.length + 1, { max: 1, time: 30000 });
          i = await i.first();
          if (!i) {
            message.channel.send(client.message({ emoji: 'red', razón: 'no se recibió respuesta', usage: this.help.usage(message.prefix), message }));
            msg.delete({ timeout: 5000 });
          } else {
            await send(u[i.content - 1].user);
            msg.delete({ timeout: 5000 });
          }
        }
      }
      async function send(user) {
        let img = await require('node-superfetch').get('https://nekos.life/api/v2/img/pat');
        if (user === message.author) return message.channel.send(client.message({ emoji: 'red', razón: 'no te puedes acariciar a ti mism@', message }));
        else if (user === client.user) return message.channel.send(client.message({ emoji: 'heart', razón: 'uwu', message }));
        embed
          .setColor(client.fns.selectColor('lightcolors'))
          .setDescription('**' + message.author.username + '** acarició a **' + user.username + '**')
          .setImage(img.body.url);
        message.channel.send({ embed });
      }
    } catch (e) {
      client.err({
        type: 'command',
        name: this.help.name,
        error: e,
        message,
      });
    }
  }
};
