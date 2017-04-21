var mongoose = require("mongoose");
const util = require('util')

module.exports = function() {

    var TeamSchema = new mongoose.Schema(
        {
            name: String,
            description: String,
            coach: {type: mongoose.Schema.Types.ObjectId, ref:"UserModel"},
            comp: [{
                hero: String,
                player: {type: mongoose.Schema.Types.ObjectId, ref:"UserModel"}
            }]
        }, {collection: "team"});

    var TeamModel = mongoose.model('TeamModel', TeamSchema);
    var UserModel = mongoose.model('UserModel');

    var api = {
        createTeam: createTeam,
        updateTeam: updateTeam,
        removeTeam: removeTeam,
        findAllTeams: findAllTeams,
        findTeamsByCoach: findTeamsByCoach,
        findTeamsByPlayer: findTeamsByPlayer,
        findTeamsByHero: findTeamsByHero,
        findTeamsByName: findTeamsByName,
        findTeamById: findTeamById,
        getMongooseModel: getMongooseModel
    };
    return api;

    function updateTeam(teamId, team) {
            return TeamModel.update({_id: teamId}, {$set: team});
        }

    function removeTeam(teamId) {
        return TeamModel.remove({_id: teamId});
    }

    function findAllTeams() {
        return TeamModel.find();
    }

    function createTeam(team) {
        return TeamModel.create(team);
    }

    function findTeamsByCoach(coach_id) {
        return UserModel.findById(coach_id).then(function(coach) {
            return TeamModel.find({coach: coach._id});
        });
    }

    function findTeamsByPlayer(playerName) {
        return UserModel.findOne({username: playerName}).then(function(player) {
            return TeamModel.find({ "comp.player": player._id });
        });
    }

    function findTeamsByHero(heroName) {
        return TeamModel.find({ "comp.hero": heroName });
    }

    function findTeamsByName(teamName) {
        return TeamModel.find({ name: teamName });
    }

    function findTeamById(teamId) {
        return TeamModel.findById(teamId);
    }

    function getMongooseModel() {
        return TeamModel;
    }
};