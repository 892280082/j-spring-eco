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
- 增强了js的注解功能
- 代码风格与java版本spring一致
- 文档后期有空再写吧
```js

//@Service
class Service {

	name='dolala'

	//@Value(config.app.msg)
	appMsg;

	log;

	//@Test
	saySync(userMsg){
		return `${userMsg} ${this.appMsg} \n`;
	}

	//@Test
	async doAsync(doSomething){
		return `i am busy.i am ${doSomething} \n`
	}

	async beanInit(beanDefine){
		this.log.method("beanInit").info("bean初始化");
	}

}

//@SpringBoot
class Application {

	//@Autowired
	springFactory;

	//@Autowired
	service;

	log;
	
	async main(){

		this.log.info("我启动了",{msg:"提醒"});

		const log = this.log.method("main")

		

		log.info(`service name:${this.service.name} \n`)
		log.info(this.service.saySync("hello"))
		log.info(await this.service.doAsync("playing game"))
	}
}

````




