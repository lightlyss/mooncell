require('dotenv').config();
const Discord = require('discord.js');
const Database = require('./js/db.js');
const client = new Discord.Client();
const db = new Database('json/db.json');

let embed = svt => {
  let imgId = svt.id.replace('.', 'p');
  while (imgId.split('p')[0].length < 3) imgId = '0' + imgId;
  return new Discord.RichEmbed()
    .attachFile(`img/servants/${imgId}4.png`)
    .setAuthor(`${svt.name}`)
    .setDescription(`*${svt.avail} ${svt.rarity}:sparkles: ${svt.className}*`)
    .setImage(`attachment://${imgId}4.png`)
    .addField('Cards', `${svt.deck} | ${svt.np}`)
    .addField('Skills', svt.actives.join('\n'))
    .setFooter(`LV${svt.lv}  |  ${svt.hps[1]}HP    ${svt.atks[1]}ATK`)
    .setColor(0xaf74b0);
}

client.on('ready', () => {
  client.user.setPresence({
    game: {
      type: 'LISTENING',
      name: `@${client.user.username}`
    },
    status: 'online'
  });
  console.log('OK');
});

client.on('message', msg => {
  if (!msg.isMentioned(client.user)) return;
  let query = msg.content.split(/ +/).filter(q => !q.startsWith('<@'));
  if (query.find(q => q.toLowerCase() == 'exit')) return client.destroy();
  let svt = db.queryByName(query);
  if (!svt || !svt.id) return msg.react('🤔');
  msg.reply({embed: embed(svt)});
});

client.login(process.env.TOKEN);
