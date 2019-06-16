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
      .head(path)
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

    $scope.imgPaths = ['1', '2', '3', '4'].map(asc => sheba.getImgPath(svt.id, asc));
    $scope.imgPaths = $scope.imgPaths.concat(Array(5).fill(null));
    for (let i = 4; i < $scope.imgPaths.length; i++) {
      let path = sheba.getImgPath(svt.id, (i + 1).toString());
      automaton.validatePath(path)
        .then(valid => {
          if (valid) $scope.$apply(() => { $scope.imgPaths[i] = path; });
        });
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
