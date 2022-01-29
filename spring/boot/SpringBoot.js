const { scanerDirList } = require("../scaner/scaner");
const {File} = require("../util/File")
const path = require('path');
const { spawn } = require('child_process');

class SpringBoot {

	args = {
		rootPath:"",
		dirList:[],
		tempJsName:".runtemp.js",
		resourceDir:"resource",
		inputArgs:[],
		annotation:{
			valueInject:"Value",
			appBoot:"SpringBoot",
			beanInject:"Autowird"
		}
	}

	constructor(userArgs){

		this.args = {...this.args,...userArgs}

		//默认使用启动文件目录作为根目录
		if(!this.args.rootPath)
			this.args.rootPath = new File(process.argv[1]).getParent().fsPath;

		const {rootPath,dirList,resourceDir} = this.args;

		if(dirList.length==0){
			throw 'dirList must be exist!'
		}

		this.args.inputArgs = process.argv.slice(2);
		this.args.dirList = dirList.map(v => path.join(rootPath,v))
		this.args.resourceDir = path.join(rootPath,resourceDir)
	}

	run(){

		const {rootPath,tempJsName,inputArgs} = this.args;

		const beanDefinList  = scanerDirList(this.args.dirList)

		if(beanDefinList.length == 0)
			throw 'no beanDefine be found!'

		const tempRunFile = new File(path.join(rootPath,tempJsName));

		const springlib = `const {SpringFactory} = require("./spring");\n`+
						  `/** generate lib */\n`;

		const headLib = beanDefinList.map(beanDefine => {
			const referencePath = "."+beanDefine.fsPath.replace(rootPath,"").replace(/\\/g,"/");
			return `const { ${beanDefine.className} } = require('${referencePath}') \n`
		}).reduce( (s,v)=> s+v,"")

		const classReferences = 	`const classReferences = {};\n`+beanDefinList.map(beanDefine => {
			return `classReferences["${beanDefine.className}"] = ${beanDefine.className};\n`;
		}).reduce( (s,v)=> s+v,"")


		const argsParam = `const args = JSON.parse(\`${ JSON.stringify(this.args).replace(/\\\\/g,"//") }\`); \n`

		const run = `new SpringFactory(args,classReferences).boot();\n`;

		tempRunFile.setContent(springlib+headLib+classReferences+argsParam+run).write();

		this.subRuning(tempRunFile)

	}

	subRuning(tempRunFile){

		const {inputArgs} = this.args;

		const ls = spawn(`node`,[ tempRunFile.fsPath, ...inputArgs] );

		const print = msg => console.log(`spring > ${msg}`)

		console.log("********** Spring-Star ************\n");

		ls.stdout.on('data', print);

		ls.stderr.on('data', print);

		ls.on('close', (code) => {
			console.log("********** Spring-Over ************\n");
		});

		ls.on('error', (code) => {
			console.log(`Spring Error::${code}`);
		});
	}

}


module.exports = {SpringBoot}