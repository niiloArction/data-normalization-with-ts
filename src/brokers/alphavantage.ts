import { TradingDataProvider, TradingData, TradingDataItem } from "../internal/trading";

/**
 * Implementation of a trading data broker that utilizes alphavantage.co online API.
 */
export class AlphaVantage implements TradingDataProvider {
    /**
     * @param   apiToken    API token for alphavantage.co
     *                      One can be received for free at https://www.alphavantage.co/support/#api-key
     */
    constructor( readonly apiToken: string ) {}

    // Implement TradingDataProvider
    /**
     * Fetch trading data.
     *
     * This demo implementation always searchs for one day of data, with a broker-specific data interval.
     * @param   searchName  Search string. Generally a stock name, like "AAPL" (Apple Inc.) or "GOOG" (Google).
     * @return              Asynchronous Promise for TradingData.
     */
    getTradingData( searchName: string ): Promise<TradingData> {
        // Form API parameters according to alphavantage.co API documentation
        // https://www.alphavantage.co/documentation/
        /**
         * Number of minutes between data points.
         *
         * alphavantage.co API supports the following options: '1min' | '5min' | '15min' | '30min' | '60min'
         * but this broker only implements the 15min option ( the returned data format varies based on this! ).
         */
        const interval: '15min' = '15min'
        /**
         * **compact**
         *      returns only the latest 100 data points in the intraday time series.
         * 
         * **full**
         *      returns the full-length intraday time series.
         *
         * The "compact" option is recommended if you would like to reduce the data size of each API call.
         */
        const outputsize: 'compact' | 'full' = 'compact'

        return new Promise(( resolve, reject ) => {
            // Make fetch request to alphavantage.co
            fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=${interval}&outputsize=${outputsize}&symbol=${searchName}&apikey=${this.apiToken}`)
                // Parse JSON response.
                .then(( response ) => response.json() )
                // Normalize data to internal format.
                .then( this.normalizeDataToInternalFormat )
                .then( resolve )
        })
    }

    /**
     * Logic that handles normalization of alphavantage.co data to internal format.
     * @param   data    Data in alphavantage.co format.
     * @return          Same data in internal format.
     */
    private readonly normalizeDataToInternalFormat = ( data: AlphaVantageIntradayData15Min ): TradingData => {
        const stockName: string = data["Meta Data"]["2. Symbol"]
        let values: TradingDataItem[]

        // Map OHLC values to internal format.
        const valueKeys = Object.keys( data["Time Series (15min)"] )
        values = valueKeys.map(( key ) => {
            const value = data["Time Series (15min)"][ key ]
            return { 
                // Property key is UTC formatted date.
                dateTime: new Date( key ),
                // OHLC values must be parsed from String to Number.
                open: Number( value["1. open"] ),
                high: Number( value["2. high"] ),
                low: Number( value["3. low"] ),
                close: Number( value["4. close"] )
            }
        })

        return { stockName, values }
    }

}
/**
 * Interface that defines the format used by alphavantage.co when returning INTRADAY data (specifically for 15min interval).
 *
 * This was written according to the actual values returned by alphavantage.co API.
 */
interface AlphaVantageIntradayData15Min {
    /**
     * The actual trading data.
     *
     * This is a JS object whose property keys are all UTC Dates.
     * Each property value is a JS object, with OHLC values, as well as a "volume" value.
     */
    "Time Series (15min)": {
        [key: string]: {
            "1. open": string
            "2. high": string
            "3. low": string
            "4. close": string
            "5. volume": string
        }
    }
    /**
     * Meta Data of the search.
     */
    "Meta Data": {
        /**
         * Eq. "Intraday (15min) open, high, low, close prices and volume"
         */
        "1. Information": string
        /**
         * Used search symbol.
         *
         * Eq. "AAPL"
         */
        "2. Symbol": string
        /**
         * UTC Date.
         *
         * Eq. "2019-10-18 16:00:00"
         */
        "3. Last Refreshed": string
        /**
         * Used search interval.
         *
         * Eq. "15min"
         */
        "4. Interval": string
        /**
         * Used output size.
         *
         * Eq. "Compact"
         */
        "5. Output Size": string
        /**
         * Name of a time zone.
         *
         * Eq. "US/Eastern"
         */
        "6. Time Zone": string
    }
}
