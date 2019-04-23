require('dotenv').config();

const Discord = require('discord.js');
const FileSync = require('lowdb/adapters/FileSync');
const Seraph = require('./services/seraph.js');
const Fate = require('./services/fate.js');
const Sheba = require('./services/sheba.js');

const client = new Discord.Client();
const seraph = new Seraph(new FileSync('docs/json/akasha.json'));
const fate = new Fate(seraph);
const sheba = new Sheba('docs/img/');

// Helpers
const embed = svt => new Discord.RichEmbed()
  .attachFile(sheba.getImgPath(svt.id))
  .setAuthor(svt.name)
  .setDescription(`*${svt.avail} ${svt.rarity}:sparkles: ${svt.className}*`)
  .setImage(`attachment://${sheba.getImgName(svt.id)}`)
  .addField('Cards', `${svt.deck} **|** ${svt.np}`)
  .addField('Skills', Array.isArray(svt.actives) ? svt.actives.join('\n') : svt.actives)
  .setFooter(`LV${svt.lv} | ${svt.hps[1]}HP | ${svt.atks[1]}ATK`);

// Configure Discord
client.on('ready', () => client.user.setPresence({
  game: {
    type: 'LISTENING',
    name: `@${client.user.username}`
  },
  status: 'online'
}));

client.on('message', async msg => {
  if (!msg.isMentioned(client.user)) {
    return;
  }

  const query = msg.content.trim().split(/ +/).filter(q => !q.startsWith('<@'));
  const svt = query.length > 0 ? seraph.query(query) : fate.summon();
  if (!svt || !svt.id) {
    return msg.react('🤔');
  }

  const color = await sheba.computeColor(svt.id);
  return msg.reply({embed: embed(svt).setColor(color)});
});

client.login(process.env.TOKEN);

module.exports = client;
