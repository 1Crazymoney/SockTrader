import inquirer from "inquirer";
import LiveTrader from "../core/bot/liveTrader";
import {exchanges} from "../core/exchanges";
import {IExchange} from "../core/exchanges/exchangeInterface";
import {CandleInterval} from "../core/exchanges/hitBTC";
import config from "./../../config";
import {loadStrategy} from "./util";

export async function askForConfirmation(): Promise<boolean> {
    const {confirmation} = await inquirer.prompt([{
        type: "confirm",
        name: "confirmation",
        message: "Know that SockTrader cannot be held responsible for any losses. Are you sure you want to continue?",
    }]);

    return confirmation;
}

function createExchangeByName(exchangeName: string): IExchange | undefined {
    const exchange = exchanges.find(exch => exch.name.toLowerCase() === exchangeName.toLowerCase());
    if (!exchange) return undefined;

    const exchangeConfig = config.exchanges.find(exch => exch.name.toLowerCase() === exchangeName.toLowerCase());
    if (!exchangeConfig) return undefined;

    return new exchange.class(exchangeConfig.publicKey, exchangeConfig.secretKey);
}

export async function startLiveTrading(args: any) {
    const {strategy: strategyFilename, pair: tradingPair, exchange, force} = args;

    if (tradingPair.length !== 2) {
        throw new Error("The 'pair' argument should have exactly 2 values. Ex: --pair BTC USD");
    }

    if (!force) {
        const isConfirmed = await askForConfirmation();
        if (!isConfirmed) return console.log("We just saved you a few bucks. No harm is done, thank me later ;-)");
    }

    try {
        console.log("Enjoy trading! Hold on while we're preparing for a LIVE trading session.");

        const {default: strategy} = await loadStrategy(strategyFilename);

        const liveTrader = new LiveTrader()
            .addStrategy({
                strategy,
                pair: ["BTC", "USD"],
                interval: CandleInterval.ONE_HOUR, // @TODO make interval dynamic
            });

        const exchangeInstance = createExchangeByName(exchange);
        if (!exchangeInstance) throw new Error(`Could not find exchange: ${exchange}`);

        liveTrader.addExchange(exchangeInstance);

        // if (process.send) liveTrader.addReporter(new IPCReporter());

        await liveTrader.start();
    } catch (e) {
        console.error(e);
    }
}