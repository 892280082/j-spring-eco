import { spring } from 'j-spring'

export type TxParam = {
    isStartTx:boolean
}

export const Tx = (isStartTx?:boolean) => spring.paramterAnnotationGenerator('sqlite-jdbc.Table','NoName',{isStartTx:!!isStartTx},Tx);