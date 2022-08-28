# <img src="doc/spring-framework.png" width="80" height="80"> Spring Framework For Node

---

**向Spring开源社区致敬！**

原生javascript实现Spring框架，无缝还原，上手丝滑，秒级启动。适合轻应用和产品原型开发。


```js
//@SpringBoot
Class Application {

  /**
    演示如何引入阿里大鱼的短信服务
      1. npm install alibaba-sms-demo --save
      2. 在app-dev.yaml中配置组件的基础信息
          alibaba-sms-demo:
            key: 'xxx'
            secret: 'xxx'
      3. 在项目中引入alibaba-sms-demo包中具体组件
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
- 支持注入Npm组件
- 秒级启动

---

## 生态
- [j-spring-mvc](https://gitee.com/woaianqi/j-spring-mvc) 轻量级web开发框架
- [spring-sqlite3-orm](https://gitee.com/woaianqi/spring-sqlite3-orm) 轻量级orm框架
- [j-spring-cli](https://gitee.com/woaianqi/j-spring-cli) 项目脚手架


---

## 文档

* 一、如何使用
  > 1.[创建项目](doc/1-1.md)

* 二、启动流程
  > 1.[启动流程](doc/2-1.md)

* 三、启动参数
  > 1.[参数详解](doc/3-1.md)  

* 四、注解
  > 1.[Annotation](doc/4-1.md)  
  > 2.[BeanDefine](doc/4-2.md)  
  > 3.[j-spring内置注解](doc/4-3.md)  

* 五、Bean
  > 1.[Bean](doc/5-1.md)   
  > 2.[内置bean](doc/5-2.md)  

* 六、代理
  > 1.[代理设置](doc/6-1.md)  

* 七、日志扩展
  > 1.[日志](doc/7-1.md)  

* 八、npm组件
  > 1.[组件的创建和引用](doc/8-1.md)
---

## 证书

The Spring Framework For Node is released under version 2.0 of the [Apache License](https://www.apache.org/licenses/LICENSE-2.0).
