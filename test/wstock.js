/// <reference path="../index.d.ts" />

//const wstock = require('wstock');
import * as wstock from "wstock";

wstock.addStock('scjz').then(str => {
    console.log(str);
});

wstock.removeStock('scjz').then(str => {})

