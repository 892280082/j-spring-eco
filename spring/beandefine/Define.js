const { AttributeAnnotation,Annotation } = require("./Annotation")


class Field extends AttributeAnnotation{

	constructor(name,annotationInfo){
		super(name,annotationInfo)
	}

}

class Method extends AttributeAnnotation{

	constructor(name,annotationInfos,params){
		super(name,annotationInfos)
		this.params = params;
	}

	params=[];//方法的参数列表
}

class BeanDefine extends AttributeAnnotation{

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