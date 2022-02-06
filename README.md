# 向java的spring开源社区致敬!

#### 介绍
- 原生js实现spring框架，不依赖第三方库和babel编译，运行时也可以调用bean的注解元数据。
- 尽可能的还原java的spring框架。


#### 源码下载并测试
```shell
git clone git@gitee.com:woaianqi/node-ioc.git 
cd node-ioc && node applicationBoot.js
```

#### 安装
```shell
npm install spring-ioc --save
```

#### 代码用例
> 主程序代码 ./app/Application.js
```js
const {SpringProxy} = require('../spring')

//@Proxy(annotation=Service)
class TransactionManager {
	//beanDefine:定义和注解  bean:实例
	doProxy(beanDefine,bean){
		return new SpringProxy(bean,{
			method(wrapBean,method,args){
				console.log(`TransactionManager: 拦截方法:${method} 参数替换:[${args} => 你好]`);
				return wrapBean.invoke(["你好 "])
			}
		})
	}
}


//@Service
class Service {

	//@Value(config.app.msg)
	appMsg;

	say(userMsg){
		return `${userMsg} ${this.appMsg} \n`;
	}

}

//@SpringBoot
class Application {

	//@SpringFactory
	factory;

	//@Autowired
	service;
	
	main(){
		console.log(this.service.say("hello"))
	}
}

module.exports = {Application,Service,TransactionManager}
````

> 启动代码 applicationBoot.js
```js
const {SpringBoot} = require("./Spring")

	/** 支持修改的参数
	args = {
		rootPath:"", //项目根路径
		srcList:[],  //源码目录集合
		tempJsName:".runtemp.js", //生成临时文件名称
		resourceDir:"resource", //资源目录名称
		annotation:{ //配置系统默认注解
			valueInject:"Value",
			appBoot:"SpringBoot",
			beanInject:"Autowired",
			springFactory:"SpringFactory",
			springResource:"SpringResource",
			proxy:"Proxy"
		}
	}
	*/

	//正式使用的时候 删除packageName属性
	new SpringBoot({srcList:["./app"],packageName:"./spring"}).run();


	/**
		1.同样也支持手动启动,先用node生成.runtemp.js临时运行文件
		new SpringBoot({srcList:["./app"]});
		
		2.手动启动临时文件
		bash> node .runtemp.js
	*/

```



#### 默认内置注解
> 注解是随意自定义添加的，只要class上面添加了注解就都会被扫描到。
> bean实例化完成过后调用beanInit方法（支持异步）。
- @Bean<(beanName)> bean定义
- @Value(path) 资源注入
- @SpringBoot 启动注解，只能存在一个！
- @Autowired<(beanNam)> 自动装配
- @SpringFactory 注入Beanfactory实例
- @SpringResource 注入Resource实例 就是配置信息
- @Proxy 后置处理类，用于bean的功能提升，使用参考用例
- @NoProxy 标注了该注解的方法，不会被代理

