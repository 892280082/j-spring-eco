#!/usr/bin/env node
const {readLine,readNumber} = require('./src/userInput')
const {ExtendsModuleTemplateMove,SpringNativeTemplateMove,SpringWebTemplateMove} = require("./src/ProjectMove");
const path =require('path');

/**
	to instance specified class and copy to destnation.
*/
const copyTemplate = async (classConstructor,projectName) => {

	const cwdPath = process.cwd();

	const mvInstance = new classConstructor(projectName)

	const desnaPath = path.join(cwdPath,mvInstance.getFormatDirName())

	await mvInstance.copyTo(desnaPath)

	await mvInstance.modify();

	return mvInstance;
}


const main = async ()=>{

	const projectType = await readNumber("please enter the building type: \n 1.j-spring native \n 2.j-spring-mvc for web \n 3.j-spring-npm extends module development",1,3)

	const tip = "please enter a project name. example:HelloProject";

	const tips = [tip,tip,tip];

	const classConstructorList = [SpringNativeTemplateMove,SpringWebTemplateMove,ExtendsModuleTemplateMove]

	const projectName = await readLine(tips[projectType-1])

	const mvInstance = await copyTemplate(classConstructorList[projectType-1],projectName);

	console.log(`Building complish!  \n 1.cd ${mvInstance.getFormatDirName()} \n 2.npm install \n 3.node index.js \n`);

	process.exit(0);

}


main();
