import {SqliteStarter} from './starter'
import {TxParamInteceptor} from './interceptor'

export { BaseEntity,BaseSearch } from './springTx'

export * from './annotation'

export const SqliteModule = [SqliteStarter,TxParamInteceptor]