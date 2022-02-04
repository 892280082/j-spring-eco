const {SpringBoot} = require("./Spring")


/** 支持修改的参数
args = {
	rootPath:"", //项目根路径
	srcList:[],  //源码目录集合
	tempJsName:".runtemp.js", //生成临时文件名称
	resourceDir:"resource", //资源目录名称
	annotation:{ //配置系统默认注解
		valueInject:"Value",
		appBoot:"SpringBoot",
		beanInject:"Autowired",
		springFactory:"SpringFactory",
		springResource:"SpringResource",
		proxy:"Proxy"
	}
}
*/

//正式使用的时候 删除packageName属性
new SpringBoot({srcList:["./app"],packageName:"./spring"}).run();


/**
	1.同样也支持手动启动,先用node生成.runtemp.js临时运行文件
	new SpringBoot({srcList:["./app"]});
	
	2.手动启动
	shell: node .runtemp.js
*/