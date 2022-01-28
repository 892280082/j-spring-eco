第一步:调用spring的scanner  生成beanDefine ，成功后根目录创建runtimeIndex.js
扫描src目录下的文件夹，解析每一个js文件，生成beanDefine信息。
扫描方法支持一个文件多类
扫描@Component开头,遇到  module.exports,class,文件末尾结束。类名不得重复。

Annotation {
	name:String 注解名称 不要@
	param:{} 解析后的参数 例如 @Value("config.name") 解析后的值 {value:"config.name"} 如果是@Value(a=1,b=2) 解析后的值 {a:"1",b:2}
}

BeanDefine extends AttributeAnnotation{
	path:String;  文件路径
	fields:[Field]; 字段
	Methods:[Method] 方法
	getFiledByAnnotation(String annotationName):List<Field> ; 获取拥有指定注解的字段
	getMethodByAnnotation(String annotationName):List<Method> ; 获取拥有指定注解的方法

}

AttributeAnnotation {
	name:String 字段名称
	annotation:[Annotation] 注解

	hasAnnotation(String annotationName):Boolean ；判断是否存在指定注解的名称

	getAnnotation(String annotationName):Annotation throw 'no annotation for {}' { //根据注解名称返回注解

	}
}

Field extends AttributeAnnotation{
}

Method extends AttributeAnnotation{
	params:[AttributeAnnotation]
}



第二步:生成临时文件 runtimeIndex.js 生成在项目根目录

这个文件就是将beanDefine信息，组成一个类引用表。

先引用框架的包
const {SprintBeanScaner,SpringBeanFactory,SpringResource} = require("./spring")

引用bean的文件
const { SprintBoot } = require("./src/SprintBoot")
const { TestService } = require("./src/TestService")

读取所有的配置文件,默认resource目录下的所有json文件
const allResource = SpringResource.readResource("./resource")

生成一个容器对象ClassContainer
{
	"SprintBoot":SprintBoot,
	"TestService":TestService
}


List<BeanDefine> beanDefineList = SprintBeanScaner.scanner("./src");


SpringBeanFactory.init(allResource,classContainer,beanDefineList);//bean工厂初始化


//启动
SpringBeanFactory.boot();


第三步:工厂启动
SpringBeanFactory {

	resource:{};所有的配置

	classContainer:{};所有类的引用

	beanDefineList:[BeanDefine];bean的定义和引用


	getBeanDefineByClassName(String className):BeanDefine throw 'no bean have name {className}' ;从beanDefineList获取bean的定义

	getBeanDefineByAnnotation(String annotationName):BeanDefine throw 'no bean have annotation {annotationName}';//根据注解名称获取beanDefine名称


	assembleBeanByBClassName(String className):Object //根据bean的类名组装bean {
		return assembleBeanByBeanDefine(getBeanDefineByClassName(className))
	}

	assembleBeanByBeanDefine(BeanDefine beanDefine):Object;//根据bean的定义组装bean {



	}


	//启动代码 args就是启动的时候输入的参数 例如start.js a b c args:["a","b","c"]
	boot(List<String> args):void {

		//1.查询@SprintBoot注解标记的beanDefine
		BeanDefine beanDefine = getBeanDefineByAnnotation("Sprint

		//2.根据define组装bean
		Object bean = assembleBeanByBeanDefine(beanDefine)

		//3.运行
		bean.main();

	}



}


第四步:详解SpringBeanFactory的assembleBeanByBeanDefine方法

SpringFactory



createInstance(String className):Object   throw 'class name [{className}] not find ' 根据类名获取实例 {
	if(!classContainer[className])
		throw 
	return new classContainer[className]
}


assembleBeanByBeanDefine(BeanDefine beanDefine):Object;//根据bean的定义组装bean {

	//1.第一步 获取引用链接,创建实例
	const bean = createInstance(beanDefine.name)

	//2.检测所有需要装配的资源字段
	const ResourceFields = beanDefine.getFiledByAnnotation("@Value")

	ResourceFields.forEach(field => {

		bean[field.name] = getResource(field.getAnnotation('@Value').param.value)

	})

	//3.检测所有需要装配的组件
	const AutowirdFields = beanDefine.getFiledByAnnotation("@Autowird")

	AutowirdFields.forEach(field => {

		//这一步其实就进入递归了
		// 这里传入自己的名称  防止循环 如果检测到需要注册的名称 跟自己相同 就表示错误 直接抛出异常！
		bean[field.name] = assembleBeanByBClassName(field.getAnnotation('@Value').param.value)

	})

	return bean;
}




在项目根目录创建一个start.js

const {SpringBoot} = require("./Spring")

new SpringBoot({
	rootPath:__dirname,
	dir:[x,x2],
	tempFileName:"run.tempjs"}).run();


	run 方法逻辑






