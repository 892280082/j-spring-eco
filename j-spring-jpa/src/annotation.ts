import { spring } from 'j-spring'


export const Table = () => spring.classAnnotationGenerator('sqlite-jdbc.Table',{},Table);

export const Tx = () => spring.paramterAnnotationGenerator('sqlite-jdbc.Table','NoName',{},Tx);