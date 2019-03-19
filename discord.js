require('dotenv').config();
const Discord = require('discord.js');
const Seraph = require('./js/seraph.js');
const Fate = require('./js/fate.js');
const client = new Discord.Client();
const seraph = new Seraph('json/akasha.json');
const fate = new Fate(seraph);

let embed = svt => new Discord.RichEmbed()
  .attachFile(`img/servants/${seraph.get4thAscFilename(svt.id)}`)
  .setAuthor(`${svt.name}`)
  .setDescription(`*${svt.avail} ${svt.rarity}:sparkles: ${svt.className}*`)
  .setImage(`attachment://${seraph.get4thAscFilename(svt.id)}`)
  .addField('Cards', `${svt.deck} **|** ${svt.np}`)
  .addField('Skills', svt.actives.join('\n'))
  .setFooter(`LV${svt.lv} | ${svt.hps[1]}HP | ${svt.atks[1]}ATK`)
  .setColor(0xaf74b0);

client.on('ready', () => {
  client.user.setPresence({
    game: {
      type: 'LISTENING',
      name: `@${client.user.username}`
    },
    status: 'online'
  });
});

client.on('message', msg => {
  if (!msg.isMentioned(client.user)) return;
  let query = msg.content.trim().split(/ +/).filter(q => !q.startsWith('<@'));
  let svt = !query.length ? fate.summon() : seraph.query(query);
  if (!svt || !svt.id) return msg.react('🤔');
  return msg.reply({embed: embed(svt)});
});

client.login(process.env.TOKEN);

module.exports = client;
