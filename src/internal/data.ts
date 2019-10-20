
/**
 * Interface that describes trading data.
 */
export interface TradingData {
    /**
     * Origin of data.
     *
     * Eq. "worldtradingdata.com"
     */
    readonly origin: string
    /**
     * Name of stock.
     *
     * Eq. "AAPL"
     */
    readonly stockName: string
    /**
     * Trading values.
     *
     * Each item is from a different point in time (assume to be in sorted order, oldest first).
     */
    readonly values: TradingDataItem[]
}
/**
 * Interface that describes a single "unit" of *TradingData*.
 */
export interface TradingDataItem {
    /**
     * Date.
     */
    readonly dateTime: Date
    /**
     * Open value (price of stock at start of counting period).
     */
    readonly open: number
    /**
     * High value (highest price of stock during counting period).
     */
    readonly high: number
    /**
     * Low value (lowest price of stock during counting period).
     */
    readonly low: number
    /**
     * Close value (price of stock at end of counting period).
     */
    readonly close: number
}
