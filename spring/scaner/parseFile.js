const {File} = require("../util/File")
const path = require("path")

const reg = {
	classReg:/class\s(\${0,}\w+)\s/,
	annotationReg:/@(.\w+)(.*)/,
	isMethodReg:/^\s{0,}(async)?\s{0,}(.*)\s{0,}\((.*)\)/,
	isFieldReg:/^\s{0,}(\${0,}\w+);?/
}

//去除括号
const removeParenthesis = str => {
	const v = str.match(/\((.+)\)/)
	return v ? v[1] : "";
}

//存在关键字
const lineContain = (line,keywords) => {
	return !!keywords.find(v => line.indexOf(v) >-1)
}

//向上查询 获取注解
const getAnnotation = (lines,currentIndex) => {
	const annotations = [];
	while(currentIndex >= 0){
		const match = lines[currentIndex].match(reg.annotationReg)
		//如果存在注解 则继续向上搜索
		if(match){
			annotations.push({
				name:match[1],
				param:removeParenthesis(match[2])
			})
		}else{
			//不存在注解 则放弃
			return annotations;
		}
		currentIndex--;
	}
	return annotations;
}

/**
	向下解析注解 	返回  type,annotationInfos
	type:"methods"| "fields"
	annotationInfos:{
		name:"字段或者方法名称"
		annotation:[{
			name:String
			param:String
		}]
		param:String//如果是方法的话 这里就是方法参数
	}
*/
const analyAnnotation = (lines,currentIndex) => {
	const result = {type:"",annotationInfos:[]}
	while(currentIndex < lines.length){
		const match = lines[currentIndex].match(reg.annotationReg)
		//如果存在注解 则继续向上搜索
		if(match){
			result.annotationInfos.push({
				name:match[1],
				param:removeParenthesis(match[2])
			})
		}else{
			//不存在注解 则放弃

			const match = lines[currentIndex].match(reg.isMethodReg)

			if(match){
				result.type =  "methods";
				result.name = match[2];
				result.param = match[3];
			}else{
				result.type =  "fields";
				result.name = lines[currentIndex].match(reg.isFieldReg)[1];
			}

			return result;
		}

		currentIndex++;
	}
}

/**

	* => {result:{} 解析结果,lastIndex:int 解析到最后的行数}

*/
const parseClass = (lines,readStartIndex) => {

	const {classReg} = reg;

	let result;

	const sendResult = lastIndex => {
		return {result,lastIndex}
	}


	while(readStartIndex < lines.length){

		const line = lines[readStartIndex];

		if(!result){

			/**处理未查询到class的情况*/

			//1.查询class
			if(classReg.test(line)){
				result = {name:line.match(classReg)[1],annotations:getAnnotation(lines,readStartIndex-1),methods:[],fields:[]}
				//若类名没有注解则停止解析
				if(result.annotations.length == 0){
					return sendResult(readStartIndex+1);
				}
			}

		}else{

			/**处理已经查询到的class情况*/

			//1.检测到结束条件 则退出
			if(lineContain(line,['class','module.exports'])){
				return sendResult(readStartIndex);
			}

			//2.检测是否存在注解
			if(reg.annotationReg.test(line)){
				//解析
				const annotationInfo = analyAnnotation(lines,readStartIndex);
				const {type,annotationInfos} = annotationInfo;
				result[type].push(annotationInfo)
				readStartIndex+=annotationInfos.length;
				continue;
			}



		}

		readStartIndex++;
	}

	return sendResult(readStartIndex);
}



const verifyExistModuleName = (name,lines) => {
	//从头向后检测
	for(let i=lines.length-1;i>=0;i--){
		if(lines[i].indexOf("module.exports")> -1 && lines[i].indexOf(name) > -1){
			return true;
		}
	}
	throw `not find bean ${name} module.exports = { ${name} } code,please check!`
}

/**
	读取内容
	* => [Object]
*/
const parseArray = (lines,readStartIndex=0)=>{

	//解析类
	const {result,lastIndex} = parseClass(lines,readStartIndex)

	if(result){
		//console.log(result.name,lines)
		verifyExistModuleName(result.name,lines)
	}

	//不存在结果 或者 内容读取结束 返回空数组
	if(lastIndex>=lines.length ){
		return [];
	}

	//若存在结果 则递归读取后面的内容
	return [result,...parseArray(lines,lastIndex)]
}

/**
	读取文件，去除空行，去除开头的\t制表符，分割成组。 返回对象的注解定义
	[
	  	{
		    "name": "Hello",
		    "className":"className",
		    "annotations": [
		      {
		        "name": "Component",
		        "param": ""
		      }
		    ],
		    "methods": [
		      {
		        "type": "methods",
		        "annotationInfos": [
		          {
		            "name": "RequestMapping",
		            "param": "method1maping,pa=session,pb=body,pc=query"
		          }
		        ],
		        "name": "method1",
		        "param": "pa,pb,pc"
		      }
		    ],
		    "fields": [
		      {
		        "type": "fields",
		        "annotationInfos": [
		          {
		            "name": "Value",
		            "param": "config.all"
		          }
		        ],
		        "name": "name2"
		      },
		      {
		        "type": "fields",
		        "annotationInfos": [
		          {
		            "name": "Component",
		            "param": "'hello2Name'"
		          }
		        ],
		        "name": "class"
		      }
		    ]
		}
	]

*/
const parseFile = fsPath => {
	let conteLines = new File(fsPath).readFile()
						.removeEmptyLines()
						//将 //@ 转换成@ 
						.map(c => c.replace(/\/\/@/g,"@"))
						//删除单行注释
						.map(c => c.replace(/\/\/.*\r\t/g,""))
						//删除块状注释
						.map(c => c.replace(/\/\*[^]*?\*\//g, ''))
						.getLines()
						//再次删除单行注释（之前有些情况删除不了）
						.filter(line => !/^\s{0,}\/\//.test(line) )
						.map(str => str.replace(/^\t+/g,""))
	return parseArray(conteLines).map( d => {
		return {...d,fsPath};
	})
}


module.exports = {parseFile}


