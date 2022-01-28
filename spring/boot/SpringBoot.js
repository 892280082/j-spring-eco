const { scanerDirList } = require("../scaner/scaner");
const {File} = require("../util/File")
const path = require('path');

class SpringBoot {

	args = {
		rootPath:"",
		dirList:[],
		tempJsName:"runtemp.js",
		resourceDir:"resource",
		inputArgs:[],
	}

	constructor(userArgs){

		this.args = {...this.args,...userArgs}

		const {rootPath,dirList,resourceDir} = this.args;

		if(!rootPath){
			throw 'rootPath must be exist!'
		}

		if(dirList.length==0){
			throw 'dirList must be exist!'
		}

		this.args.dirList = dirList.map(v => path.join(rootPath,v))
		this.args.resourceDir = path.join(rootPath,resourceDir)
	}

	run(){

		const {rootPath,tempJsName} = this.args;

		const beanDefinList  = scanerDirList(this.args.dirList)

		if(beanDefinList.length == 0)
			throw 'no beanDefine be found!'

		const tempRunFile = new File(path.join(rootPath,tempJsName));

		const springlib = `const {SpringFactory} = require("./spring");\n`+
						  `/** generate lib */\n`;

		const headLib = beanDefinList.map(beanDefine => {
			const referencePath = "."+beanDefine.fsPath.replace(rootPath,"").replace(/\\/g,"/");
			return `const { ${beanDefine.name} } = require('${referencePath}') \n`
		}).reduce( (s,v)=> s+v,"")

		const classReferences = 	`const classReferences = {};\n`+beanDefinList.map(beanDefine => {
			return `classReferences["${beanDefine.name}"] = ${beanDefine.name};\n`;
		}).reduce( (s,v)=> s+v,"")


		const argsParam = `const args = JSON.parse(\`${ JSON.stringify(this.args).replace(/\\\\/g,"//") }\`); \n`

		const run = `new SpringFactory(args,classReferences).boot();\n`;

		tempRunFile.setContent(springlib+headLib+classReferences+argsParam+run).write();

	}



}


module.exports = {SpringBoot}