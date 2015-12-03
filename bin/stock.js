#!/usr/bin/env node
"use strict";

const fs = require('fs');
const http = require('http');
const path = require('path');

const program = require('commander');

const stock = require('../index');
const teminate = require('../lib/terminate');
const config = require('../config/config');

program	
	.version('0.0.1')

program
	.command('query <name|code>')
	.description('search stock code by name or code')
	.action(name => {
		let query;
		if (/\d+$/.test(name)) {
			query = stock.queryStockInfoByCode;
		} else {
			query = stock.queryStockInfoByName;
		}
		
		query(name)
			.then(stockInfo => {
				console.log(stockInfo.name);
			})
		
	})	
	
program
	.command('show <code>')	
	.description('show stock status by code')	
	.action(code => {
		stock.queryStockStatus(code)
			.then(info => {
				console.log(info);
			})
	})	
	
program	
	.command('list')
	.description('show the stock status list')	
	.action(()=>{
		setInterval(()=> {
			stock.queryStockListStatus()
				.then(listStatus => {
					teminate.showStockListStatus(listStatus);
				})
		},config.stockCheckInterval);
	})	
	
program
	.command('add <code>')
	.description('add stock to stock list')	
	.action(code => {
		stock.addStock(code)
			.then(msg => {
				console.log(msg);
			})
	})	
	
program
	.command('remove <code>')
	.description('remove stock from stock list')	
	.action(code => {
		stock.removeStock(code)
			.then(msg=>{
				console.log(msg);
			})
	})	
	
program.parse(process.argv);
