import { spring } from 'j-spring';

export type TxParam = {
  isAutoStartTx: boolean;
};

export const Tx = (isAutoStartTx?: boolean) =>
  spring.paramterAnnotationGenerator(
    'sqlite-jdbc.Table',
    'NoName',
    { isAutoStartTx: isAutoStartTx === void 0 ? true : isAutoStartTx },
    Tx
  );
