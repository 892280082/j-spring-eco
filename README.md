# nodeIoc

# 向java的spring开源社区致敬。

#### 介绍
- 原生js实现spring框架，不需要第三方babel编译，运行时可以调用bean的注解元数据。
- 设计模式和spring是一样的。
- 我自己会用这个框架，写一些简单的小应用。
- 闲的时候把springmvc也写完。

#### 软件架构
- 使用方法参考下内置的app用例，跟springboot几乎是一样的。

#### 内置注解
> 注解是随意自定义添加的，只要class上面添加了注解就都会被实例化。
- @Bean(beanName) 定义bean的名称
- @Value(name) 资源注解
- @SpringBoot 启动注解，只能存在一个！
- @Autowired 自动装配类
- @SpringFactory 注入bean工厂
- @SpringResource 注入资源
- @Proxy 后置处理类，用于bean的提升，使用参考用例



#### 使用教程
```shell
git clone git@gitee.com:woaianqi/node-ioc.git 
cd node-ioc && node ApplicationBoot.js
```
