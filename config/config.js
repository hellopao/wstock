"use strict";

const path = require('path');

exports.stockAPI = {
    query: "http://xueqiu.com/stock/search.json?code={key}",
    info: "http://xueqiu.com/v4/stock/quote.json?code={code}",
    site: "http://xueqiu.com"
};

exports.stockDataFile = path.join(__dirname, "./stock.json");

exports.stockTermMap = {
    "name": "股票名称",
    "code": "股票代码",
    "open": "今日开盘",
    "last_close": "昨日收盘",
    "current": "当前价格",
    "high": "今日最高",
    "low": "今日最低",
    "percentage": "今日涨幅"
};

exports.stockCheckInterval = 5000;
