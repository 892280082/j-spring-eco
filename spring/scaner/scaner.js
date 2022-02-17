const {parseFile} = require("./parseFile")
const {Annotation,Field,Method,BeanDefine} = require("../beandefine/Define")
const {File} = require("../util/File")

//将解析的原始数据转换成bean定义对象
const convertToBeanDefine = originData => {
	//console.log(JSON.stringify(originData,null,2))
	const {name,annotations,methods,fields,fsPath} = originData;
	const beanDefine = new BeanDefine(fsPath,name,annotations);
	beanDefine.fields = fields.map(f => new Field(f.name,f.annotationInfos))
	beanDefine.methods = methods.map(f => new Method(f.name,f.annotationInfos))

	/**
		bean的名称就是默认名称
		如果@Bean(targetName) 存在targetName，则使用指定名称
	*/
	if(beanDefine.hasAnnotation("Bean")){
		const beanAnnotation = beanDefine.getAnnotation("Bean")
		const {value} = beanAnnotation.param;
		if(value){
			beanDefine.name = value;
		}
		
	}

	return beanDefine;
}

//递归扫描目录
const scanerDir = dirPath =>{
	return new File(dirPath).getFileListRecurse() //递归获取所有的文件
		.map(parseFile) //解析文件
		.reduce((s,v)=> [...s,...v] ,[]) // 合并
		.filter(v => v.annotations.length > 0) //出去没有注解的bean
		.map(convertToBeanDefine) //原始数据信息 转换成beanDefine
}


//校验beandefineList 是否符合标注
const verifyBeanDefineList = beanDefineList => {
	//1.禁止名称重复
	beanDefineList.map(b => b.name).reduce((s,v)=> {
		if(s[v]){
			throw `beanDfine name replace: ${s[v]}`
		}else{
			s[v]=v;
			return s;
		}
	},{})
}


//扫描目录集合
const scanersrcList = dirPathList => {

	const beanDefineList = dirPathList.map(scanerDir).reduce((s,v) => {
		return [...s,...v]
	},[]);

	//1.校验集合是否合格
	verifyBeanDefineList(beanDefineList)

	return beanDefineList;
}


const sacnnerArgs = args => {

	const {srcList,moduleList} = args;

	let beanDefinList  = scanersrcList(srcList)

	moduleList.forEach(moduleInfo=>{

		const {packageName,srcList} = moduleInfo;

		const defines = scanersrcList(srcList).map(d => {
			d.packageName = packageName;
			return d;
		})

		beanDefinList = [...beanDefinList,...defines]

	})

	return beanDefinList;
}

module.exports = {scanerDir,scanersrcList,sacnnerArgs}