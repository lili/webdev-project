var mongoose = require("mongoose");

module.exports = function(app) {

    var TeamModel = require("../../models/team/team.model.server.js")();

    var auth = authorized;
    app.post  ('/api/:userId/team',     auth, createTeam);
    app.get   ('/api/team',     auth, findAllTeams);
    app.get   ('/api/team/:teamId',     auth, findTeamById);
    app.get   ('/api/:userId/team/all',     auth, findTeamsByCoach);
    app.get   ('/api/team/search/player/:playerName',     auth, findTeamsByPlayer);
    app.get   ('/api/team/search/hero/:heroName',     auth, findTeamsByHero);
    app.get   ('/api/team/search/name/:teamName',     auth, findTeamsByName);
    app.put   ('/api/:userId/team/:teamId/update', auth, updateTeam);
    app.delete('/api/:userId/team/:teamId', auth, removeTeam);


    function findAllTeams(req, res) {
        TeamModel
            .findAllTeams()
            .then(
                function (teams) {
                    res.json(teams);
                },
                function () {
                    res.status(400).send(err);
                }
            );
    }

    function findTeamById(req, res) {
        var teamId = req.params['teamId'];
        TeamModel
            .findTeamById(teamId)
            .then(
                function(team) {
                    res.json(team);
                }
            );
    }

    function findTeamsByCoach(req, res) {
        var coachId = req.params['userId'];
        TeamModel
            .findTeamsByCoach(coachId)
            .then(
                function(teams) {
                    res.json(teams);
                },
                function () {
                    res.status(400).send(err);
                }
            );
    }

    function findTeamsByPlayer(req, res) {
        var playerName = req.params['playerName'];
        TeamModel
            .findTeamsByPlayer(playerName)
            .then(
                function(teams) {
                    res.json(teams);
                },
                function () {
                    res.status(400).send(err);
                }
            );
    }

    function findTeamsByHero(req, res) {
        var heroName = req.params['heroName'];
        TeamModel
            .findTeamsByHero(heroName)
            .then(
                function(teams) {
                    res.json(teams);
                },
                function () {
                    res.status(400).send(err);
                }
            );
    }

    function findTeamsByName(req, res) {
        var teamName = req.params['teamName'];
        TeamModel
            .findTeamsByName(teamName)
            .then(
                function(teams) {
                    res.json(teams);
                },
                function () {
                    res.status(400).send(err);
                }
            );
    }

    function removeTeam(req, res) {
        if(isCoach(req.user)) {
            var teamId = req.params['teamId'];
            TeamModel
              .removeTeam(teamId)
              .then(
                  function(status){
                      res.sendStatus(200);
                  },
                  function(error){
                      res.sendStatus(400).send(error);

                  }
              );
        } else {
            res.status(403);
        }
    }

    function updateTeam(req, res) {
        var newTeam = req.body;
        var teamId = req.params['teamId'];

        console.log("Team: " + newTeam)
        console.log("Team ID: " + teamId)

        TeamModel
            .updateTeam(teamId, newTeam)
            .then(
                function(team){
                    return teamModel.findAllTeams();
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(teams){
                    res.json(teams);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function createTeam(req, res) {
        var newTeam = req.body;

        var coachId = req.params['userId'];
        var team = req.body;

        team['coach'] = coachId;

        TeamModel
            .createTeam(team)
            .then(
                function(team) {
                    res.json(team);
                }
            );
    }

    function isCoach(user) {
        if(user.roles.indexOf("coach") > 0) {
            return true;
        }
        return false;
    }

    function authorized(req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }
};