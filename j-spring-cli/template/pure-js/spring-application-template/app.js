const {SpringBoot} = require("j-spring")


const app = new SpringBoot({
	rootPath:__dirname,
	srcList:["./app"]
});

module.exports = {app}