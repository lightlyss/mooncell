/**
* Akashic Records (False): Automaton
*/
const fs = require('fs');
const FIELDS = [
  'id', 'name', 'className', 'rarity',
  'growth', 'lv', 'hps', 'atks',
  'npGains', 'hitCounts', 'crits', 'death',
  'attr', 'traits',
  'actives', 'passives', 'np',
  'deck', "ascs", 'upgrades', 'avail',
  'cost', 'align', 'bondId',
  'art', 'voice', 'valId'
];
const ENCODING = 'utf8';
const args = process.argv.slice(2);

if (args.length != 2 || args[0] == args[1]) {
  console.error('Arguments: src_file dst_file');
  process.exit(1);
}

fs.readFile(args[0], ENCODING, (err, data) => {
  if (err) return console.error(err);
  let lines = data.split('\n');
  let db = {servants: []};

  for (line of lines) {
    let fields = line.split('\\');
    let servant = {};

    for (let i = 0; i < FIELDS.length; i++) {
      if (!fields[i]) servant[FIELDS[i]] = null;
      else if (!FIELDS[i].endsWith('s')) servant[FIELDS[i]] = fields[i];
      else if (fields[i].includes(';')) servant[FIELDS[i]] = fields[i].split(/ *; */);
      else if (fields[i].includes(',')) servant[FIELDS[i]] = fields[i].split(/ *, */);
      else servant[FIELDS[i]] = fields[i];
    }

    if (!servant.id) continue;
    db.servants.push(servant);
  }

  fs.writeFile(
    args[1],
    JSON.stringify(db, null, 2),
    ENCODING,
    err => err ? console.error(err) : null
  );
});
