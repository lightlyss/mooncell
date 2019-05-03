const FileSync = require('lowdb/adapters/FileSync');
const Seraph = require('./services/seraph.js');
const Fate = require('./services/fate.js');
const Sheba = require('./services/sheba.js');

const seraph = new Seraph(new FileSync('docs/json/akasha.json'));
const fate = new Fate(seraph);
const sheba = new Sheba('docs/img/');

module.exports.summon = fate.summon.bind(fate);

module.exports.search = q => seraph.query(q.trim().split(/ +/));

module.exports.getDetails = id => {
  const details = JSON.parse(JSON.stringify(seraph.findById(id)));
  details.actives = details.actives
    .map(seraph.findActiveById.bind(seraph))
    .filter(a => a);
  details.passives = details.passives
    .map(seraph.findPassiveById.bind(seraph))
    .filter(p => p);
  details.np = seraph.findNoblePhantasmById(details.id);
  details.splashes = ['1', '2', '3', '4']
    .map(ver => sheba.getImgPath(details.id, ver));
  return details;
};
