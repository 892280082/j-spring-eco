const {SpringBoot} = require("./Spring")

const boot = new SpringBoot({
	dirList:["src"],
})


boot.run();