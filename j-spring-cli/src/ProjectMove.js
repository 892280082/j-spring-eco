const path = require('path')
const fs = require("fs-extra");
const {File} = require("./File")

class ModifyInstructFactory {

	project;

	method;

	args;

	constructor(project,method,args){
		this.project = project;
		this.method = method;
		this.args = args;
	}

	getTargetFile(relativePath){
		return new File(path.join(this.project.destination,relativePath));
	}

	async invoke(){

		if(typeof this[this.method] !== 'function')
			throw `instruct [${this.method}] not exist!`

		this[this.method].apply(this,this.args)
	}

	replace(filename,t,d){
		this.getTargetFile(filename).readFile().replace(t,d).write();
	}

	replaceRecursive(changeContent){
		const targetFile = new File(this.project.destination);
		const fileList = targetFile.getFileListRecurse();
		fileList.map(f => new File(f)).forEach(f => {
			f.readFile();
			let isModify = false;
			changeContent.forEach(change => {
				const [ori,tar] = change;
				if(f.contain(ori)){
					isModify = true;
					f.replace(ori,tar)
				}
			})
			isModify && f.write();
		})
	}


	rename(filename,targetName){
		this.getTargetFile(filename).changeFileName(targetName)
	}

}




class ProjectMove {

	templateName;

	targetProjectName;

	destination;

	constructor(templateName){
		this.templateName = templateName;
	}

	getTempPath(){
		return path.join(__dirname,"../template",this.templateName)
	}

	getFormatDirName(){
		return this.getFirstLowerName().replace(/[A-Z]/g,(m) => "-"+m.toLowerCase())
	}

	getFirstLowerName(){
		return this.targetProjectName[0].toLowerCase()+this.targetProjectName.slice(1)
	}

	copyTo(destination){

		this.destination = destination;

		return new Promise((resolve,reject) => {

			fs.copy(this.getTempPath(), destination, function (err) {
			    if (err){
					reject(err)
			    }
			    resolve("complish")
			});

		})
	}

	async modify(){
		const instructList = this.getModifyInstruct();

		for(let i=0;i<instructList.length;i++){
			const [method,...args] = instructList[i];
			const mi = new ModifyInstructFactory(this,method,args);
			await mi.invoke()
		}
	}

	//change direction
	getModifyInstruct(){
		return [];
	}

}


// class ExtendsModuleTemplateMove extends ProjectMove {

// 	constructor(targetProjectName){
// 		super("spring-extends-template")
// 		this.targetProjectName = targetProjectName;
// 	}

// 	getModifyInstruct(){
// 		const superDirection = super.getModifyInstruct()
// 		const out = [];

// 		//change file name
// 		//out.push(["rename","/resource/TemplateBean.json",`${this.targetProjectName}.json`])
// 		out.push(["rename","/spring_extends/bean/TemplateBean.js",`${this.targetProjectName}.js`])

// 		//modify content
// 		const changeContent = [
// 			["templateBean",this.getFirstLowerName()],
// 			["TemplateBean",this.targetProjectName],
// 			["spring-extends-template",this.getFormatDirName()]
// 		];

// 		out.push(["replaceRecursive",changeContent]);


// 		return superDirection.concat(out)
// 	}

// }


// class SpringWebTemplateMove extends ProjectMove {

// 	constructor(targetProjectName){
// 		super("spring-mvc-template")
// 		this.targetProjectName = targetProjectName;
// 	}

// 	getModifyInstruct(){
// 		const superDirection = super.getModifyInstruct()
// 		const out = [];

// 		out.push(["replace","/package.json",`spring-mvc-template`,this.getFormatDirName()])

// 		return superDirection.concat(out)
// 	}

// }

// class SpringNativeTemplateMove extends ProjectMove {

// 	constructor(targetProjectName){
// 		super("spring-application-template")
// 		this.targetProjectName = targetProjectName;
// 	}

// 	getModifyInstruct(){
// 		const superDirection = super.getModifyInstruct()
// 		const out = [];

// 		out.push(["replace","/package.json",`spring-application-template`,this.getFormatDirName()])

// 		return superDirection.concat(out)
// 	}

// }

module.exports = {ProjectMove,SpringNativeTemplateMove,SpringWebTemplateMove,ExtendsModuleTemplateMove};
