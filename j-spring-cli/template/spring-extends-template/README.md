# spring-extends-template

## 提醒
j-spring框架专用包,普通Node程序无法引用!


## 安装

```shell
npm instlal spring-extends-template --save
```

## 1.添加模块配置文件
> app-[env].yaml

```yaml
j-spring:
  log:
    state: on
    level: info
# 添加扩展模块的配置
spring-extends-template:
  msg: "Hello world. yq!"
```

## 2. j-spring 项目中引用
```js
const {SpringBoot} = require("j-spring")
const {TemplateBeanScaner} = require("spring-extends-template")

new SpringBoot({
  ...,
	moduleList:[TemplateBeanScaner] ;//输入扫描器
})

```

## 3.可注入的bean
```js
//@SpringBoot
class Application {

	//just copy the code of next line is done!
	//@Autowired
	templateBean;

}
```
