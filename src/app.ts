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

// List all used trading data brokers.
const tradingDataBrokers = [
    new WorldTradingData( apiTokens["worldtradingdata.com"] ),
    new AlphaVantage( apiTokens["alphavantage.co"] )
]

const searchSymbols = [ 'AAPL', 'GOOG' ]

// Fetch trading data from all brokers.
Promise.all( tradingDataBrokers.map(( broker, i ) =>
    broker.getTradingData( searchSymbols[i] ))
)
    .then(( allData ) => {
        // Display data using 3rd party library.
        // Again, there is a translation in data format in between.
        // Similarly as we can have any number of different data brokers, we could freely switch between the rendering library.

        const displayLibrary = new LCJS()
        displayLibrary.showTradingData( 'chart-container', 'Trading chart with multiple data brokers', ...allData )

    })
