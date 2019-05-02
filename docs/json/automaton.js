/**
* Akashic Records (False): Automaton
*/
const fs = require('fs');
const d3 = require('d3-dsv');

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
const DELIM = '\\';
const ARGS = process.argv.slice(2);
const dsv = d3.dsvFormat(DELIM);
let db = {};

if (ARGS.length != 2) {
  console.error('Arguments: src_file dst_file');
  process.exit(1);
}

db.servants = dsv.parse(
  FIELDS.join(DELIM) + '\n' + fs.readFileSync(ARGS[0], {encoding: ENCODING}),
  svt => {
    for (let field of FIELDS) {
      svt[field] = svt[field].trim();
      if (field.endsWith('s')) {
        if (svt[field].includes(';')) svt[field] = svt[field].split(/ *; */);
        else svt[field] = svt[field].split(/ *, */);
      }
    }
    return svt;
  }
);

fs.writeFileSync(ARGS[1], JSON.stringify(db, null, 2), {encoding: ENCODING});
