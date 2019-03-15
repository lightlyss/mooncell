require('dotenv').config();
const Discord = require('discord.js');
const Database = require('./js/db.js');
const client = new Discord.Client();
const db = new Database('json/db.json');

let embed = svt => new Discord.RichEmbed()
  .attachFile(`img/servants/${db.get4thAscFilename(svt.id)}`)
  .setAuthor(`${svt.name}`)
  .setDescription(`*${svt.avail} ${svt.rarity}:sparkles: ${svt.className}*`)
  .setImage(`attachment://${db.get4thAscFilename(svt.id)}`)
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
  let query = msg.content.split(/ +/).filter(q => !q.startsWith('<@'));
  let svt = db.query(query);
  if (!svt || !svt.id) return msg.react('🤔');
  msg.reply({embed: embed(svt)});
});

client.login(process.env.TOKEN);

module.exports = client;
