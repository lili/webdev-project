(function(){
    angular
        .module("PassportApp")
        .factory("HeroService", HeroService);

    //Integrates the Open Overwatch API for hero information
    function HeroService($http) {
        var api_url = "https://overwatch-api.net/api/v1/";

        var api = {
            findAllHeroes: findAllHeroes,
            findHeroByName: findHeroByName,
            findHeroById: findHeroById,
            findHeroesByRole: findHeroesByRole
        };
        return api;

        function findAllHeroes() {
            var url = api_url + "hero";
            return $http.get(url);
        }

        function findHeroByName(heroName) {
            var heroes = findAllHeroes();
            heroes.filter( function(hero) {
                return hero['name'].localeCompare(heroName);
            });
        }

        function findHeroById(heroId) {
            var url = api_url + "hero/" + heroId;
            return $http.get(url);
        }

        function findHeroesByRole(role) {
            var heroes = findAllHeroes();
            heroes.filter( function(hero) {
                return hero['role']['name'].localeCompare(heroRole);
            });
        }
    }
})();