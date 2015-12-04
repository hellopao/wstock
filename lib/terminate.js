"use strict";

const colors = require('colors');

const config = require('../config/config');

/**
 * 字符串右边补空白
 */
function padRight (str,len) {
	let strLen = str.length;
	let cnWords = str.match(/[\u4e00-\u9fa5]/g);
	//中文词按两个字符算
	if (cnWords) {
		strLen += cnWords.length;
	}
	len = Math.max(strLen,len);
	return str + Array(len - strLen + 1).join('0').replace(/0/g,' ');
}

/**
 * 显示配置表里的股票状态
 */
exports.showStockListStatus = listStatus => {
	exports.clearScreen();
	
	const stdout = process.stdout;
	let items = Object.keys(config.stockTermMap);
	
	items.forEach(item => {
		stdout.write(padRight(config.stockTermMap[item],10));
	});

	stdout.write('\n');

	listStatus.map(stock => {
		stock.percentage += "%"; 
		return stock;
	}).forEach(stock => {
		let color = stock.percentage.startsWith('-') ? "green" : "red";
		items.forEach(item => {
			let str = padRight(stock[item],10);
			stdout.write(colors[color](str));
		});

		stdout.write('\n');
	});
};

/**
 * 显示股票状态
 */
exports.showStockStatus = stockStauts => {
	exports.showStockListStatus([stockStauts]);
};

/**
 * 显示股票信息
 */
exports.showStockInfo = stocks => {
	const stdout = process.stdout;
	
	let items = ['name','code'];
	
	items.forEach(item => {
		stdout.write(padRight(config.stockTermMap[item],10));
	});
	
	stdout.write('\n');
	
	stocks.forEach(stock => {
		items.forEach(item => {
			let str = padRight(stock[item],10);
			stdout.write(str);
			stdout.write(' ');
		});
		stdout.write('\n');
	})
	
};

exports.showMsg = msg => {
	process.stdout.write(colors.red(msg));
};

exports.clearScreen = function(){
	if (process.platform === "win32") {
		//clear console in windows : http://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console
		process.stdout.write("\u001b[2J\u001b[0;0H");
	} else {
		//process.stdout.write('\033[2J');
	}
	
};