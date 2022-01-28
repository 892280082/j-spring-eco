

class Annotation {

	constructor(name,paramStr){
		this.name = name;
		if(paramStr){
			if(paramStr.indexOf("=") > -1){
				paramStr.split(",").forEach(v => {
					const [key,value] = v.split("=")
					this.param[key] = value;
				})
			}else{
				this.param.value = paramStr;
			}
		}
	}

	name;//String 注解名称 不要@
	param={};//解析后的参数 例如 @Value("config.name") 解析后的值 {value:"config.name"} 如果是@Value(a=1,b=2) 解析后的值 {a:"1",b:2}
}


// console.log(new Annotation("hee","xxx")) // => Annotation { name: 'hee', param: { value: 'xxx' } }
// console.log(new Annotation("hee","a=1,b=2"))  // => Annotation { name: 'hee', param: { a: '1', b: '2' } }

class AttributeAnnotation {

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


module.exports = {Annotation,AttributeAnnotation}