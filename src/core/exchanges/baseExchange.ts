import {Decimal} from "decimal.js-light";
import {EventEmitter} from "events";
import {alphabets as dict, numbers} from "nanoid-dictionary";
import generate from "nanoid/generate";
import {client as WebSocketClient, connection, IMessage} from "websocket";
import CandleCollection, {ICandle, ICandleInterval} from "../candleCollection";
import logger from "../logger";
import Orderbook, {IOrderbookEntry} from "../orderbook";
import {IOrder, OrderSide} from "../orderInterface";
import {IExchange} from "./exchangeInterface";

export interface IResponseMapper {
    onReceive(msg: IMessage): void;
}

export interface ITradeablePair {
    id: string;
    quantityIncrement: number;
    tickSize: number;
}

export interface IOrderbookData {
    ask: IOrderbookEntry[];
    bid: IOrderbookEntry[];
    sequence: number;
    symbol: string;
}

export default abstract class BaseExchange extends EventEmitter implements IExchange {
    public isAuthenticated: boolean = false;
    public isCurrenciesLoaded: boolean = false;
    public readonly abstract mapper: IResponseMapper;
    protected socketClient: WebSocketClient = new WebSocketClient();
    private candles: { [key: string]: CandleCollection } = {};
    private connection: connection | null = null;
    private currencies: ITradeablePair[] = [];
    private openOrders: IOrder[] = [];
    private orderbooks: { [key: string]: Orderbook } = {};
    private orderIncrement: number = 0;
    private orderInProgress: { [key: string]: boolean } = {};
    private ready: boolean = false;

    protected constructor() {
        super();

        this.onCreate();
    }

    public abstract adjustOrder(order: IOrder, price: number, qty: number): void;

    public buy(symbol: string, price: number, qty: number): string {
        return this.createOrder(symbol, price, qty, OrderSide.BUY);
    }

    public abstract cancelOrder(order: IOrder): void;

    public connect(connectionString: string): this {
        this.socketClient.on("connectFailed", (error) => logger.error("Connect Error: " + error.toString()));
        this.socketClient.on("connect", (conn: connection) => this.onConnect(conn));

        this.socketClient.connect(connectionString);

        return this;
    }

    public destroy(): void {
        this.removeAllListeners();
    }

    public emit(event: string | symbol, ...args: any[]): boolean {
        const result = super.emit(event, ...args);
        if (!result && process.env.NODE_ENV === "dev") {
            logger.debug(`No listener found for: "${event.toString()}"`);
        }

        return result;
    }

    /**
     * Factory function which will manage the candles
     */
    public getCandleCollection(pair: string, interval: ICandleInterval, updateHandler: (candles: CandleCollection) => void): CandleCollection {
        const key = `${pair}_${interval.code}`;
        if (this.candles[key]) {
            return this.candles[key];
        }

        this.candles[key] = new CandleCollection(interval);
        this.candles[key].on("update", updateHandler);
        return this.candles[key];
    }

    /**
     * Returns all open orders
     */
    public getOpenOrders = (): IOrder[] => this.openOrders;

    /**
     * Factory function which will manage the orderbooks
     * @param pair
     * @returns {Orderbook}
     */
    public getOrderbook(pair: string): Orderbook {
        if (this.orderbooks[pair]) {
            return this.orderbooks[pair];
        }

        const config = this.currencies.find((row) => row.id === pair);
        if (!config) {
            throw new Error(`No configuration found for pair: "${pair}"`);
        }

        const precision = new Decimal(config.tickSize).decimalPlaces();

        this.orderbooks[pair] = new Orderbook(pair, precision);
        return this.orderbooks[pair];
    }

    /**
     * Verify if the exchange is ready and trigger the "ready" event if ready.
     * Can be called multiple times.. it will trigger the "ready" event only once.
     */
    public isReady(): boolean {
        if (this.ready) {
            return this.ready;
        }

        if (this.isCurrenciesLoaded && this.isAuthenticated) {
            this.ready = true;
            this.emit("ready");
        }

        return this.ready;
    }

    /**
     * Authenticate user on exchange
     */
    public abstract login(publicKey: string, privateKey: string): void;

    public on(event: string, listener: (args: any[]) => void): this {
        if (process.env.NODE_ENV === "dev") {
            logger.debug(`Listener created for: "${event.toString()}"`);
        }
        return super.on(event, listener);
    }

    /**
     * Exchange created event. Bootstrap the exchange asynchronously
     */
    public onCreate(): void {
        setInterval(() => {
            this.orderIncrement = 0;
        }, 1000 * 60 * 5); // Reset increment every 5 minutes
    }

