import { TradingData } from "./data";

/**
 * Interface that describes a provider for trading data.
 */
export interface TradingDataProvider {
    /**
     * Fetch trading data.
     *
     * This demo implementation always searchs for one day of data, with a broker-specific data interval.
     * @param   searchName  Search string. Generally a stock name, like "AAPL" (Apple Inc.) or "GOOG" (Google).
     * @return              Asynchronous Promise for TradingData.
     */
    getTradingData( searchName: string ): Promise<TradingData>
}
