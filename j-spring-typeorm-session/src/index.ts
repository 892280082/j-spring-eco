import { Autowired, Component, SpringBean, Value } from 'j-spring';
import { ExpressConfiguration, ExpressApp } from 'j-spring-web';
import { BaseEntity, Column, DataSource, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity, TypeormStore } from 'typeorm-store';
import { loadEntity } from 'j-spring-jpa';
import session from 'express-session';

@Entity()
class ExpressSessioin extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  data: string;
}

@Component()
export class JSpringTypeOrmSession implements ExpressConfiguration, SpringBean {
  @Autowired()
  dataSource: DataSource;

  @Value({
    path: 'express.session.secret',
    force: false,
    remark: 'session密钥',
  })
  secret: string = 'kity';

  @Value({
    path: 'express.session.maxAge',
    force: false,
    remark: '有效时间,默认1h',
  })
  maxAge: number = 1000 * 60 * 60;

  onBeanInit(): void {
    loadEntity([ExpressSessioin]);
  }
  onAttrMounted(): void {}
  load(app: ExpressApp): void {
    const repository = this.dataSource.getRepository(ExpressSessioin);
    app.use(
      session({
        secret: this.secret,
        resave: false,
        saveUninitialized: false,
        store: new TypeormStore({ repository }),
        cookie: {
          maxAge: this.maxAge,
        },
      })
    );
  }
  isExpressConfiguration(): boolean {
    return true;
  }
  isSpringBean(): boolean {
    return true;
  }
}
