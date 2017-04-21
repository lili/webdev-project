(function()
{
    angular
        .module("PassportApp")
        .controller("HomeController", HomeController);

    function HomeController($rootScope, $q, TeamService, UserService)
    {
      var vm = this;
      vm.findPlayerNameById = findPlayerNameById;

      function init() {
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
      }
      init();

      function findTeamById(teamId) {
        TeamService
          .findTeamById(teamId)
          .then(function(response) {
              var foundTeam = response.data;
              foundTeam['players'] = findPlayersByTeam(foundTeam);

              var playerPromises = [];
              var playerNames = [];
              for (var i = 0; i < foundTeam['players'].length; i++) {
                var player = foundTeam['players'][i];
                var playerId = player['player'];
                playerPromises.push(findPlayerNameById(playerId).then(function(data) {
                  playerNames.push(data);
                }));
                playerPromises.push(player['player']);
              }

              $q.all(playerPromises).then(function() {
                for (var j = 0; j < playerNames.length; j++) {
                  foundTeam['players'][j]['player'] = playerNames[j];
                }
                vm.teams.push(foundTeam);
              });
              //console.log("PN: " + playerNames);

              //vm.teams.push(foundTeam);
          },
          function(err) {
              vm.error = err;
          }
        );
      }

      function findPlayerNameById(playerId) {
        return UserService.findUserById(playerId).then(function(playerName) {
          playerName = playerName.data;
          return playerName['username'];
        });
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