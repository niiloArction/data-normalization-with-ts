import { TradingData } from "./data";

/**
 * Interface that describes a stand-alone trading chart display.
 */
export interface TradingChart {
    /**
     * Show a arbitrarily long list of TradingData items.
     *
     * This can contain data from different origins, as well as different ranges and precisions.
     * @param   containerId     ID of container HTML element.
     * @param   title           Chart title.
     * @param   data            List of TradingData to show.
     */
    showTradingData( containerId: string, title: string, ...data: TradingData[] ): void
}
