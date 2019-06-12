const app = angular.module('mooncell', []);

app.service('automaton', class {
  constructor($http) {
    this.http = $http;
    this.Adapter = class {
      constructor(src) { this.source = src; }
      read() { return this.source; }
      write() {}
    };
  }

  async getAdapter() {
    return this.http
      .get('json/akasha.json')
      .then(res => new this.Adapter(res.data));
  }

  async validatePath(path) {
    return this.http
      .get(path)
      .then(() => true)
      .catch(() => false);
  }
});

app.directive('mcSkill', $timeout => {
  return {
    restrict: 'A',
    link: (scope, element) => $timeout(() => {
      $(element).popover();
    }, 0)
  };
});

app.controller('mooncellCtrl', async ($scope, $window, automaton) => {
  const seraph = new $window.Seraph(await automaton.getAdapter());
  const sheba = new $window.Sheba('img/');
  const escape = s => $('<div>').text(s).html();
  const appendSummaryHTML = o => {
    o.summary = o.effects.map(escape).join('<br>');
  };

  $scope.search = query => {
    if (!query) return;
    const svt = seraph.search(query);
    if (!svt || !svt.id) return;

    $scope.imgPaths = [null, null, null, null, null, null, null, null, null];
    for (let asc = 0; asc < $scope.imgPaths.length; asc++) {
      let path = sheba.getImgPath(svt.id, asc.toString());
      automaton.validatePath(path)
        .then(valid => !valid ? null : ($scope.imgPaths[asc] = path))
        .then(() => $scope.$apply());
    }

    $scope.svt = svt;

    $scope.actives = seraph.findActivesBySvtId(svt.id);
    $scope.actives.forEach(appendSummaryHTML);

    $scope.passives = seraph.findPassivesBySvtId(svt.id);
    $scope.passives.forEach(appendSummaryHTML);

    $scope.np = seraph.findNoblePhantasmById(svt.id);
    appendSummaryHTML($scope.np);
  };

  $scope.search('BB');
  return $scope.$apply();
});
