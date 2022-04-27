const {SpringBoot} = require("./Spring")


/** 支持修改的参数
args = {
	rootPath:"", //项目根路径
	srcList:[],  //源码目录集合
	moduleList:[], //加载第三方模块 例如 moduleList:[SpringMvc] 这样就可以直接引用springMvc里面的包了
	tempJsName:".runtemp.js", //生成临时文件名称
	resourceDir:"resource", //指定配置文件加载目录 相对和绝对均可。
	logPackageName:"",//日志包
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
new SpringBoot({
	srcList:["./app"],
	packageName:"./spring",
	logPackageName:"./spring"}).run();


/**
	1.同样也支持手动启动,先用node生成.runtemp.js临时运行文件
	new SpringBoot({srcList:["./app"]});
	
	2.手动启动
	shell: node .runtemp.js
*/
