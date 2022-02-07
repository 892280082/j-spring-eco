const {SpringResource} = require("../resource/SpringResource")
const {scanersrcList} = require("../scaner/scaner")
const {addProxyMethod} = require('../util/SpringProxy')

//单例模式：缓存自身实例 
let facotryInstance = null;

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

//缓存bean
class BeanCache {

	cache=[];

	push(beanDefine,bean){
		this.cache.push({beanDefine,bean})
	}


	exist(beanName){
		return this.cache.find(v => v.beanDefine.name === beanName);
	}

	get(beanName){
		const oldCache = this.exist(beanName);
		if(!oldCache)
			throw `no cache bean that name ${beanName}`
		return oldCache.bean;
	}

	getBeanByAnnotation(annotation){
		return this.cache.filter(d => d.beanDefine.hasAnnotation(annotation)).map(d => d.bean)
	}

	getBeanDefineByBean(bean){
		
		const oldCache = this.cache.find(d => d.bean === bean);
		return oldCache ? oldCache.beanDefine : null;
	}

}

class ProxyEnhance {

	datas = [];

	getBeanList(annotationList){
		return annotationList.map(annotation => {
			return this.datas.filter(d => d.annotation === annotation).map(d => d.proxyBean)
		}).reduce((s,v)=>{
			return [...s,...v]
		},[]);
	}

	//处理的注解 增强的bean
	push(annotation,proxyBean){
		this.datas.push({proxyBean,annotation})
	}

	doEnhance(beanDefine,bean){

		const annotationList = beanDefine.annotation.map(a => a.name);

		const proxyBeanList = this.getBeanList(annotationList);

		//通过代理类 对该对象进行提升
		proxyBeanList.forEach(proxyBean => {

			const proxyInfo = proxyBean.doProxy(beanDefine,bean)

			bean = addProxyMethod(bean,beanDefine,proxyInfo)
		});

		return bean;
	}


}


class SpringFactory {

	/**
		rootPath:"",
		srcList:[],
		tempJsName:"runtemp.js",
		resourceDir:"resource",
		inputArgs:[],
	*/
	args;

	//SpringResource
	resource;

	//类型引用管理
	classReferences;

	//bean定义集合
	beanDefineList;

	//bean缓存 默认全部是单例
	beanCache= new BeanCache();

	//代理提升
	proxyEnhance = new ProxyEnhance();

	constructor(args,classReferences){
		this.args = args;
		const {resourceDir,srcList} = args;
		this.resource = new SpringResource(resourceDir);
		this.classReferences = classReferences;
		this.beanDefineList = scanersrcList(srcList)
	}


	/**
	根据beanDefine的name获取bean
	*/
	getBean(beanDefineName){
		return this.beanCache.get(beanDefineName)
	}

	/**
	传入bean获取bean的define	
	*/
	getBeanDefineByBean(bean){
		return this.beanCache.getBeanDefineByBean(bean);
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
		根据beanDefine组装bean
	*/
	async assembleBeanByBeanDefine(beanDefine,injectPath=[]) {


		if(this.beanCache.exist(beanDefine.name)){
			return this.beanCache.get(beanDefine.name);
		}


		injectPath.push(beanDefine.name)

		//检测是否出现了 循环引用
		juageRecurseInject(injectPath);

		const {valueInject,beanInject,springFactory,springResource} = this.args.annotation;

		let bean = new this.classReferences[beanDefine.className]

		for(let i=0;i<beanDefine.fields.length;i++){

			const field = beanDefine.fields[i];

			//字段注入配置文件
			if(field.hasAnnotation(valueInject)){
				const {value} = field.getAnnotation(valueInject).param;
				bean[field.name] = this.resource.getValue(value)
			}

			//字段装配bean
			if(field.hasAnnotation(beanInject)){
				//@Autowired(beanName) beanName默认使用 否则使用字段首字母大写
				const value = field.getAnnotation(beanInject).param.value || capitalizeFirstLetter(field.name);
				const subBeanDefine = this.getBeanDefineByName(value)
				if(!subBeanDefine){
					throw `bean定义获取失败 类名:${beanDefine.className} 字段:${field.name} 注解:${beanInject} `
				}
				const subBean = await this.assembleBeanByBeanDefine(subBeanDefine,injectPath)
				bean[field.name] = subBean
			}

			if(field.hasAnnotation(springFactory)){
				//注入工厂
				bean[field.name] = this;
			}

			if(field.hasAnnotation(springResource)){
				//注入资源类
				bean[field.name] = this.resource;
			}

		}


		//对bean进行增强提升
 		bean = this.proxyEnhance.doEnhance(beanDefine,bean);

		//放入缓存
		this.beanCache.push(beanDefine,bean);

		if(bean['beanInit'] && typeof bean['beanInit'] === 'function'){
			await bean.beanInit(beanDefine);
		}

		return bean;
	}

	async loadProxy(){

		const {proxy} = this.args.annotation;

		//获取代理类 并根据从小到大排序
		const beanDefineList = this.getBeanDefineByAnnotation(proxy).sort( (b1,b2) => {
			return (b1.getAnnotation(proxy).param.sort || 100) - (b2.getAnnotation(proxy).param.sort || 100)
		})

		for(let i=0;i<beanDefineList.length;i++){

			const beanDefine = beanDefineList[i];

			const targetAnnotation = beanDefine.getAnnotation(proxy).param["annotation"]

			const proxyBean = await this.assembleBeanByBeanDefine(beanDefine)

			if(!proxyBean['doProxy']){
				throw 'the proxyBean must implements doProxy method!'
			}

			this.proxyEnhance.push(targetAnnotation,proxyBean)


		}

	}

	//1.启动
	async boot(){

		try {

			const {appBoot} = this.args.annotation;

			const beanDefineList = this.getBeanDefineByAnnotation(appBoot);

			if(beanDefineList.length == 0){
				throw 'error: not find @SpringBoot bean'
			}

			if(beanDefineList.length > 1){
				throw 'error: found more than one @SpringBoot bean'
			}

			//装配结束 放入实例
			facotryInstance = this;

			//优先实例化代理类
			await this.loadProxy();

			//开始装配
			const bean = await this.assembleBeanByBeanDefine(beanDefineList[0])

			//启动自动启动注解
			// await this.doBeanInit();1

			bean.main(this.args.inputArgs);

		}catch(e){

			console.log('启动失败',e);

		}

	}


	static getInstance(){
		return facotryInstance;
	}

}

module.exports = {SpringFactory}