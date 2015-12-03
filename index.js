"use strict";

const fs = require('fs');
const qs = require('querystring');
const url = require('url');
const vm = require('vm');

const iconv = require('iconv-lite'); 
const request = require('./lib/request');

const config = require('./config/config');

/**
 * 读取股票代码配置
 */
function readStockCodeFile () {
	return new Promise((resolve,reject) => {
		fs.readFile(config.stockDataFile, (err,data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data.toString());
			}
		})
	})
}

/**
 * 更新股票代码配置
 */
function writeStockCodeFile (data) {
	return new Promise((resolve,reject) => {
		fs.writeFile(config.stockDataFile, data, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	})
}

/**
 * 根据股票名称获取股票详情
 */
function fetchStockInfoByName (name) {
	return request.get(config.stockAPI.query.replace(/\{stockName\}/,name))
}

/**
 * 根据股票代码获取股票详情
 */
function fetchStockInfoByCode (code) {
	return request.get(config.stockAPI.query.replace(/\{stockName\}/,code))
}

/**
 * 根据股票代码获取股票状态信息,支持多个
 */ 
function fetchStockStatus (code) {
	var isMulti = Array.isArray(code);
	if (isMulti) {
		code = code.join(',');
	}
	return request.get(config.stockAPI.info.replace(/\{code\}/,code))
}

exports.queryStockInfoByName = name => {
	return fetchStockInfoByName(name)
		.then(stockStr => {
			stockStr = vm.runInNewContext(stockStr); //index~code~name~shortname
			let stockInfo = stockStr.split('~');
			return {
				code: `${stockInfo[0]}${stockInfo[1]}`,
				name: stockInfo[2]
			};
		})
	
};

exports.queryStockInfoByCode = code => {
	code = code.replace(/^[^\d]+/,'');
	
	return fetchStockInfoByCode(code)
		.then(stockStr => {
			stockStr = vm.runInNewContext(stockStr); //index~code~indexname~...~name~shortname
			let stockInfo = stockStr.split('~');
			return {
				code: `${stockInfo[0]}${stockInfo[1]}`,
				name: stockInfo[6]
			};
		})
};

exports.queryStockStatus = code => {
	return fetchStockStatus(code)
		.then(stockStr => {
			stockStr = vm.runInNewContext(stockStr.replace(/^var/,''));
			let status = stockStr.split(',');
			return {
				code: code,
				name: status[0],
				opening: status[1],
				closing: status[2],
				current: status[3],
				max: status[4],
				min: status[5]
			}
		})
};

exports.queryStockListStatus = () => {
	return readStockCodeFile()
		.then(data => {
			let stockData = JSON.parse(data);
			
			let codes = stockData.map(stock => stock.code);
			
			return fetchStockStatus(codes)
				.then(stockStr => {
					let stocks = stockStr
						.split(/\n/)
						.filter(str => str)
						.map(str => vm.runInNewContext(str.replace(/^var/,'')));
					
					let stockStatus = stocks.map((statusStr,index) => {
						let status = statusStr.split(',');
						return {
							code: codes[index],
							name: status[0],
							opening: status[1],
							closing: status[2],
							current: status[3],
							max: status[4],
							min: status[5]
						}
					});
					
					return stockStatus;
				})
		})
};

exports.addStock = code => {
	
	return Promise.all([readStockCodeFile(),exports.queryStockInfoByCode(code)])
		.then(results => {
			let stockData = JSON.parse(results[0]);
			let stockInfo = results[1];
			
			stockData = stockData.filter(item => item.code !== stockInfo.code).concat({
				name: stockInfo.name,
				code: code
			});
			
			return writeStockCodeFile(JSON.stringify(stockData))	
				.then(()=>"添加股票代码成功")
		})
};

exports.removeStock = code => {
	return readStockCodeFile()
		.then(data => {
			let stockData = JSON.parse(data);
			
			var index = stockData.findIndex(item => code === item.code);
			
			if (index !== -1) {
				stockData.splice(index,1);
				return writeStockCodeFile(JSON.stringify(stockData))	
					.then(()=>"删除股票代码成功")
			} else {
				return "列表中无此股票代码";
			}
		})
}