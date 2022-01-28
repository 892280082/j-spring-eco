const {SpringBoot} = require("./Spring")

const boot = new SpringBoot({
	rootPath:__dirname,
	dirList:["src"],
})


boot.run();