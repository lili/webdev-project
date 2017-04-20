
module.exports = function(app) {

    var userService = require("./services/user/user.service.server.js")(app);
    var teamService = require("./services/team/team.service.server.js")(app);
};