    public onCurrenciesLoaded(currencies: ITradeablePair[]): void {
        this.currencies = currencies;
        this.isCurrenciesLoaded = true;
        this.isReady();
    }

    // @TODO FIX ANY TYPE
    public onReport(data: any): void {
        const order: IOrder = data.params;
        const orderId = order.clientOrderId;

        this.setOrderInProgress(orderId, false);

        if (order.reportType === "replaced") {
            const oldOrderId = data.params.originalRequestClientOrderId;

            this.setOrderInProgress(oldOrderId, false);
            this.removeOrder(oldOrderId);
            this.addOrder(order); // Order is replaced with a new one
        } else if (order.reportType === "new") {
            this.addOrder(order); // New order created
        } else if (order.reportType === "trade" && data.params.status === "filled") {
            this.removeOrder(orderId); // Order is 100% filled
        } else if (["canceled", "expired", "suspended"].indexOf(order.reportType) > -1) {
            this.removeOrder(orderId); // Order is invalid
        }

        this.emit("app.report", data);
    }

    public abstract onUpdateCandles<K extends keyof CandleCollection>(pair: string, data: ICandle[], interval: ICandleInterval, method: Extract<K, "set" | "update">): void;

    public abstract onUpdateOrderbook<K extends keyof Orderbook>(data: IOrderbookData, method: Extract<K, "setOrders" | "addIncrement">): void;

    public sell(symbol: string, price: number, qty: number): string {
        return this.createOrder(symbol, price, qty, OrderSide.SELL);
    }

    /**
     * Send request over socket connection
     */
    public send(method: string, params: object = {}): void {
        const command = {method, params, id: method};
        if (this.connection === null) {
            throw new Error("First connect to the exchange before sending instructions..");
        }

        this.connection.send(JSON.stringify(command));
    }

    /**
     * Listen for new candles
     */
    public abstract subscribeCandles(pair: string, interval: ICandleInterval): void;

    /**
     * Listen for orderbook changes
     */
    public abstract subscribeOrderbook(pair: string): void;

    /**
     * Listen for actions that are happening on the remote exchange
     */
    public abstract subscribeReports(): void;

    /**
     * Add order to internal array
     */
    protected addOrder(order: IOrder): void {
        this.openOrders.push(order);
    }

    /**
     * Send order base function
     */
    protected createOrder(pair: string, price: number, qty: number, side: OrderSide): string {
        const orderId = this.generateOrderId(pair);
        this.setOrderInProgress(orderId);
        return orderId;
    }

    /**
     * Generates orderId based on trading pair, timestamp, increment and random string. With max length 32 characters
     * ex: 15COVETH1531299734778DkXBry9y-sQ
     * @param pair
     * @returns {string}
     */
    protected generateOrderId(pair: string): string {
        this.orderIncrement += 1;

        const alphabet: string = `${dict.english.lowercase}${dict.english.uppercase}${numbers}_-.|`;
        const orderId: string = `${this.orderIncrement}${pair}${new Date().getTime()}`;

        return orderId + generate(alphabet, 32 - orderId.length);
    }

    /**
     * Validates if adjusting an existing order on an exchange is allowed
     * @param order
     * @param price
     * @param qty
     */
    protected isAdjustingOrderAllowed(order: IOrder, price: number, qty: number): boolean {
        if (this.orderInProgress[order.clientOrderId]) {
            return false; // Order still in progress
        }

        if (order.price === price && order.quantity === qty) {
            return false; // Old order === new order. No need to replace!
        }

        this.setOrderInProgress(order.clientOrderId);
        return true;
    }

    /**
     * Load trading pair configuration
     */
    protected abstract loadCurrencies(): void;

    /**
     * Triggers when the exchange is connected to the websocket API
     */
    protected onConnect(conn: connection): void {
        this.connection = conn;
        this.connection.on("error", (error) => logger.error("Connection Error: " + error.toString()));
        this.connection.on("close", () => logger.info("Connection Closed"));
        this.connection.on("message", (data: IMessage) => this.mapper.onReceive(data));

        this.loadCurrencies();
    }

    /**
     * Remove order from internal array
     */
    protected removeOrder(orderId: string): void {
        this.openOrders = this.openOrders.filter((o) => o.clientOrderId !== orderId);
    }

    /**
     * Switch to set the state of an order
     */
    protected setOrderInProgress(orderId: string, state: boolean = true): void {
        if (state === false) {
            delete this.orderInProgress[orderId];
        } else {
            this.orderInProgress[orderId] = state;
        }
    }
}