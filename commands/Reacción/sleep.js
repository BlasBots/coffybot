module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'sleep',
      description: 'Duerme como un lindo bebé',
      usage: (prefix) => `\`${prefix}sleep\``,
      examples: (prefix) => `\`${prefix}sleep\``,
      enabled: true,
      cooldown: 3,
      aliases: [],
      botPermissions: [],
      memberPermissions: [],
      dirname: __dirname,
    });
  }
  async run(message, args, data, embed) {
    let client = this.client;
    try {
      embed.setDescription(client.fns.reply(this.help.name, message)).setColor(client.fns.selectColor('lightcolors')).setImage(client.fns.gifs(this.help.name));
      message.channel.send({ embed });
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
