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

//代理@Service的bean，并且只针对@Test方法进行代理（可不添加，代理全部）
//@Proxy(bean=Service,method=Test)
class TransactionManager {
	//beanDefine:定义和注解  bean:实例
	doProxy(bean,beanDefine){
		return {
			/**
				wrapBean {
					bean;//bean的名称
					methodFn;//原始函数对象
					methodName;//方法名称
					beanDefine;//bean的定义
					args;//原始参数
					next():object 调用原始参数
					invoke([args]):object 调用指定参数
					getMethodDefine():Method? 获取方法的元注解 可能为空
					getMethodAnnotation():Annotation? 获取注解信息 可能为空
				}
			*/
			method(wrapBean,method,args){
				//替换参数映射
				const mapping = {"hello":" 你好","playing game":"打游戏"};
				
				//测试注解
				const convertArg = mapping[args[0]];
				console.log(`TransactionManager: 拦截方法:${method} 参数替换:[${args} => ${convertArg}]`);

				const result = wrapBean.invoke([convertArg])
				//代理异步方法
				if(result instanceof Promise){
					return result.then(data => {
						console.log(`result => data`);
						return new Promise(r => r(data))
					})
				}
				console.log(`result =>${result}`)
				return result;

			}
		}
	}
}




//@Service
class Service {

	name='dolala'

	//@Value(config.app.msg)
	appMsg;

	//@Test
	saySync(userMsg){
		return `${userMsg} ${this.appMsg} \n`;
	}

	//@Test
	async doAsync(doSomething){
		return `i am busy.i am ${doSomething} \n`
	}

	async beanInit(beanDefine){
			console.log("bean初始化");
	}

}

//@SpringBoot
class Application {

	//@SpringFactory
	factory;

	//@Autowired
	service;
	
	async main(){
		console.log(`service name:${this.service.name} \n`)
		console.log(this.service.saySync("hello"))
		console.log(await this.service.doAsync("playing game"))
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
- @Bean<(beanName)> bean定义
- @Value(path) 资源注入
- @SpringBoot 启动注解，只能存在一个！
- @Autowired<(beanNam)> 自动装配
- @Proxy 后置处理类，用于bean的功能提升，使用参考用例
- @NoProxy 标注了该注解的方法，不会被代理

#### bean的生命周期
- beanInit bean在装备完之后就会立即调用（支持异步）。


