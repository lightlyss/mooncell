const path = require('path');
const getColors = require('get-image-colors');

/**
* Near-Future Observation Lens: SHEBA
*/
class Sheba {
  constructor(path) {
    this.path = path;
  }

  getImgName(id, ver = '4') {
    let imgId = id.replace('.', 'p');
    while (imgId.split('p')[0].length < 3) {
      imgId = '0' + imgId;
    }

    return `${imgId}${ver}.png`;
  }

  getImgPath(id, ver) {
    return path.join(this.path, 'servants', this.getImgName(id, ver));
  }

  async computeColor(id, ver) {
    const colors = await getColors(this.getImgPath(id, ver));
    return colors[0].hex();
  }
}

module.exports = Sheba;
