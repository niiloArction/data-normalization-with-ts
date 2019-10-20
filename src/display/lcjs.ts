import { TradingChart } from "../internal/display";
import { TradingData } from "../internal/data";
import { lightningChart, AxisTickStrategies, OHLCFigures, OHLCFigure, DataPatterns } from "@arction/lcjs"

/**
 * Implementation of a trading chart utilizing *LightningChart JS*.
 */
export class LCJS implements TradingChart {

    /**
     * @param   licenseKey  Optional license key for LCJS. If not supplied, then Community Edition is used.
     */
    constructor( readonly licenseKey?: string ) {}

    // Implement TradingChart
    /**
     * Show a arbitrarily long list of TradingData items.
     *
     * This can contain data from different origins, as well as different ranges and precisions.
     * @param   containerId     ID of container HTML element.
     * @param   title           Chart title.
     * @param   allData         List of TradingData to show.
     */
    showTradingData( containerId: string, title: string, ...allData: TradingData[] ): void {
        const dateOrigin = new Date()

        // Create LCJS ChartXY.
        const chart = lightningChart().ChartXY({
            containerId,
            defaultAxisXTickStrategy: AxisTickStrategies.DateTime( dateOrigin )
        })
            .setTitle( title )

        const xAxis = chart.getDefaultAxisX()
            .setAnimationScroll( undefined )

        chart.getDefaultAxisY().dispose()

        // Create an OHLCSeries per each TradingData.
        allData.forEach(( data, i ) => {
            // Own Y Axis for each series, because price ranges might be very different.
            const yAxis = chart.addAxisY()

            const ohlcSeries = chart.addOHLCSeries<OHLCFigure>({
                yAxis,
                positiveFigure: ((i % 2 === 0)? OHLCFigures.Candlestick : OHLCFigures.Bar)
            })
                .setName( `${data.stockName} - ${data.origin}` )

            // Map values into a format that LCJS expects.
            ohlcSeries.add(
                // OHLCSeries expects an Array of ordered number tuples [ Time, Open, High, Low, Close ]
                // where "Time" is a Date as milliseconds since Date origin (as JS Date does).
                data.values.map<[ number, number, number, number, number ]>(( tradingDataItem ) =>
                    [
                        // Supply DateTime as milliseconds since Date origin.
                        tradingDataItem.dateTime.getTime() - dateOrigin.getTime(),
                        tradingDataItem.open,
                        tradingDataItem.high,
                        tradingDataItem.low,
                        tradingDataItem.close
                    ]
                )
            )

            // Set Cursor formatting.
            ohlcSeries.setResultTableFormatter(( builder, series, ohlc ) => builder
                .addRow( data.stockName )
                .addRow( data.origin )
                .addRow( 'Time', '', series.axisX.formatValue( ohlc.getPosition() ) )
                .addRow( 'Open', '', series.axisY.formatValue( ohlc.getOpen() ) )
                .addRow( 'High', '', series.axisY.formatValue( ohlc.getHigh() ) )
                .addRow( 'Low', '', series.axisY.formatValue( ohlc.getLow() ) )
                .addRow( 'Close', '', series.axisY.formatValue( ohlc.getClose() ) )
            )
        })

    }


}
