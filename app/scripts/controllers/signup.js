'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('SignupCtrl', ['$scope', '$rootScope', '$mdSidenav', '$location', '$auth', '$http', 'FreeGeoIpFactory', function ($scope, $rootScope, $mdSidenav, $location, $auth, $http, FreeGeoIpFactory) {

  	$scope.user = {};
  	$scope.user.birthday = new Date("01/01/1990");

		$scope.maxDate = new Date();

  	$scope.signupFunction = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.userInfo = {};
          $rootScope.userInfo.name = response.data.name;
          $rootScope.userInfo.email = response.data.email;
          $location.path('/');
          console.log('You have successfully created a new account and have been signed-in', response);
        })
        .catch(function(response) {
          console.log(response.data.message);
        });
    };

    $scope.getGeolocation = function() {
      FreeGeoIpFactory.getGeolocation(function (geolocation){
        geolocation.$promise.then(function(geolocation) {

          console.log(geolocation);
          $scope.userCountry = $scope.completeCountries.find(function(country) {
          	return country.cca2 === geolocation.country_code;
          });
          $scope.user.country = $scope.userCountry.translations.fra.common;
          return geolocation;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };

    $scope.getGeolocation();

    $scope.occupations = ["agriculteurs",
                   "artisan - commerçant - chef d\'entreprise",
                   "autre",
                   "cadre",
                   "employé",
                   "étudiant",
                   "ouvrier",
                   "profession intermédiaire",
                   "retraité"];
    
  	$scope.countries = ["Afghanistan",
												"Afrique du Sud",
												"Ahvenanmaa",
												"Albanie",
												"Algérie",
												"Allemagne",
												"Andorre",
												"Angola",
												"Anguilla",
												"Antarctique",
												"Antigua-et-Barbuda",
												"Arabie Saoudite",
												"Argentine",
												"Arménie",
												"Aruba",
												"Australie",
												"Autriche",
												"Azerbaïdjan",
												"Bahamas",
												"Bahreïn",
												"Bangladesh",
												"Barbade",
												"Belgique",
												"Belize",
												"Bermudes",
												"Bhoutan",
												"Birmanie",
												"Biélorussie",
												"Bolivie",
												"Bosnie-Herzégovine",
												"Botswana",
												"Brunei",
												"Brésil",
												"Bulgarie",
												"Burkina Faso",
												"Burundi",
												"Bénin",
												"Cambodge",
												"Cameroun",
												"Canada",
												"Chili",
												"Chine",
												"Chypre",
												"Cité du Vatican",
												"Colombie",
												"Comores",
												"Congo",
												"Congo (Rép. dém.)",
												"Corée du Nord",
												"Corée du Sud",
												"Costa Rica",
												"Croatie",
												"Cuba",
												"Curaçao",
												"Côte d'Ivoire",
												"Danemark",
												"Djibouti",
												"Dominique",
												"Espagne",
												"Estonie",
												"Fidji",
												"Finlande",
												"France",
												"Gabon",
												"Gambie",
												"Ghana",
												"Gibraltar",
												"Grenade",
												"Groenland",
												"Grèce",
												"Guadeloupe",
												"Guam",
												"Guatemala",
												"Guernesey",
												"Guinée",
												"Guinée équatoriale",
												"Guinée-Bissau",
												"Guyana",
												"Guyane",
												"Géorgie",
												"Géorgie du Sud-et-les Îles Sandwich du Sud",
												"Haïti",
												"Honduras",
												"Hong Kong",
												"Hongrie",
												"Inde",
												"Indonésie",
												"Irak",
												"Iran",
												"Irlande",
												"Islande",
												"Israël",
												"Italie",
												"Jamaïque",
												"Japon",
												"Jersey",
												"Jordanie",
												"Kazakhstan",
												"Kenya",
												"Kirghizistan",
												"Kiribati",
												"Kosovo",
												"Koweït",
												"Laos",
												"Lesotho",
												"Lettonie",
												"Liban",
												"Liberia",
												"Libye",
												"Liechtenstein",
												"Lituanie",
												"Luxembourg",
												"Macao",
												"Macédoine",
												"Madagascar",
												"Malaisie",
												"Malawi",
												"Maldives",
												"Mali",
												"Malte",
												"Maroc",
												"Martinique",
												"Mauritanie",
												"Mayotte",
												"Mexique",
												"Micronésie",
												"Moldavie",
												"Monaco",
												"Mongolie",
												"Montserrat",
												"Monténégro",
												"Mozambique",
												"Namibie",
												"Nauru",
												"Nicaragua",
												"Niger",
												"Nigéria",
												"Niue",
												"Norvège",
												"Nouvelle-Calédonie",
												"Nouvelle-Zélande",
												"Népal",
												"Oman",
												"Ouganda",
												"Ouzbékistan",
												"Pakistan",
												"Palaos (Palau)",
												"Palestine",
												"Panama",
												"Papouasie-Nouvelle-Guinée",
												"Paraguay",
												"Pays-Bas",
												"Philippines",
												"Pologne",
												"Polynésie française",
												"Porto Rico",
												"Portugal",
												"Pérou",
												"Qatar",
												"Roumanie",
												"Royaume-Uni",
												"Russie",
												"Rwanda",
												"République centrafricaine",
												"République dominicaine",
												"Réunion",
												"Sahara Occidental",
												"Saint-Barthélemy",
												"Saint-Christophe-et-Niévès",
												"Saint-Marin",
												"Saint-Martin",
												"Saint-Pierre-et-Miquelon",
												"Saint-Vincent-et-les-Grenadines",
												"Sainte-Lucie",
												"Salvador",
												"Samoa",
												"Samoa américaines",
												"Serbie",
												"Seychelles",
												"Sierra Leone",
												"Singapour",
												"Slovaquie",
												"Slovénie",
												"Somalie",
												"Soudan",
												"Soudan du Sud",
												"Sri Lanka",
												"Suisse",
												"Surinam",
												"Suède",
												"Svalbard et Jan Mayen",
												"Swaziland",
												"Syrie",
												"São Tomé et Príncipe",
												"Sénégal",
												"Tadjikistan",
												"Tanzanie",
												"Taïwan",
												"Tchad",
												"Tchéquie",
												"Terres australes et antarctiques françaises",
												"Territoire britannique de l'océan Indien",
												"Thaïlande",
												"Timor oriental",
												"Togo",
												"Tokelau",
												"Tonga",
												"Trinité-et-Tobago",
												"Tunisie",
												"Turkménistan",
												"Turquie",
												"Tuvalu",
												"Ukraine",
												"Uruguay",
												"Vanuatu",
												"Venezuela",
												"Viêt Nam",
												"Wallis-et-Futuna",
												"Yémen",
												"Zambie",
												"Zimbabwe",
												"Égypte",
												"Émirats arabes unis",
												"Équateur",
												"Érythrée",
												"États-Unis",
												"Éthiopie",
												"Île Bouvet",
												"Île Christmas",
												"Île Maurice",
												"Île Norfolk",
												"Île de Man",
												"Îles Caïmans",
												"Îles Cocos",
												"Îles Cook",
												"Îles Féroé",
												"Îles Heard-et-MacDonald",
												"Îles Malouines",
												"Îles Mariannes du Nord",
												"Îles Marshall",
												"Îles Pitcairn",
												"Îles Salomon",
												"Îles Turques-et-Caïques",
												"Îles Vierges britanniques",
												"Îles Vierges des États-Unis",
												"Îles du Cap-Vert",
												"Îles mineures éloignées des États-Unis"];

  	// $scope.signUp = function () {
	  //   $auth
	  //     .signup({email: $scope.email, password: $scope.password})
	  //     .then(function (response) {
	  //       $auth.setToken(response);
	  //       $state.go('secret');
	  //     })
	  //     .catch(function (response) {
	  //       console.log("error ", response);
	  //     });
	  // };

	  // $scope.login = function () {
	  //   $auth
	  //     .login({email: $scope.email, password: $scope.password})
	  //     .then(function (response) {
	  //       $auth.setToken(response);
	  //       $state.go('secret');
	  //     })
	  //     .catch(function (response) {
	  //       toastr.error(
	  //         'Email or password not correct!',
	  //         {closeButton: true}
	  //       );
	  //     });
	  // };

	  // $scope.auth = function (provider) {
	  //   $auth.authenticate(provider)
	  //     .then(function (response) {
	  //       console.debug("success", response);
	  //       $state.go('secret');
	  //     })
	  //     .catch(function (response) {
	  //       console.debug("catch", response);
	  //     });
	  // };

  }]);
