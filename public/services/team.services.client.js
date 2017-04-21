(function(){
    angular
        .module("PassportApp")
        .factory("TeamService", TeamService);

    function TeamService($http) {
        var api = {
            findAllTeams: findAllTeams,
            removeTeam: removeTeam,
            updateTeam: updateTeam,
            findTeamsByCoach: findTeamsByCoach,
            findTeamById: findTeamById,
            findTeamsByHero: findTeamsByHero,
            findTeamsByPlayer: findTeamsByPlayer,
            findTeamsByName: findTeamsByName,
            createTeam: createTeam
        };
        return api;

        function createTeam(coachId, team) {
            return $http.post('/api/'+ coachId + '/team', team);
        }

        function updateTeam(userId, teamId, team) {
            console.log("updating team: " + team);
            return $http.put('/api/' + userId + '/team/'+ teamId + '/update', team);
        }

        function removeTeam(userId, teamId) {
            return $http.delete('/api/' + userId + '/team/'+ teamId);
        }

        function findAllTeams() {
            return $http.get("/api/team");
        }

        function findTeamById(teamId) {
            var url = "/api/team/" + teamId;
            return $http.get(url);
        }

        function findTeamsByCoach(coachId) {
            var url = "/api/"+ coachId + "/team/all";
            return $http.get(url);
        }

        function findTeamsByHero(heroName) {
            return $http.get("/api/team/search/hero/" + heroName);
        }

        function findTeamsByPlayer(playerName) {
            return $http.get("/api/team/search/player/" + playerName);
        }

        function findTeamsByName(teamName) {
            return $http.get("/api/team/search/name/" + teamName);
        }
    }
})();