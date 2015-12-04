#!/usr/bin/env node
"use strict";

const fs = require('fs');
const http = require('http');
const path = require('path');

const program = require('commander');

const stock = require('../index');
const teminate = require('../lib/terminate');
const config = require('../config/config');
const pkg = require('../package');

function comet (promise,interval) {
	promise()
		.then(()=>{
			setInterval(promise,interval);
		})
}

program	
	.version(pkg.version)
	.usage('[command]')

/**
 * 查询股票信息
 */
program
	.command('query <name|code>')
	.description('search stock code by name or code')
	.action(name => {
		stock.queryStockInfo(name)
			.then(stocks => {
				teminate.showStockInfo(stocks);
			})
	})	
	
/**
 * 查询股票状态
 */
program
	.command('show <code>')	
	.description('show stock status by code')	
	.action(code => {
		comet(()=>{
			return stock.queryStockStatus(code)
				.then(stockStatus => {
					teminate.showStockStatus(stockStatus);
				})
		},config.stockCheckInterval)
	})	
	
/**
 * 查询配置表中所有股票状态
 */
program	
	.command('list')
	.description('show the stock status list')	
	.action(()=>{
		comet(()=> {
			return stock.queryStockListStatus()
				.then(listStatus => {
					teminate.showStockListStatus(listStatus);
				})
		},config.stockCheckInterval);
	})	

/**
 * 添加股票到配置表
 */	
program
	.command('add <code>')
	.description('add stock to stock list')	
	.action(code => {
		stock.addStock(code)
			.then(msg => {
				teminate.showMsg(msg);
			})
	})	
	
/**
 * 从配置表中移除股票
 */		
program
	.command('remove <code>')
	.description('remove stock from stock list')	
	.action(code => {
		stock.removeStock(code)
			.then(msg=>{
				teminate.showMsg(msg);
			})
	})	
	
program.parse(process.argv);

// display help by default
if (!process.argv.slice(2).length) {
    program.outputHelp();
}