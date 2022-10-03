// const {SpringBoot} = require("j-spring")
// const {SpringIocMvcScaner} = require("j-spring-mvc")


// new SpringBoot({srcList:["./app"],moduleList:[SpringIocMvcScaner]}).run();

const {app} = require("./app")

app.start();