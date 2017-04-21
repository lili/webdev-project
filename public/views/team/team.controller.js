(function()
{
    angular
        .module("PassportApp")
        .controller("TeamCtrl", TeamCtrl)
        .controller("ModalController", ModalController);

    function TeamCtrl($routeParams, $scope, $window, $location, TeamService, ModalService, UserService, HeroService)
    {
      var vm = this;
      vm.coachId = $routeParams.userId;
      vm.teamId = $routeParams.teamId;

      vm.heroes = [];
      findAllHeroes($window);

      vm.findCoach = findCoach;
      vm.createTeam = createTeam;
      vm.updateTeam = updateTeam;
      vm.removeTeam = removeTeam;
      vm.openModal = openModal;
      vm.findTeam = findTeam;
      vm.viewDetailedTeam = viewDetailedTeam;
      vm.playerInfo = [];
      vm.numberOfPlayers = 0;
      vm.team_and_user_match = team_and_user_match(vm.coachId, vm.teamId);

      vm.team = vm.viewDetailedTeam(vm.teamId);

      function init() {
      }
      init();

      function team_and_user_match(userId, teamId) {
        findTeam(teamId).then(function(team) {
          team = team.data;
          var coachId = team.coach;

          return coachId == userId;
        });
      }

      function findCoach(coachId) {
        return UserService.findUserById(coachId);
      }

      function findPlayerByName(playerName) {
        return  UserService.findUserByUsername(playerName);
      }

      function findPlayerById(playerId) {
        return  UserService.findUserById(playerId);
      }

      function findTeam(teamId) {
        return  TeamService.findTeamById(teamId);
      }

      function createTeam(team) {
        team.comp = [];

        for (var i=0; i < vm.playerInfo.length; i++) {
          var playerObj = {};
          playerObj.player = vm.playerInfo[i]['player'];
          playerObj.hero = vm.playerInfo[i]['hero'];
          team.comp.push(playerObj);
        }

        var createQuery = TeamService.createTeam(vm.coachId, team);

        createQuery.then(function(newTeam) {
          newTeam = newTeam.data;

          findCoach(vm.coachId).then(function(coach) {
            coach = coach.data;
            coach.teams.push(newTeam);

            UserService.updateUser(vm.coachId, coach);
            $location.url("/home");
          });
        });
      }

      function updateTeam(teamId, team) {
        var coachId = vm.coachId;
        team.comp = vm.playerInfo;
        console.log("updating team (controller): " + team);
        var update = TeamService.updateTeam(coachId, teamId, team);

        update.then(function(team) {
          team = team.data;
          console.log(team);
          $location.url("/" + coachId + "/team/" + team);
        });
      }

      function removeTeam(teamId) {
        TeamService.removeTeam(vm.coachId, teamId).then(function(oldTeam) {
          oldTeam = oldTeam.data;

          findCoach(vm.coachId).then(function(coach) {
            coach = coach.data;
            var teamPosition = coach.teams.indexOf(oldTeam);
            coach.teams.splice(teamPosition);
            UserService.updateUser(vm.coachId, coach);
            $location.url("/home");
          });
        });
      }

      function openModal(playerPosition) {
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalController"
        }).then(function(modal) {
            document.body.removeChild(document.body.childNodes[2]);
            modal.element.modal();
            modal.close.then(function(result) {
                if (result.name && result.hero) {
                  findPlayerByName(result.name.toLowerCase()).then(function(foundPlayer) {
                    foundPlayer = foundPlayer.data;

                    vm.playerInfo.push({player: foundPlayer['_id'], hero: result.hero});

                    makeNewAddPlayer(foundPlayer, result);
                  });
                }
            });
        }).catch(function(error) {
          console.log("Modal error: " + error);
        });
      }

      function makeNewAddPlayer(foundPlayer, result) {
        var playDiv = $("<div>", {id: "playerDiv", class: "thumbnail col-xs-3 col-xs-offset-1"});
        var playDivInnerCaption = $("<div>", {id: "playerDivCaption", class: "caption"});
        var playerHero = "<h2>" + result.hero + "</h2>";
        var playerName = "<h3>" + foundPlayer['username'] + "</h3>";
        var deleteSpan = $("<span>", {id: "deletePlayer"});

        playDivInnerCaption.html(playerHero + playerName);
        playDiv.html(playDivInnerCaption);

        $('#addPlayers').append(playDiv);
        vm.numberOfPlayers += 1;

        if (vm.numberOfPlayers == 6) {
          $('#addPlayersButton').addClass('hidden');
        }
      }

      function viewDetailedTeam(teamId) {

        findTeam(teamId).then(function(foundTeam) {
              foundTeam = foundTeam.data;
              vm.team = foundTeam;
              vm.team.players = findPlayersByTeam(foundTeam);

              findCoach(vm.team['coach']).then(function(coach) {
                coach = coach.data;
                vm.team.coach_name = coach.username;

                for (var i = 0; i < vm.team.players.length; i++) {
                  var player = vm.team.players[i];

                  findPlayerNameById(player['player']).then(function(playerName) {
                    playerName = playerName.data;
                    player['player'] = playerName;
                  })
                }
              });
        });
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

      function findAllHeroes(wndw) {
        HeroService.findAllHeroes().then(function(heroes) {
          heroes = heroes.data.data;
          herolist = [];

          for (var i = 0; i < heroes.length; i++) {
              hero = heroes[i];
              var heroName = hero['name'];
              herolist.push(heroName);
          }

          wndw.sessionStorage.setItem("heroes", herolist);
        });
      }
    }


  function ModalController($scope, $window, close) {
    $scope.close = function(player) {
      close(player, 500); // close, but give 500ms for bootstrap to animate
    };

    $scope.heroes = $window.sessionStorage.getItem("heroes").split(",");
  }

})();