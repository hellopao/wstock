declare module "wstock" {

    namespace wstock {
        interface Stock {
            /**
             * 股票代码
             */
            code: string;
            /**
             * 股票名称
             */
            name: string;
            /**
             * 今日开盘价格
             */
            open: string;
            /**
             * 昨日收盘价格
             */
            last_close: string;
            /**
             * 当前价格
             */
            current: string;
            /**
             * 今日最高价格
             */
            high: string;
            /**
             * 今日最低价格
             */
            low: string;
            /**
             * 涨幅
             */
            percentage: string;
        }

        function queryStockInfo(key: string): Promise<Array<Stock>>;

        function queryStockStatus(code: string): Promise<Stock>;

        function queryStockListStatus(): Promise<Array<Stock>>;

        function addStock(code: string): Promise<string>;

        function removeStock(code: string): Promise<string>;
    }
    export = wstock;
}