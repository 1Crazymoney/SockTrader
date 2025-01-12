import { Candle } from 'binance-api-node';
import { add } from 'date-fns';

export const binanceCandlesMock: Candle[] = [
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T20:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T20:00:00'), { minutes: 59 }).getTime(),
    open: '9594.33',
    high: '9640',
    low: '9561',
    close: '9592.42',
    volume: '367.99',
    quoteVolume: '3535531.88',
    baseAssetVolume: '367.99',
    quoteAssetVolume: '3535531.88',
    trades: 756,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T19:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T19:00:00'), { minutes: 59 }).getTime(),
    open: '9580.45',
    high: '9649.53',
    low: '9561.13',
    close: '9594.33',
    volume: '430.56',
    quoteVolume: '4135838.91',
    baseAssetVolume: '430.56',
    quoteAssetVolume: '4135838.91',
    trades: 26,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T18:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T18:00:00'), { minutes: 59 }).getTime(),
    open: '9600.17',
    high: '9601.95',
    low: '9474.74',
    close: '9580.45',
    volume: '1260.56',
    quoteVolume: '12025360.91',
    baseAssetVolume: '1260.56',
    quoteAssetVolume: '12025360.91',
    trades: 10,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T17:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T17:00:00'), { minutes: 59 }).getTime(),
    open: '9653.19',
    high: '9663.29',
    low: '9577',
    close: '9600.17',
    volume: '873.63',
    quoteVolume: '8411740.05',
    baseAssetVolume: '873.63',
    quoteAssetVolume: '8411740.05',
    trades: 0,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T16:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T16:00:00'), { minutes: 59 }).getTime(),
    open: '9710.19',
    high: '9829.13',
    low: '9637.49',
    close: '9653.19',
    volume: '727.82',
    quoteVolume: '7053453.28',
    baseAssetVolume: '727.82',
    quoteAssetVolume: '7053453.28',
    trades: 20,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T15:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T15:00:00'), { minutes: 59 }).getTime(),
    open: '9738.02',
    high: '9779.98',
    low: '9669.69',
    close: '9710.19',
    volume: '515.51',
    quoteVolume: '5014303.04',
    baseAssetVolume: '515.51',
    quoteAssetVolume: '5014303.04',
    trades: 500,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T14:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T14:00:00'), { minutes: 59 }).getTime(),
    open: '9750.42',
    high: '9830.77',
    low: '9728.28',
    close: '9738.02',
    volume: '626.42',
    quoteVolume: '6121460.06',
    baseAssetVolume: '626.42',
    quoteAssetVolume: '6121460.06',
    trades: 555,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T13:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T13:00:00'), { minutes: 59 }).getTime(),
    open: '9800',
    high: '9815.86',
    low: '9745',
    close: '9750.42',
    volume: '285.34',
    quoteVolume: '2788608.98',
    baseAssetVolume: '285.34',
    quoteAssetVolume: '2788608.98',
    trades: 0,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T12:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T12:00:00'), { minutes: 59 }).getTime(),
    open: '9820.01',
    high: '9847.63',
    low: '9787.32',
    close: '9800',
    volume: '159',
    quoteVolume: '1561175.2',
    baseAssetVolume: '159',
    quoteAssetVolume: '1561175.2',
    trades: 0,
  },
  {
    eventType: 'kline',
    interval: '1h',
    symbol: 'BTCUSDT',
    buyVolume: '0',
    quoteBuyVolume: '0',
    isFinal: true,
    eventTime: 0,
    firstTradeId: 0,
    lastTradeId: 0,
    startTime: new Date('2020-02-24T11:00:00').getTime(),
    closeTime: add(new Date('2020-02-24T11:00:00'), { minutes: 59 }).getTime(),
    open: '9755.86',
    high: '9850.26',
    low: '9676.22',
    close: '9820.01',
    volume: '528.06',
    quoteVolume: '5172365',
    baseAssetVolume: '528.06',
    quoteAssetVolume: '5172365',
    trades: 0,
  },
].reverse();
