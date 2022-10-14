import { convertToWhere, convertSearch } from './springTxUtil';
import {
  EntityManager,
  Repository,
  PrimaryColumn,
  Generated,
  EntityTarget,
  CreateDateColumn,
  FindOptionsRelations,
  FindOptionsOrder,
} from 'typeorm';
import { TxParam } from './annotation';

type EntityOption<T> = {
  [P in keyof T]?: T[P];
};

type EntityList = BaseEntity<any> | BaseEntity<any>[];

export class BaseEntity<T> {
  of(prop?: EntityOption<T>) {
    if (prop) {
      Object.assign(this, prop);
    }
    return this;
  }

  @PrimaryColumn()
  @Generated()
  id: number;

  @CreateDateColumn()
  crateTime: Date;
}

export abstract class BaseSearch<
  T extends BaseEntity<T>,
  S extends BaseSearch<T, S>
> {
  constructor(public readonly entityTarget: EntityTarget<T>) {}

  curPage: number = 1;

  pageSize: number = 20;

  of(prop?: EntityOption<S>) {
    if (prop) {
      Object.assign(this, prop);
    }
    return this;
  }

  find(tx: SpringTx): Promise<T[]> {
    return tx.e.find(this.entityTarget, { where: convertToWhere(this) });
  }

  //关联对象
  $relations: FindOptionsRelations<T> = {};

  //级联查询策略
  $relatirelationLoadStrategy?: 'join' | 'query' = 'query';

  //缓存策略
  $cache?:
    | boolean
    | number
    | {
        id: any;
        milliseconds: number;
      };

  //sql注释
  $comment: string;

  //排序
  $order?: FindOptionsOrder<T>;

  //是否分页
  $isUsePagin: boolean = false;

  order(r: FindOptionsOrder<T>) {
    this.$order = r;
    return this;
  }

  comment(r: string) {
    this.$comment = r;
    return this;
  }

  cache(
    r:
      | boolean
      | number
      | {
          id: any;
          milliseconds: number;
        }
  ) {
    this.$cache = r;
    return this;
  }

  relation(r: FindOptionsRelations<T>) {
    this.$relations = r;
    return this;
  }

  relatirelationLoadStrategy(r?: 'join' | 'query') {
    this.$relatirelationLoadStrategy = r;
    return this;
  }

  usePagin() {
    this.$isUsePagin = true;
    return this;
  }
}

export class SpringTx {
  constructor(
    public readonly e: EntityManager,
    public readonly txParam: TxParam
  ) {}

  private getRepository(entity: BaseEntity<any>): Repository<any> {
    const clazz = (entity as any).constructor;
    return this.e.getRepository(clazz);
  }

  private getRepositoryBySearch(search: BaseSearch<any, any>): Repository<any> {
    return this.e.getRepository(search.entityTarget);
  }

  private async doOperate(
    entity: EntityList,
    op: (r: Repository<any>, b: any) => Promise<void>
  ) {
    let ds = Array.isArray(entity) ? entity : [entity];
    for (let p of ds) {
      const r = this.getRepository(p);
      await op(r, p);
    }
  }

  save(entity: EntityList): Promise<void> {
    return this.doOperate(entity, (r, b) => r.save(b));
  }

  remove(entity: EntityList): Promise<void> {
    return this.doOperate(entity, (r, b) => r.remove(b));
  }

  update(entity: EntityList): Promise<void> {
    return this.doOperate(entity, async (r, b) => {
      await r.update({ id: b.id }, b);
    });
  }

  //获取id集合
  async getIds<T extends BaseEntity<T>>(
    search: BaseSearch<T, any>
  ): Promise<number[]> {
    const entityList = await this.e.find(search.entityTarget, {
      where: convertToWhere(search),
      select: ['id'],
    });
    return entityList.map(e => e.id);
  }

  //批量更新
  async batchUpdate<T extends BaseEntity<T>>(
    search: BaseSearch<T, any>,
    partEntity: EntityOption<T>
  ): Promise<number> {
    const r = this.getRepositoryBySearch(search);
    const ids = await this.getIds(search);
    for (let id of ids) {
      await r.update({ id }, partEntity);
    }
    return ids.length;
  }

  //批量删除
  async batchRemove<T extends BaseEntity<T>>(
    search: BaseSearch<T, any>
  ): Promise<number> {
    const r = this.getRepositoryBySearch(search);
    const ids = await this.getIds(search);
    for (let id of ids) {
      await r.delete(id);
    }
    return ids.length;
  }

  find<T extends BaseEntity<T>>(search: BaseSearch<T, any>): Promise<T[]> {
    const searchParam = convertSearch(search);
    return this.e.find(search.entityTarget, searchParam);
  }

  //查询
  query(query: string, parameters?: any[]): Promise<any> {
    return this.e.query(query, parameters);
  }

  startTransaction() {
    this.e.queryRunner?.startTransaction();
  }
  rollbackTransaction() {
    this.e.queryRunner?.rollbackTransaction();
  }
  commitTransaction() {
    this.e.queryRunner?.commitTransaction();
  }
}

export class SpringDataSource extends SpringTx {
  constructor(public readonly e: EntityManager) {
    super(e, { isAutoStartTx: false });
  }
}
