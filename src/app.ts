// Read API tokens from file.
const apiTokens = require('../api-tokens.json')
import { WorldTradingData } from "./brokers/wtc";
import { AlphaVantage } from "./brokers/alphavantage";
import { LCJS } from "./display/lcjs";

/**
 * fetches real-time data from a group of online broker APIs and normalizes the data into a single format.
 *
 * This data is then transformed again to a suitable format that can be used to display it with a third-party library.
 */

// Request data using internal data broker interfaces.
// The format is always normalized to an internal format (src/internal/trading.ts)
// This enables the application to always work with whatever data format it prefers, regardless of its origin.

// List of all used trading data brokers.
const tradingDataBrokers = [
    new WorldTradingData( apiTokens["worldtradingdata.com"] ),
    new AlphaVantage( apiTokens["alphavantage.co"] )
]

// Fetch trading data from all brokers. Use different stock, so the data is different. 
const searchSymbols = [ 'AAPL', 'GOOG' ]
Promise.all( tradingDataBrokers.map(( broker, i ) =>
    broker.getTradingData( searchSymbols[i] ))
)
    .then(( allData ) => {
        // Display data using a 3rd party library abstraction interface.
        const displayLibrary = new LCJS()
        displayLibrary.showTradingData(
            'chart-container',
            'Trading chart with multiple data brokers',
            ...allData
        )
    })
