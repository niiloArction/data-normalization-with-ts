import { TradingDataProvider } from "../internal/provider";
import { TradingData, TradingDataItem } from "../internal/data";

/**
 * Implementation of a trading data broker that utilizes worldtradingdata.com online API.
 */
export class WorldTradingData implements TradingDataProvider {
    /**
     * @param   apiToken    API token for worldtradingdata.com
     *                      One can be received for free at https://www.worldtradingdata.com/register
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
        // Form API parameters according to worldtradingdata.com API documentation
        // https://www.worldtradingdata.com/documentation#stock-and-index-intraday
        /**
         * Sorting basis.
         */
        const sort: 'asc' | 'desc' | 'newest' | 'oldest' = 'asc'
        /**
         * Number of minutes between data points.
         */
        const interval: string = '15'
        /**
         * Number of days data is returned for.
         */
        const range: string = '4'

        return new Promise(( resolve, reject ) => {
            // Make fetch request to worldtradingdata.com
            fetch(`https://www.worldtradingdata.com/api/v1/intraday?interval=${interval}&range=${range}&sort=${sort}&symbol=${searchName}&api_token=${this.apiToken}`)
                // Parse JSON response.
                .then(( response ) => response.json() )
                // Normalize data to internal format.
                .then( this.normalizeDataToInternalFormat )
                .then( resolve )
        })
    }

    /**
     * Logic that handles normalization of worldtradingdata.com data to internal format.
     * @param   data    Data in worldtradingdata.com format.
     * @return          Same data in internal format.
     */
    private readonly normalizeDataToInternalFormat = ( data: WorldTradingDataIntradayData ): TradingData => {
        const origin = "worldtradingdata.com"
        const stockName: string = data.symbol
        let values: TradingDataItem[]

        // Map OHLC values to internal format.
        const valueKeys = Object.keys( data.intraday )
        values = valueKeys.map(( key ) => {
            const value = data.intraday[ key ]
            return { 
                // Property key is UTC formatted date.
                dateTime: new Date( key ),
                // OHLC values must be parsed from String to Number.
                open: Number( value.open ),
                high: Number( value.high ),
                low: Number( value.low ),
                close: Number( value.close )
            }
        })

        return { origin, stockName, values }
    }

}
/**
 * Interface that defines the format used by worldtradingdata.com when returning INTRADAY data.
 * 
 * This was written according to the actual values returned by worldtradingdata.com API.
 */
interface WorldTradingDataIntradayData {
    /**
     * The actual trading data.
     *
     * This is a JS object whose property keys are all UTC Dates.
     * Each property value is a JS object, with OHLC values, as well as a "volume" value.
     */
    intraday: {
        [key: string]: {
            close: string
            high: string
            low: string
            open: string
            volume: string
        }
    }
    /**
     * The same search symbol that was used in the request.
     *
     * Eq. "AAPL"
     */
    symbol: string
    /**
     * Some kind of identifier.
     *
     * Eq. "NASDAQ"
     */
    stock_exchange_short: string
    /**
     * A time-zone name. Not certain whether it is based on the origin of the stock data, or the company behind the stock in question.
     *
     * Eq. "America/New_York"
     */
    timezone_name: string
}
