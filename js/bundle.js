(function(angular){
'use strict';
angular
  .module('root', [
    'common',
    'components',
    'templates',
    'spotify'
  ]);
})(window.angular);
(function(angular){
'use strict';
angular
  .module('components', [
    'components.contact',
    'components.search'
  ]);
})(window.angular);
(function(angular){
'use strict';
angular
  .module('common', [
    'ui.router'
  ]);
})(window.angular);
(function(angular){
'use strict';
angular
  .module('components.contact', [
    'ui.router'
  ]);
})(window.angular);
(function(angular){
'use strict';
angular
    .module('components.search', [
        'ui.router'
    ]);})(window.angular);
(function(angular){
'use strict';
var root = {
  templateUrl: './root.html',
  controller: 'RootController as parent'
};

angular
  .module('root')
  .component('root', root);
})(window.angular);
(function(angular){
'use strict';
function RootController($scope, $log, $http, Spotify){
    var ctrl = this;
    $scope.$log = $log;
    ctrl.searchLimit = {'limit': 6, 'offset': 0};
    ctrl.fetchedData = [];
    ctrl.albumsTotal = 0;
    ctrl.artistsTotal = 0;
    ctrl.searchQuery = '';
    ctrl.showModal = false;

    //this component will take search phrase and will get data from ajax
    $scope.$on('search', function(event, data){
        ctrl.searchLimit = {'limit': 6, 'offset': 0};
        ctrl.searchQuery = data;

        Spotify.search(data, 'artist,album', ctrl.searchLimit)
         .then(function (response) {

             ctrl.albumsTotal = response.data.albums.total;
             ctrl.artistsTotal = response.data.artists.total;



            ctrl.fetchedData = [...response.data.albums.items, ...response.data.artists.items];
        });

    });

    $scope.$on('showmemore', function(event, data){
        ctrl.searchLimit.offset += 6;

        Spotify.search(ctrl.searchQuery, 'artist,album', ctrl.searchLimit)
         .then(function (response) {
            ctrl.fetchedData = ctrl.fetchedData.concat([...response.data.albums.items, ...response.data.artists.items]);
        });

    });

    $scope.$on('viewitem', function(event, data){
        ctrl.showModal = true;

        if(data.type == 'album'){
            Spotify.getAlbum(data.id)
                .then(function (response) {

                    //$scope.$apply(function () {
                        ctrl.modalTitle = response.data.name;
                        ctrl.modalType = 'album';
                        ctrl.modalData = response.data.tracks.items;
                        ctrl.modalPicture = response.data.images[0];
                        $log.log(ctrl.modalTitle);
                    //});
                });

        }else if(data.type == 'artist'){
            var fetchedArtist = Spotify.getArtist(data.id);

            var artistAlbums = Spotify.getArtistAlbums(data.id);

            Promise.all([fetchedArtist, artistAlbums]).then(values=>{
                $log.log(values);
                $scope.$apply(function () {
                    ctrl.modalTitle = values[0].data.name;
                    ctrl.modalType = 'artist';
                    ctrl.modalData = values[1].data.items;
                    ctrl.modalPicture = values[0].data.images[0];
                    $log.log(ctrl.modalTitle);
                });
            });

        }
    });
}

angular
    .module('root')
    .controller('RootController', ['$scope', '$log', '$http', 'Spotify', RootController]);
})(window.angular);
(function(angular){
'use strict';
var searchinput ={
    templateUrl: './searchinput.html',
    controller: 'SearchInputController',
    bindings: {
        st: '='
    }
};

angular
    .module('components.search')
    .component('searchinput', searchinput);
})(window.angular);
(function(angular){
'use strict';
function SearchInputController($scope, $log){
    var ctrl = this;
    $scope.$log = $log;
    $scope.$ctrl.onclick = function(e){
        $scope.$emit('search', ctrl.st);
    }
}

angular
    .module('components.search')
    .controller('SearchInputController', ['$scope', '$log', SearchInputController]);
})(window.angular);
(function(angular){
'use strict';
var searchitem ={
    templateUrl: './searchitem.html',
    controller: 'SearchItemController',
    transclude: {name:'h5'},
    bindings: {
        itemtype: '<',
        itemimgs: '<',
        itemid: '<'
    }
};

angular
    .module('components.search')
    .component('searchitem', searchitem);
})(window.angular);
(function(angular){
'use strict';
function SearchItemController($scope, $log){
    var ctrl = this;
    $scope.$log = $log;
}

angular
    .module('root')
    .controller('SearchItemController', ['$scope', '$log', SearchItemController]);
})(window.angular);
(function(angular){
'use strict';
var searchpopup ={
    templateUrl: './searchpopup.html',
    controller: 'SearchPopupController',
    bindings: {
        showmodal: '=',
        modaltitle: '<',
        modaltype: '<',
        modaldata: '<',
        modalpicture: '<'
    }
};

angular
    .module('components.search')
    .component('searchpopup', searchpopup);
})(window.angular);
(function(angular){
'use strict';
function SearchPopupController($scope, $log){
    var ctrl = this;
    $scope.$log = $log;
    ctrl.formatDate = function(ms_duration){
        var date = new Date();
        date.setTime(ms_duration);
        return date;//date.getMinutes() + ':' + date.getSeconds();
    }
}

angular
    .module('components.search')
    .controller('SearchPopupController', ['$scope', '$log', SearchPopupController]);
})(window.angular);
(function(angular){
'use strict';
var searchresults ={
    templateUrl: './searchresults.html',
    controller: 'SearchResultsController',
    bindings: {
        fetchedarr: '=',
        artiststotal: '=',
        albumstotal: '='
    }
};

angular
    .module('components.search')
    .component('searchresults', searchresults);
})(window.angular);
(function(angular){
'use strict';
function SearchResultsController($scope, $log){
    var ctrl = this;
    $scope.$log = $log;
    $log.log(this.artistsTotal);
    $log.log(this.albumsTotal);
    ctrl.showmemore = function(){
        $log.log('show me more');
        $scope.$emit('showmemore');
    }
}

angular
    .module('root')
    .controller('SearchResultsController', ['$scope', '$log', SearchResultsController]);
})(window.angular);
(function(angular){
'use strict';
const data = [
    {author: 'suzy', type: 'album', songs: [{name: 'а я девочек люблю'}, {name: 'золотые купола'}]},
    {type: 'artist', albums: [{name: 'водочку пьем, водочку льем'}, {name: 'земля в иллюминаторе'}]}
];})(window.angular);
(function(angular){
'use strict';
angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root"><nav><searchinput st="parent.searchText"></searchinput></nav><main><searchresults fetchedarr="parent.fetchedData" albumstotal="parent.albumsTotal" artiststotal="parent.artistsTotal"></searchresults><searchpopup showmodal="parent.showModal" modaltitle="parent.modalTitle" modaltype="parent.modalType" modaldata="parent.modalData" modalpicture="parent.modalPicture"></searchpopup></main></div>');
$templateCache.put('./searchinput.html','<div id="search-container"><input type="text" placeholder="Search for artist or album title" ng-model="$ctrl.st" ng-keypress="$event.which === 13 && $ctrl.onclick()"><div id="search-button" ng-click="$ctrl.onclick();"><span>SEARCH</span></div></div>');
$templateCache.put('./searchitem.html','<div class="searchitem {{$ctrl.itemtype}}"><div class="itempic cell A1"><div class="alBg" style="background-image:url(\'{{$ctrl.itemimgs[1][\'url\']}}\')"></div>f<div class="itempicContainer txt" ng-click="$emit(\'viewitem\', {type: $ctrl.itemtype, id: $ctrl.itemid});"><img ng-src="{{$ctrl.itemtype==\'album\'? \'/img/album-icon@2x.png\':\'/img/artist-icon@2x.png\'}}"> {{$ctrl.itemtype==\'album\'? \'View tracks\':\'View albums\'}}</div></div><div class="itemnamecontainer"><div class="itemname" ng-transclude="name"></div></div></div>');
$templateCache.put('./searchpopup.html','<div id="modal-container" ng-show="$ctrl.showmodal"><div id="modal-dimmed-part"></div><figure id="modal-data-container"><div class="firstRow" style="background-image: url(\'{{$ctrl.modalpicture.url}}\')"><img id="modalCross" class="modalCross" src="/img/Cross@2x.png" height="20" width="20" ng-click="$ctrl.showmodal = false"> <img id="modalCrossBlack" class="modalCross" src="/img/Cross Dark@2x.png" height="20" width="20" ng-click="$ctrl.showmodal = false"> <span id="albumTitle"><span class="trackson">{{$ctrl.modaltype == \'artist\'? \'Albums by\':\'Tracks on\'}}</span><br>{{$ctrl.modaltitle}}</span></div><div class="secondRow"><div id="captionContainer"><span>{{$ctrl.modaltype == \'artist\'? \'Albums\':\'Tracks\'}}</span></div><div id="albumRowsContainer"><div class="albumRow" ng-repeat="item in $ctrl.modaldata track by $index"><div ng-show="$ctrl.modaltype==\'artist\'" class="albumImgContainer" style="background-image:url(\'{{item.images[2].url}}\')"></div><div class="albumDataContainer"><div class="albumNameContainer">{{item.name}}</div><div class="albumYearContainer">{{$ctrl.modaltype == \'artist\'? \'-\':$ctrl.formatDate(item.duration_ms)|date:\'mm:ss\'}}</div></div></div></div></div></figure></div>');
$templateCache.put('./searchresults.html','<div id="willappear" ng-if="!$ctrl.fetchedarr.length"><div id="pusher"><img src="img/Magnify@2x.png"><br><span>Your results will appear here</span></div></div><searchitem itemtype="item.type" itemimgs="item.images" itemid="item.id" ng-repeat="item in $ctrl.fetchedarr track by $index"><h5>{{item.name}}</h5><img ng-src="{{item.images[1][\'url\']}}" width="263" height="263"></searchitem><div id="showmemore-button" ng-click="$ctrl.showmemore();" ng-show="!!$ctrl.fetchedarr.length && ($ctrl.fetchedarr.length<($ctrl.artiststotal + $ctrl.artiststotal))"><span>SHOW ME MORE</span></div>');}]);})(window.angular);
//# sourceMappingURL=bundle.js.map
