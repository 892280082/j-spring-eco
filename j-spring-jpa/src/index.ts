import {SqliteStarter} from './starter'
import {TxParamInteceptor} from './interceptor'

export * from './annotation'
export { loadEntity } from './starter'
export { BaseEntity,BaseSearch } from './springTx'
export const SqliteModule = [SqliteStarter,TxParamInteceptor]