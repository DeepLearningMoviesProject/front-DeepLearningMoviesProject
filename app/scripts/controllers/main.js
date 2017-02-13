'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('MainCtrl', ['$rootScope','$scope', function ($rootScope, $scope) {
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    /**
     * Whenever a Map only has strings as keys, you can convert it to JSON by encoding it as an object.
     * Converting a string Map to and from an object
     * @param  {[type]} strMap [description]
     * @return {[type]}        [description]
     */
    function strMapToObj(strMap) {
      var obj = Object.create(null);

      strMap.forEach(function (element, key) {
			  obj[key] = element;
			});

			// console.log(obj);
      return obj;
    }


    /**
     * Convert a JavaScript object with key as string to a Map
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    function objToStrMap(obj) {
      var strMap = new Map();

   		Object.keys(obj).forEach(function(key,index) {
    		strMap.set(key, obj[key]);
			});

      return strMap;
    }


    /**
     * Convert a map into a JSON object
     * @param  {[type]} strMap [description]
     * @return {[type]}        [description]
     */
    function strMapToJson(strMap) {
      return JSON.stringify(strMapToObj(strMap));
    }
    // function jsonToStrMap(jsonStr) {
    //   return objToStrMap(JSON.parse(jsonStr));
    // }


    /**
     * Upload a JSON file to import annotated movies
     * @return {[type]} [description]
     */
    $scope.uploadFiles = function() {
      var files = document.getElementById('preferences').files;
      console.log(files);
      if (files.length <= 0) {
        return false;
      }
      
      var fr = new FileReader();
      
      fr.onload = function(e) { 
        var result = JSON.parse(e.target.result);
        $rootScope.moviesEvaluation = objToStrMap(result);
        console.log($rootScope.moviesEvaluation);
      };
      
      fr.readAsText(files.item(0));
    };


    /**
     * Save a json file of a data
     * @param  {[type]}
     * @param  {[type]}
     * @return {[type]}
     */
    $scope.saveToPc = function (data, filename) {

      if (!data) {
        console.error('No data');
        return;
      }

      if (!filename) {
        filename = 'download.json';
      }

      // if (typeof data === 'object') {
      //   data = JSON.stringify(data, undefined, 2);
      // }

      data = strMapToJson(data);

      var blob = new Blob([data], {type: 'text/json'});

      // FOR IE:

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      }
      else{
        var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window,
          0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      }
    };

  }]);
