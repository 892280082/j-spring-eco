const {SpringBoot} = require("./Spring")


/** 支持修改的参数
args = {
	pattern:'node',//生成的脚本模式  有node和shell
	rootPath:"", //项目根路径
	srcList:[],  //源码目录集合
	moduleList:[], //加载第三方模块 例如 moduleList:[SpringMvc] 这样就可以直接引用springMvc里面的包了
	tempJsName:".runtemp.js", //生成临时文件名称
	configPaths:['./resource/app-dev.yaml'], //指定配置文件加载目录 相对和绝对均可。
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
const app = new SpringBoot({
	pattern:'shell',
	srcList:["./app"],
	packageName:"./spring",
	logPackageName:"./spring"
})

app.start();
