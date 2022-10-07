import { Component } from "j-spring";
import { ApiMiddleWare, Controller, ExpressMiddleWare, Get, Param, PathVariable, RequestParam, ResponseBody, SessionAttribute } from "../../src";



//定义控制器
@Controller('student')
export class StudentController {

    //测试链接
    @Get()
    @ResponseBody()
    async getConnectMsg(){
        return 'is-ok';
    }

    @Get('/testParamter/:a')
    @ResponseBody()
    async testParamter(@PathVariable('a') a:string,@RequestParam('b') b:string){
        return a+b;
    }

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


    @Get()
    async toError(){
        throw 'xxxx';
    }

}


@Component()
class XiaoAiMustBeExist implements ExpressMiddleWare {
    isExpressMidldleWare(): boolean {
        return true;
    }
    invoke(req: any, _res: any, next: Function): void {
        if(! req.session?.name){
            throw `xiaoai must be exist!`
        }
        next();
    }
    
}


@Controller('xiaoai')
@ApiMiddleWare([XiaoAiMustBeExist])
export class XiaoAiController {

    @Get()
    @ResponseBody()
    async getXiaoAiName(@SessionAttribute('name') name:string){
        return {name}
    }


}