const {SpringBoot} = require("j-spring")
const {JSpringMvcScaner} = require("j-spring-mvc")
const {JSpringMvcSessionSqlite3Scaner} = require("j-spring-mvc-session-sqlite3")

const app = new SpringBoot({
	rootPath:__dirname,
	srcList:["./app"],
	moduleList:[JSpringMvcScaner,JSpringMvcSessionSqlite3Scaner]
});

module.exports = {app}
