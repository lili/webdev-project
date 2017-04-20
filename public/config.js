(function() {
    angular.module("PassportApp")
        .config(function($routeProvider, $httpProvider) {
            $routeProvider
              .when('/home', {
                  templateUrl: 'views/home/home.view.html',
                  controller: 'HomeController',
                  controllerAs: 'model',
                  resolve: {
                      loggedin: checkCurrentUser
                  }
              })
              .when('/profile', {
                  templateUrl: 'views/profile/profile.view.html',
                  controller: 'ProfileCtrl',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/admin', {
                  templateUrl: 'views/admin/admin.view.html',
                  controller: 'AdminController',
                  resolve: {
                      loggedin: checkAdmin
                  }
              })
              .when('/login', {
                  templateUrl: 'views/login/login.view.html',
                  controller: 'LoginCtrl',
                  controllerAs: 'model'
              })
              .when('/register', {
                  templateUrl: 'views/register/register.view.html',
                  controller: 'RegisterCtrl',
                  controllerAs: 'model'
              })
              .when('/:userId/team/new', {
                  templateUrl: 'views/team/team-new.view.html',
                  controller: 'TeamCtrl',
                  controllerAs: 'model',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/:userId/team/:teamId', {
                  templateUrl: 'views/team/team-view.view.html',
                  controller: 'TeamCtrl',
                  controllerAs: 'model',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/:userId/team/:teamId/update', {
                  templateUrl: 'views/team/team-update.view.html',
                  controller: 'TeamCtrl',
                  controllerAs: 'model',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .when('/search', {
                  templateUrl: 'views/search/search.view.html',
                  controller: 'SearchCtrl',
                  controllerAs: 'model',
                  resolve: {
                      loggedin: checkLoggedin
                  }
              })
              .otherwise({
                  redirectTo: '/home'
              });
        });

    var checkAdmin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0' && user.roles.indexOf('admin') != -1)
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
        });

        return deferred.promise;
    };


    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            // User is Not Authenticated
            else
            {
                $rootScope.errorMessage = 'You need to log in.';
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };

    var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
            }
            deferred.resolve();
        });

        return deferred.promise;
    };


})();

