(function()
{
    angular
        .module("PassportApp")
        .controller('SearchCtrl', SearchCtrl);

    function SearchCtrl($scope, $q, TeamService, UserService)
    {
        var vm = this;
        vm.searchTeams = searchTeams;

        function searchTeams(searchType, query) {
            vm.foundTeams = [];
            var searchFunction;
            switch(searchType) {
                case "Player":
                    searchFunction = TeamService.findTeamsByPlayer(query);
                    break;
                case "Hero":
                    searchFunction = TeamService.findTeamsByHero(query);
                    break;
                default:
                    searchFunction = TeamService.findTeamsByName(query);
            }

            searchFunction.then(function(teams) {
                teams = teams.data;
                coachPromises = [];
                coachNames = [];
                coachIds = [];

                for (var i = 0; i < teams.length; i++) {
                    var team = teams[i];
                    var coachId = team['coach'];
                    coachPromises.push(UserService.findUserById(coachId).then(function(coach) {
                        coach = coach.data;
                        coachNames.push(coach.username);
                        coachIds.push(coach.id);
                    }));
                }

                $q.all(coachPromises).then(function() {
                    for (var j = 0; j < teams.length; j++) {
                        var coachName = coachNames[j];
                        var coachId = coachIds[j];
                        var teamName = teams[j]['name'];
                        var teamId = teams[j]['_id'];
                        var teamDescription = teams[j]['description'];

                        var teamInfo = {coach: coachName, coachId: coachId, name: teamName, teamId: teamId, description: teamDescription};

                        vm.foundTeams.push(teamInfo);
                    }
                });
            });
        }
    }
})();