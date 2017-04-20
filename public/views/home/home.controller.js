(function()
{
    angular
        .module("PassportApp")
        .controller("HomeController", HomeController);

    function HomeController($rootScope, TeamService, UserService)
    {
      var vm = this;
      vm.findPlayerNameById = findPlayerNameById;

      if ($rootScope.currentUser) {
        vm.teams = [];
        var coach = $rootScope.currentUser._id;

        TeamService.findTeamsByCoach(coach).then(function(userTeams) {
          userTeams = userTeams.data;

          for (var i = 0; i < userTeams.length; i++) {
            var id = userTeams[i]["_id"];
            findTeamById(id);
          }
        });
      }

      function init() {
      }
      init();

      function findTeamById(teamId) {

        TeamService
          .findTeamById(teamId)
          .then(
                  function(response) {
                      var foundTeam = response.data;
                      foundTeam['players'] = findPlayersByTeam(foundTeam);

                      for (var i = 0; i < foundTeam['players'].length; i++) {
                        var player = foundTeam['players'][i];

                        findPlayerNameById(player['player']).then(function(playerName) {
                          playerName = playerName.data;
                          player['player'] = playerName;
                        })
                      }

                      vm.teams.push(foundTeam);
                  },
                  function(err) {
                      vm.error = err;
                  }
                );
      }

      function findPlayerNameById(playerId) {
        return UserService.findUserById(playerId);
      }

      function findPlayersByTeam(team) {
        var players = [];
        var members = team['comp'];
        var playerInfo = [];

        for (var i = 0; i < members.length; i++) {
          playerInfo[i] = {};
          var player = members[i]['player'];
          var hero = members[i]['hero'];
          playerInfo[i]['player'] = player;
          playerInfo[i]['hero'] = hero;


        }

        return playerInfo;
      }
    }
})();