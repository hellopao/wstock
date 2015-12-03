"use strict";

const path = require('path');

exports.stockAPI = {
	query : "http://smartbox.gtimg.cn/s3/?q={stockName}&t=all",
	info: "http://hq.sinajs.cn/list={code}"
};

exports.PROXY = {
    "TIMEOUT": 30000,
    "DEBUG": false,
    "DEBUG_SERVER": {
        "HOST": "127.0.0.1",
        "PORT": 8888
    }
};

exports.stockDataFile = path.join(__dirname,"../stock.json");

exports.stockTermMap = {
    "name": "股票名称",
    "code": "股票代码",
    "opening": "今日开盘",
    "closing": "昨日收盘",
    "current": "当前价格",
    "max": "今日最高",
    "min": "今日最低",
    "rate": "今日涨幅"
};

exports.stockCheckInterval = 5000;
