"use strict";

const colors = require('colors');

const config = require('../config/config');

exports.showStockListStatus = listStatus => {
	let items = Object.keys(config.stockTermMap);

	const stdout = process.stdout;
	
	require('child_process').exec('cls');
	
	items.forEach(item => {
		stdout.write(config.stockTermMap[item])
		stdout.write('        ');
	});

	stdout.write('\n');

	listStatus.map(stock => {
		stock.rate = (100 * (stock.current / stock.opening - 1)).toFixed(2) + '%';
		return stock;
	}).forEach(stock => {
		let color = stock.current > stock.opening ? "red" : "green";
		items.forEach(item => {
			let data = stock[item];
			stdout.write(colors[color](data));
			stdout.write('    ');
		});

		stdout.write('\n');
	});
}