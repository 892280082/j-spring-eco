# <img src="doc/spring-framework.png" width="80" height="80"> Spring Framework For Node

---

**向Spring开源社区致敬！**

原生javascript实现Spring框架，无缝还原，上手丝滑。

```js
//@SpringBoot
Class Application {

  /**
    演示如何引入阿里大鱼的短信服务
      1. npm install alibaba-sms-demo --save
      2. 在app-dev.yaml中配置组件的基础配置
      3. 在项目中引入具体组件
  */
  //@Autowired(alibaba.sms.demo.smsUtil)
  smsUtil;

  //默认入口程序
  async main(args){

    await this.smsUtil.sendMsg(<tel>,'msg')

  }

}
```


## 特点
- 支持注解
- 无第三方依赖
- 无需babel编译
- 支持注入Npm包组件

---

## 生态
- [spring-ioc-mvc](https://gitee.com/woaianqi/spring-ioc-mvc) 轻量级web开发框架
- [spring-sqlite3-orm](https://gitee.com/woaianqi/spring-sqlite3-orm) 轻量级orm框架
- [spring-ioc-cli](https://gitee.com/woaianqi/spring-ioc-cli) 项目脚手架


---

## 文档

* 如何使用
  > 1.手动创建  
  > 2.脚手架自动创建   

* 启动流程及参数设置
  > 1.启动流程  
  > 2.启动参数  
  > 3.线上启动

* 定义注解
  > 1.内置注解    
  > 2.定义注解

* 定义Bean
  > 1.内置bean  
  > 2.定义Bean  


* 设置AOP
 > 1.代理设置


* npm组件包
  > 1.开发组件包  
  > 2.引入组件包

---

## 证书

The Spring Framework For Node is released under version 2.0 of the [Apache License](https://www.apache.org/licenses/LICENSE-2.0).
