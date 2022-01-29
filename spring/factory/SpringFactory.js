const {SpringResource} = require("../resource/SpringResource")
const {scanerDirList} = require("../scaner/scaner")


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
	检测是否出现了循环引用错误
	因为都是单例模式，所以一个bean只会实例一次 如果重复出现 就会报错
*/
const juageRecurseInject = injectPaths => {
	const length = injectPaths.length;
	if(injectPaths.length >= 3){
		if(injectPaths[length-1] === injectPaths[length-3])
			throw `出现了循环引用:${injectPaths[length-1]} <=> ${injectPaths[length-2]}`
	}
}

class SpringFactory {

	/**
		rootPath:"",
		dirList:[],
		tempJsName:"runtemp.js",
		resourceDir:"resource",
		inputArgs:[]
	*/
	args;

	//SpringResource
	resource;

	//类型引用管理
	classReferences;

	//bean定义集合
	beanDefineList;

	//bean缓存 默认全部是单例
	_beanCache={};

	constructor(args,classReferences){
		this.args = args;
		const {resourceDir,dirList} = args;
		this.resource = new SpringResource(resourceDir);
		this.classReferences = classReferences;
		this.beanDefineList = scanerDirList(dirList)
	}


	/**
		根据类名获取bean的定义信息
		String => BeanDefine
		throw 'no beanDefine name {}'
	*/
	getBeanDefineByName(name){
		return this.beanDefineList.find(v => v.name === name);
	}

	/**
	   获取具有指定注解的定义
		String => [BeanDefine]
	*/
	getBeanDefineByAnnotation(annotationName){
		return this.beanDefineList.filter(beanDefine =>  beanDefine.hasAnnotation(annotationName))
	}

	/**
		根据类名获取bean 优先使用缓存 默认全部单例
	*/
	assembleBeanByBClassName(className)  {
		if(this._beanCache[className]){
			return this._beanCache[className]
		}
		const bean = assembleBeanByBeanDefine(getBeanDefineByClassName(className))
		this._beanCache[className] = bean;
		return bean;
	}

	/**
		根据beanDefine组装bean
	*/
	assembleBeanByBeanDefine(beanDefine,injectPath=[]) {

		if(this._beanCache[beanDefine.name])
			return this._beanCache[beanDefine.name];

		injectPath.push(beanDefine.name)

		//检测是否出现了 循环引用
		juageRecurseInject(injectPath);

		const bean = new this.classReferences[beanDefine.className]

		beanDefine.fields.forEach(field => {

			//字段注入配置文件
			if(field.hasAnnotation("Value")){
				const {value} = field.getAnnotation("Value").param;
				bean[field.name] = this.resource.getValue(value)
			}

			//字段装配bean
			if(field.hasAnnotation("Autowird")){
				//@Autowird(beanName) beanName默认使用 否则使用字段首字母大写
				const value = field.getAnnotation("Autowird").param.value || capitalizeFirstLetter(field.name);
				const subBeanDefine = this.getBeanDefineByName(value)
				bean[field.name] = this.assembleBeanByBeanDefine(subBeanDefine,injectPath)
			}

		})

		this._beanCache[beanDefine.name] = bean;

		return bean;
	}

	//1.启动
	boot(){

		const beanDefineList = this.getBeanDefineByAnnotation("SprintBoot");

		if(beanDefineList.length == 0){
			throw 'error: not find @SpringBoot bean'
		}

		if(beanDefineList.length > 1){
			throw 'error: found more than one @SpringBoot bean'
		}

		const bean = this.assembleBeanByBeanDefine(beanDefineList[0])

		bean.main(this.args.inputArgs);

	}

}

module.exports = {SpringFactory}