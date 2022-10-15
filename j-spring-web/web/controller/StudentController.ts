import { Component } from 'j-spring';
import {
  ApiMiddleWare,
  ApiRemark,
  Controller,
  CorresDomainMiidleWare,
  ExpressMiddleWare,
  Get,
  MiddleWare,
  Param,
  PathVariable,
  RequestParam,
  SessionAttribute,
} from '../../src';

//定义控制器
@Controller('student')
@ApiMiddleWare([CorresDomainMiidleWare])
export class StudentController {
  //测试链接
  @ApiRemark('测试链接')
  @Get()
  async getConnectMsg() {
    return 'is-ok';
  }

  @Get('/testParamter/:a')
  async testParamter(
    @PathVariable('a') a: string,
    @RequestParam('b') b: string
  ) {
    return a + b;
  }

  //页面渲染
  @Get()
  async index() {
    return ['index.ejs', { msg: 'hello world' }];
  }

  //接口返回
  @Get('/getStudentInfo/:id')
  async getStudentInfo(
    @PathVariable('id') id: string,
    @RequestParam('name') name: string
  ) {
    return { id, name };
  }

  @Get()
  async addSessionName(@Param() session: any) {
    session['name'] = 'xiaoAi';
    return { msg: 'add success!' };
  }

  @Get()
  async toError() {
    throw 'xxxx';
  }

  @Get()
  @MiddleWare([
    (a, _b, n) => {
      a.query.bb = 1;
      n();
    },
  ])
  async testDiyMiddleWare(@RequestParam('bb') bb: number) {
    return bb;
  }
}

@Component()
class XiaoAiMustBeExist implements ExpressMiddleWare {
  isExpressMidldleWare(): boolean {
    return true;
  }
  invoke(req: any, _res: any, next: Function): void {
    if (!req.session?.name) {
      throw `xiaoai must be exist!`;
    }
    next();
  }
}

@Controller('xiaoai')
@ApiMiddleWare([XiaoAiMustBeExist])
export class XiaoAiController {
  @Get()
  async getXiaoAiName(@SessionAttribute('name') name: string) {
    return { name };
  }
}
