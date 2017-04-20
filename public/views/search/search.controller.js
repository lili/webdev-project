(function()
{
    angular
        .module("PassportApp")
        .controller('SearchCtrl', SearchCtrl);

    function SearchCtrl($scope, TeamService, UserService)
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

                for (var i = 0; i < teams.length; i++) {
                    var team = teams[i];
                    var coachId = team['coach'];
                    UserService.findUserById(coachId).then(function(coach) {
                        coach = coach.data;

                        var coachName = coach['username'];
                        var coachId = coach['_id'];
                        var teamName = team['name'];
                        var teamId = team['_id'];

                        var teamInfo = {coach: coachName, coachId: coachId, name: teamName, teamId: teamId, comp: []};

                        vm.foundTeams.push(teamInfo);

                    });

                };
            });
        }
    }
})();