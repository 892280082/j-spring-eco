源码:[j-spring](https://github.com/892280082/j-spring) 轻量级的IOC库.
源码:[j-spring-web](https://github.com/892280082/j-spring-web) 基于j-spring和express的WEB框架。



# 前言

j-spring-web就是换了壳的express，这个项目并没有重复创建轮子，只是对喜欢express的人提供了更多的选择。对于java程序员，肯定能闻到熟悉的配方和味道。


```js
import { spring,Component } from 'j-spring'
import {SpringMvcModule,Controller, Get, ResponseBody} from 'j-spring-mvc'
import { errorInfo } from 'j-spring-mvc/dist/springMvcExtends';

//控制器
@Controller('/api')
class ApiController {

    @Get()
    @ResponseBody()
    async hello(){
        throw 'requst error'
        return {msg:'hello'}
    }

}

//控制器集合
const controllerList = [ApiController]

spring.bindModule([SpringMvcModule,controllerList]).invokeStarter();
```


# 设计思路

## 1.底层框架选用

对于Node上面的WEB框架，我最喜欢的还是Express。

优点：
- 简单高效，并且具有函数式的美感。
- 生态丰富，拥有大量高质量的插件！
- 框架稳定，几乎没有坑。

缺点： 

- 逼格有点低，划重点。
- 不支持IOC和AOP
- 并且模块化不强，写起来散乱。
- 代码层面有美感，但是对于业务抽象描述能力不够。

## 2.优化方案

j-spring 提供IOC和AOP的能力，把express进行模块化的封装。

- 配置方面：定义ExpressConfiguration接口，提升模块化配置能力。
- 路由方面：定义@controller然后利用后置处理器进行解析，装配进express中

# 代码实现
代码会在过后的几个章节进行描述，其实也不多，毕竟只是加了一层壳。


# 代码展现

## 1.启动配置
```js

//1.SpringWeb 配置
const SpringWebModule = [
    SpringWebStarter, //web启动器
    ExpressAppEnhanceBeanProcessor, // express配置后置处理器
    ControllerBeanProcessor, // 控制器后置处理器
    SpringParamterBeanPostProcessor]; // 参数反射后置处理器 用于处理@RequestPram之类的

//2.express 配置
const springWebConfig = [
    EjsViewConfigruation,// ejs视图配置
    ExpressMemorySessionConfiguration // 内存session配置
]

//3.控制器
const controllerClassList = [
    StudentController, //学生路由控制器
    XiaoAiController //测试
]


spring.bindModule([
    SpringWebModule,
    springWebConfig,
    controllerClassList])
    .loadConfig({'indexMsg':'j-spring','root':__dirname}) //加载配置 
    .invokeStarter();//调用启动器
```

这里看到配置很多，主要是为了展示整个运行过程。其实1和2都可以放到j-spring-web里面作为默认配置一把到导出的。
例如
```js
const SpringWebBaseModule = [...SpringWebModule,...springWebConfig]

spring.bindModule([SpringWebBaseModule,controllerClassList]).loadConfig({...}).invokeStarter();
```

如果需要更换其中一个配置，就只需要使用j-spring的repalceClass方法即可。例如将session交由mysql存储，更换指定配置即可。


```js
spring.bindModule([SpringWebBaseModule,controllerClassList])
    .replaceClass(ExpressMemorySessionConfiguration,ExpressMysqlSeesionConfiguration) //更换依赖即可
```

## 2.如何定义express配置
只要继承ExpressConfiguration接口即可。这样该配置就可以使用j-spring容器的能力，包括自动注入和装配。你可以写无限多个配置类，然后统一在yaml里面编写配置参数即可。
```js
/**
 * ejs页面配置
 */
@Component()
export class EjsViewConfigruation implements ExpressConfiguration {

    @Value({path:'root',type:String})
    root:string;

    @Value({path:'express.viewPath',type:String,force:false})
    viewPath:string = 'view';

    load(app: any): void {
        app.set('views', path.join(this.root,this.viewPath));
        app.set('view engine', 'ejs');
    }
    
    isExpressConfiguration(): boolean {
        return true;
    }

}
//spring.bind(EjsViewConfigruation) 即可
```

## 3.设置路由
是不是熟悉的味道，嘿嘿。最大程度的还原了springWeb的编码风格。
- 页面渲染就是返回一个数组 [页面路径，渲染数据]
- @ResponseBody就单纯返回json信息。
- @PathVariable @RequestParam 跟java一致
- @Param(key:string) 拿到express控制器原始的req,res对象
- 这里的参数反射是支持异步的，并且可以在请求结束后，执行销毁操作。主要为了后期的事务操作。
```js
//定义控制器
@Controller('/student')
export class StudentController {

    @Autowired({clazz:StudentServiceImpl})
    service:StudentService;

    //页面渲染
    @Get()
    async index(){
        return ['index.ejs',{msg:'hello world'}]
    }

    //接口返回
    @Get('/getStudentInfo/:id')
    @ResponseBody()
    async getStudentInfo(
        @PathVariable('id') id:string,
        @RequestParam('name') name:string){
        return {id,name}
    }


    @Get()
    @ResponseBody()
    async addSessionName(@Param('session') session:any){
        session['name'] = 'xiaoAi'
        return {msg:'add success!'}
    }

}

```

## 4.如何使用中间件
```js
//定义中间件1
@Component()
class XiaoAiMustBeExist implements ExpressMiddleWare {
    isExpressMidldleWare(): boolean {
        return true;
    }
    invoke(req: any, res: any, next: Function): void {
        if(! req.session?.name){
            throw `xiaoai must be exist!`
        }
        next();
    }
    
}

//定义中间件2
@Component()
class OtherMiddleWare implements ExpressMiddleWare {...}

@Controller('xiaoai')
@ApiMiddleWare([XiaoAiMustBeExist])
export class XiaoAiController {

    @Get()
    @ResponseBody()
    @MiddleWare([OtherMiddleWare])
    async getXiaoAiName(@SessionAttribute('name') name:string){
        return {name}
    }


}
```

- 使用ExpressMiddleWare接口创建中间件.
- 使用@ApiMiddleWare 添加中间件到控制器的类上，可以作用于该控制器所有的方法。（常用如拦截器）
- 使用@MiddleWare也可以将中间件单独添加到方法上。
- @ApiMiddleWare + @MiddleWare 可以混合使用，执行顺序以定义顺序为准。


# 总结 
到这里j-spring-web就完成了，因为底层还是express，所以运行的还是相当稳定的。

j-spring-web包含了的优点以及优化了不足。

- 简单高效，并且具有函数式的美感。（express）
- 生态丰富，拥有大量高质量的插件！ （express）
- 框架稳定，几乎没有坑。（express）
- 支持IOC和AOP （j-spring）
- 支持模块化 (j-spring)
- 代码层面有美感 
- 业务抽象描述能力强