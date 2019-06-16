const fs = require('fs');
const FileSync = require('lowdb/adapters/FileSync');
const Seraph = require('./services/seraph.js');
const Fate = require('./services/fate.js');
const Sheba = require('./services/sheba.js');

const seraph = new Seraph(new FileSync('docs/json/akasha.json'));
const fate = new Fate(seraph);
const sheba = new Sheba('docs/img/');

module.exports.summon = fate.summon.bind(fate);

module.exports.search = seraph.search.bind(seraph);

module.exports.getDetails = id => {
  const svt = seraph.findById(id);
  if (!svt) {
    return svt;
  }

  const details = JSON.parse(JSON.stringify(svt));
  details.actives = seraph.findActivesBySvtId(id);
  details.passives = seraph.findPassivesBySvtId(id);
  details.np = seraph.findNoblePhantasmById(id);

  details.splashes = [];
  try {
    for (let asc = 1; asc <= Number.MAX_SAFE_INTEGER; asc++) {
      const path = sheba.getImgPath(id, asc.toString());
      fs.statSync(path).isFile();
      details.splashes.push(path);
    }
  } catch (error) {}

  return details;
};
