import { spring } from 'j-spring';
import { sqliteModule } from 'j-spring-jpa';
import {
  ApiRemark,
  Controller,
  Get,
  Param,
  Session,
  SessionAttribute,
  springWebModule,
} from 'j-spring-web';
import { JSpringTypeOrmSession } from '../src';

@Controller('testSession')
class TestSessionController {
  @ApiRemark('测试session装配')
  @Get()
  async toTestSeesion(
    @Param() session: Session,
    @SessionAttribute('user', false) user: string
  ) {
    if (user === void 0) session.set('user', 'user is set!');
    return { msg: 'request ok', user };
  }
}

spring
  .bindModule([
    sqliteModule,
    springWebModule,
    [JSpringTypeOrmSession, TestSessionController],
  ])
  .invokeStarter();
