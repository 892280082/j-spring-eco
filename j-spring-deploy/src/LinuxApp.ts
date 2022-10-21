import { AppManager } from './AppManager';
import { Shell } from './Shell';

export declare type Clazz<T> = {
  new (): T;
};

export abstract class LinuxApp {
  public shell: Shell; //命令
  public appManager: AppManager;

  /**
   * 是否单例
   */
  abstract isSingleton(): boolean;

  /**
   * 可执行程序名称
   */
  abstract getCommdName(): string;

  /**
   * 获取依赖 返回依赖的类信息
   */
  abstract getDepandenceList(): Clazz<LinuxApp>[];

  /**
   * 打印版本信息
   */
  abstract printVersion(): void; //打印版本

  /***
   * 安装逻辑
   */
  abstract install(): void; //安装逻辑实现
}
