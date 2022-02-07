

class InvokeBean {
	bean;
	methodFn;
	methodName;
	beanDefine;
	args;
	constructor(bean,methodFn,methodName,beanDefine,args){
		this.bean = bean;
		this.methodFn =methodFn;
		this.args = args;
		this.methodName = methodName;
		this.beanDefine = beanDefine;
	}
	next(){
		return this.invoke(this.args)
	}
	invoke(args){
		const {bean,methodFn} = this;
		return methodFn.apply(bean,args);
	}
	getMethodDefine(){
		return this.beanDefine.getMethod(this.methodName)
	}
	getMethodAnnotation(annoatationiName){
		const methodDefine = this.getMethodDefine();
		return methodDefine ? methodDefine.getAnnotation(annoatationiName) : null;
	}
}



//代理方法
const addProxyMethod = (bean,beanDefine,proxyInfo) => {

	//遍历父类及所有方法
	getAllFunction(bean,bean.constructor.prototype).forEach(fn => {

		const methodDefine = beanDefine.getMethod(fn);

		//方法上存在@NoProxy注解 则不进行代理
		if(methodDefine && methodDefine.hasAnnotation("NoProxy"))
			return;

		//旧的方法
		const oldFn = bean[fn];

		//新的方法
		bean[fn] = function(){

			const args = Array.prototype.slice.apply(arguments);

			return proxyInfo.method(new InvokeBean(bean,oldFn,fn,beanDefine,args),fn,args)

		}

	})

	return bean;

}

//获取所有属性
const getAllFunction = (obj,prototype)=>{

	//判断prototype={}的情况
	if(!prototype.__proto__)
		return [];

	const out = [];
	Object.getOwnPropertyNames(prototype).forEach(p => {

		if(p === 'constructor'){
			getAllFunction(obj,prototype.__proto__).forEach(f => out.push(f))
			return;
		}

		if(typeof obj[p]  === 'function'){
			out.push(p);
		}

	})

	return out;

}


module.exports = {addProxyMethod}
