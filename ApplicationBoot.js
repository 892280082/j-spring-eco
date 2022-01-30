const {SpringBoot} = require("./Spring")

//正式使用的时候 删除packageName属性
new SpringBoot({dirList:["./app"],packageName:"./spring"}).run();