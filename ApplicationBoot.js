const {SpringBoot} = require("./Spring")

//正式使用的时候 删除packageName属性
new SpringBoot({srcList:["./app"],packageName:"./spring"}).run();


/**
	1.同样也支持手动启动,先用node生成.runtemp.js临时运行文件
	new SpringBoot({srcList:["./app"]});
	
	2.手动启动
	shell: node .runtemp.js
*/
