
/**
	注解的基础属性
	1.name 注解的名称
	2.param 注解的参数
*/
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



module.exports = {Annotation}
