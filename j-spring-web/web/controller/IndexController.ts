import { Value } from 'j-spring';
import { CorresDomainMiidleWare, Request, Session } from '../../src';
import {
  Controller,
  Get,
  Post,
  RequestMapping,
  PathVariable,
  RequestParam,
  Render,
  MiddleWare,
  ApiRemark,
  Param,
  SessionAttribute,
} from '../../src/springWebAnnotation';
import { ArrayNumber } from '../../src';
import { Agent } from 'http';

class User {
  name: string;
  age: number;
}

@Controller('/')
export class IndexController {
  @Value({ path: 'indexMsg' })
  indexMsg: string;

  //测试1: 首页
  @Get('/')
  @Render('index.ejs')
  async index() {
    return { msg: `${this.indexMsg} => hello world!` };
  }

  //测试2: @Get 方法不加参数 默认使用方法名作为路径
  @Get()
  @MiddleWare([CorresDomainMiidleWare])
  async getMsg() {
    return 'Get msg ok';
  }

  @Get()
  @ApiRemark('测试query参数解析,添加session')
  async testQuery(
    @RequestParam('a') a: number,
    @RequestParam('ids') ids: ArrayNumber,
    @Param() req: Request,
    @Param() session: Session,
    @SessionAttribute('user', false) user?: User
  ) {
    console.log('user', user);
    session.set('user', { name: 'harry' });
    const sum = ids.reduce((s, a) => (s += a), 0);
    return { req: req ? 'yes' : 'no', a, sum, userName: user?.name };
  }

  //测试3: @Get 方法不加参数 默认使用方法名作为路径
  @Post()
  async postMsg() {
    return 'Post msg ok';
  }

  //测试4:  接受Get和Post方法

  @RequestMapping()
  async requestMsg() {
    return 'RequestMapping msg ok';
  }

  //测试5:  接受Get和Post方法 增加路径
  @RequestMapping('/requestMsgPath')
  async requestMsgPath() {
    return 'RequestMapping msg ok';
  }

  //测试6： 获取resful参数
  @Get('/query')
  async query(@RequestParam('data') data: string) {
    return { data };
  }

  //测试7 获取
  @Get('/path/:data')
  async path(@PathVariable('data') data: number) {
    return { data };
  }

  @Get('/mix/:user')
  async mix(
    @PathVariable('user') user: String,
    @RequestParam('msg') msg: String
  ) {
    return { user, msg };
  }
}
