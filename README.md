# nodeIoc

# 向java的spring开源社区致敬。

#### 介绍
- 原生js实现spring框架，不依赖第三方库和babel编译，运行时也可以调用bean的注解元数据。
- 上手开发与java的spring是一样的。
- 这个库也不算重复做轮子吧。后面有时间把spring-mvc也基于这个框架重写了。不过感觉也没啥必须要，就当学习吧。


#### 软件架构
> 使用方法参考下内置的app用例，跟springboot几乎是一样的。

#### 默认内置注解
> 注解是随意自定义添加的，只要class上面添加了注解就都会被实例化。
- @Bean(beanName) bean定义
- @Value(name) 资源注入
- @SpringBoot 启动注解，只能存在一个！
- @Autowired 自动装配
- @SpringFactory 注入Beanfactory实例
- @SpringResource 注入Resource实例 就是配置信息
- @Proxy 后置处理类，用于bean的提升，使用参考用例

#### 源码下载测试
```shell
git clone git@gitee.com:woaianqi/node-ioc.git 
cd node-ioc && node applicationBoot.js
```

#### 安装
```shell
npm install spring-ioc --save
```

#### 代码实例
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

//正式使用的时候 删除packageName属性
new SpringBoot({dirList:["./app"],packageName:"./spring"}).run();


/**
	1.同样也支持手动启动,先用node生成.runtemp.js临时运行文件
	new SpringBoot({dirList:["./app"]});
	
	2.手动启动临时文件
	shell: node .runtemp.js
*/

```