const { Annotation } = require("./Annotation")


// console.log(new Annotation("hee","xxx")) // => Annotation { name: 'hee', param: { value: 'xxx' } }
// console.log(new Annotation("hee","a=1,b=2"))  // => Annotation { name: 'hee', param: { a: '1', b: '2' } }

class BaseDefine {

	constructor(name,annotationInfos){
		this.name = name;
		this.annotation = annotationInfos.map(v => new Annotation(v.name,v.param))
	}

	name; //String 字段名称
	annotation=[];//[Annotation]注解

	//String => Boolean;判断是否存在指定注解的名称
	hasAnnotation(annotationName){
		return !!this.getAnnotation(annotationName)
	}

	////根据注解名称返回注解
	//String => Annotation throw 'no annotation for {1}'
	getAnnotation(annotationName){
		return this.annotation.find(v => v.name === annotationName)
	}
}


class Field extends BaseDefine{

	constructor(name,annotationInfo){
		super(name,annotationInfo)
	}

}

class Method extends BaseDefine{

	constructor(name,annotationInfos,params){
		super(name,annotationInfos)
		this.params = params;
	}

	params=[];//方法的参数列表
}

class BeanDefine extends BaseDefine{

	constructor(fsPath,name,annotationInfos){
		super(name,annotationInfos)
		this.fsPath = fsPath;
		this.className = name;
	}

	className;//类名

	fsPath;//String 文件路径

	fields=[]; //[Field]; 字段

	methods=[];//[Method] 方法

	/**
		获取拥有指定注解的字段
		String => [Field]
	*/
	getFiledByAnnotation(annotationName){

	};

	/**
		获取拥有指定注解的方法
		String => [Method]
	*/
	getMethod(methodName){
		return this.methods.find(m => m.name === methodName)
	}

}


module.exports = {Annotation,Field,Method,BeanDefine}
