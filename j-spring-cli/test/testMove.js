const {ExtendsModuleTemplateMove} = require("../src/ProjectMove");
const path = require('path');
const fs = require("fs-extra"); 


const p = new ExtendsModuleTemplateMove("AaBccD");



console.log(p)
console.log("模板路径:"+p.getTempPath())
console.log("项目名称:"+p.getFormatDirName())
const targetDestnation = path.join(__dirname,"../testCopy",p.getFormatDirName())
console.log("复制目标"+targetDestnation)


setTimeout(()=>{
	//fs.remove(targetDestnation)
},1000)

const main = async () => {

	const result = await p.copyTo(targetDestnation);

	await p.modify();

	console.log("Building complish! next step 1.npm install 2.node index.js");

}

main();