import {  Value } from 'j-spring';
import {Controller,Get, Post, RequestMapping, PathVariable, RequestParam} from '../../src/springWebAnnotation'


@Controller('/')
export class IndexController {

    @Value({path:'indexMsg',type:String})
    indexMsg:string;

    //测试1: 首页
    @Get('/')
    async index(){
        return `${this.indexMsg} => hello world!`
    }

    //测试2: @Get 方法不加参数 默认使用方法名作为路径
    @Get()
    async getMsg(){
        return 'Get msg ok'
    }

    //测试3: @Get 方法不加参数 默认使用方法名作为路径
    @Post()
    async postMsg(){
        return 'Post msg ok'
    }

    //测试4:  接受Get和Post方法
    
    @RequestMapping()
    async requestMsg(){
        return 'RequestMapping msg ok'
    }

    //测试5:  接受Get和Post方法 增加路径
    @RequestMapping('/requestMsgPath')
    async requestMsgPath(){
        return 'RequestMapping msg ok'
    }

    //测试6： 获取resful参数
    @Get('/query')
    async query(@RequestParam('data',String) data:string){
        return {data};        
    }

    //测试7 获取
    @Get('/path/:data')
    async path(@PathVariable('data',Number) data:number){
        return {data};        
    }

    @Get('/mix/:user')
    async mix(@PathVariable('user') user:String, @RequestParam('msg') msg:String){
        return {user,msg}        
    }

}
