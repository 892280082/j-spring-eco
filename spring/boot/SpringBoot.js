const { sacnnerArgs } = require("../scaner/scaner");
const {File} = require("../util/File")
const path = require('path');
const { spawn } = require('child_process');

class SpringBoot {

	//临时文件
	tempRunFile;

	//支持修改的参数
	args = {
		rootPath:"", //项目根路径
		srcList:[],  //源码目录集合
		moduleList:[],
		tempJsName:".runtemp.js", //生成临时文件名称
		resourceDir:"resource", //资源目录名称
		inputArgs:[], //用户参数 默认在命令行获取
		packageName:'spring-ioc', //无需改动!
		annotation:{ //配置系统默认注解
			valueInject:"Value",
			appBoot:"SpringBoot",
			beanInject:"Autowired",
			springFactory:"SpringFactory",
			springResource:"SpringResource",
			proxy:"Proxy"
		}
	}

	constructor(userArgs){

		this.args = {...this.args,...userArgs}

		//1.默认使用启动文件目录作为根目录
		if(!this.args.rootPath)
			this.args.rootPath = new File(process.argv[1]).getParent().fsPath;

		//2.格式化第三方模块包
		this.args.moduleList = this.args.moduleList.map(v => typeof v === 'function' ? v() : v);

		const {rootPath,srcList,resourceDir} = this.args;

		if(srcList.length==0){
			throw 'srcList must be exist!'
		}

		this.args.inputArgs = process.argv.slice(2);
		this.args.srcList = srcList.map(v => v.indexOf(".") === 0 ? path.join(rootPath,v) : v)
		this.args.resourceDir = path.join(rootPath,resourceDir)

		//开始部署
		this.deploy()
	}

	deploy(){

		const {rootPath,tempJsName,inputArgs,packageName,moduleList} = this.args;

		const beanDefinList  = sacnnerArgs(this.args)

		if(beanDefinList.length == 0)
			throw 'no beanDefine be found!'

		this.tempRunFile = new File(path.join(rootPath,tempJsName));

		const springlib = `const {SpringFactory} = require("${packageName}");\n`+
						  `/** generate lib */\n`;

		const headLib = beanDefinList.map(beanDefine => {
			//如果是第三方包 则直接导入
			if(beanDefine.packageName){
				return `const {${beanDefine.className}} = require('${beanDefine.packageName}') \n`;
			}
			const referencePath = "."+beanDefine.fsPath.replace(rootPath,"").replace(/\\/g,"/");
			return `const { ${beanDefine.className} } = require('${referencePath}') \n`
		}).reduce( (s,v)=> s+v,"")

		const classReferences = 	`const classReferences = {};\n`+beanDefinList.map(beanDefine => {
			return `classReferences["${beanDefine.className}"] = ${beanDefine.className};\n`;
		}).reduce( (s,v)=> s+v,"")


		const argsParam = `const args = JSON.parse(\`${ JSON.stringify(this.args).replace(/\\\\/g,"//") }\`); \n`

		const run = `new SpringFactory(args,classReferences).boot();\n`;

		this.tempRunFile.setContent(springlib+headLib+classReferences+argsParam+run).write();


	}


	run(){

		const {tempRunFile} = this;

		const {inputArgs} = this.args;

		const ls = spawn(`node`,[ tempRunFile.fsPath, ...inputArgs] );

		const print = msg => console.log(msg.toString())

		console.log("********** Spring-Launch ************\n");

		ls.stdout.on('data', print);

		ls.stderr.on('data', print);

		ls.on('close', (code) => {
			console.log("********** Spring-Destroy ************\n");
		});

		ls.on('error', (code) => {
			console.log(`Spring Error::${code}`);
		});
	}

}


module.exports = {SpringBoot}