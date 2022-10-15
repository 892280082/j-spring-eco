import {
  ApiRemark,
  Controller,
  Get,
  Param,
  Render,
  Request,
  Response,
} from '../../src';

@Controller('test')
export class TestController {
  @ApiRemark('获取id地址')
  @Get()
  getMsg(@Param() req: Request) {
    return `your ip address:${req.ip} ${req.fresh} ${req.closed} ${req.cookies} ${req.hostname}`;
  }

  @Render()
  testRedirect(@Param() res: Response) {
    res.redirect('/test/getMsg');
  }
}
