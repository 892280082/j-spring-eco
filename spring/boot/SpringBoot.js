const { sacnnerArgs } = require("../scaner/scaner");
const {File} = require("../util/File")
const path = require('path');
const { spawn } = require('child_process');

class SpringBoot {

	//临时文件
	tempRunFile;

	//配置系统默认注解
	annotationArgs = {
		valueInject:"Value",
		appBoot:"SpringBoot",
		beanInject:"Autowired",
		springFactory:"SpringFactory",
		springResource:"SpringResource",
		proxy:"Proxy",
		logInject:"log"
	}

	//支持修改的参数
	args = {
		pattern:'node',//生成脚本的运行模式 node和shell
		rootPath:"", //项目根路径
		srcList:["./app"],  //源码目录集合
		moduleList:[],
		tempJsName:".runtemp.js", //生成临时文件名称
		configPaths:['./resource/app-dev.yaml'], //资源目录名称
		inputArgs:[], //用户参数 默认在命令行获取
		packageName:'j-spring', //无需改动!
		logPackageName:'j-spring',
		annotation:{ //配置系统默认注解
			valueInject:"Value",
			appBoot:"SpringBoot",
			beanInject:"Autowired",
			springFactory:"SpringFactory",
			springResource:"SpringResource",
			proxy:"Proxy",
			logInject:"log"
		}
	}

	constructor(userArgs){

		userArgs.annotation = {...this.annotationArgs,...(userArgs.annotation || {})}

		this.args = {...this.args,...userArgs}

		//1.默认使用启动文件目录作为根目录
		if(!this.args.rootPath)
			this.args.rootPath = new File(process.argv[1]).getParent().fsPath;

		//2.格式化第三方模块包
		this.formartModuleList();

		const {rootPath,srcList,configPaths} = this.args;

		if(srcList.length==0){
			throw 'srcList must be exist!'
		}

		this.args.inputArgs = process.argv.slice(2);
		this.args.srcList = srcList.map(v => v.indexOf(".") === 0 ? path.join(rootPath,v) : v)
		this.args.configPaths = configPaths.map(v => v.indexOf(".") === 0 ? path.join(rootPath,v) : v)

		//开始部署
		//this.deploy()
	}

	formartModuleList(){
		const moduleList = [];
		this.args.moduleList.forEach(v => {
			const rs =  typeof v === 'function' ? v() : v;
			if(!Array.isArray(rs)){
				throw `模块加载器必须返回数组`
			}
			rs.forEach(r => {
				if(!r.packageName || !r.srcList){
					throw `模块装载格式错误:${v},扩展模块数据格式:[{packageName:String,srcList:[String]}]`
				}
				moduleList.push(r);
			})
		});
		this.args.moduleList = moduleList;
	}

	build(addArgs = {}){

		this.args = {...this.args,...addArgs}

		const {pattern,rootPath,tempJsName,inputArgs,packageName,moduleList,logPackageName} = this.args;

		const beanDefinList  = sacnnerArgs(this.args)

		if(beanDefinList.length == 0)
			throw 'no beanDefine be found!'

		this.tempRunFile = new File(path.join(rootPath,tempJsName));

		//运行模式
		const patternLib = {"node":"","shell":"#!/usr/bin/env node \n"}[pattern];

		if(patternLib === undefined){
			throw 'pattern argument error! options:[node,shell]'
		}

		const springlib = `const {SpringFactory} = require("${packageName}");\n`+
						  `/** generate lib */\n`;

		const springlog = `const {SpringLog} = require("${logPackageName}");\n`+
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


		const argsParam = `const args = JSON.parse(\`${ JSON.stringify(this.args).replace(/\\\\/g,"//") }\`); \n args.SpringLog = SpringLog;\n`



		const run = `new SpringFactory(args,classReferences).boot();\n`;

		this.tempRunFile.setContent(patternLib+springlib+springlog+headLib+classReferences+argsParam+run).write();

		return this;
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

	start(){
		this.build().run();
	}
}


module.exports = {SpringBoot}
