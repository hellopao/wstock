"use strict";

const http = require('http');
const util = require('util');
const url = require('url');

const iconv = require('iconv-lite');

const config = require('../config/config');

let request = (options, data, cb) => {

    if (typeof data === "function") {
        options.method = "get";
        cb = data;
        data = null;
    }

    var hostname = options.hostname;
    var port = options.port;

    if (config.PROXY.DEBUG) {
        hostname = config.PROXY.DEBUG_SERVER.HOST;
        port = config.PROXY.DEBUG_SERVER.PORT;
    }

    var req = http.request({
        hostname: hostname,
        port: port,
        method: options.method,
        path: options.path,
        headers: Object.assign({}, options.headers)
    });

    options.method === "POST" && req.write(data);

    req.setTimeout(options.timeout || config.PROXY.TIMEOUT, () => {
        req.abort();
    });

    req.on('error', err => {
        req.abort();
    }).on('response', res => {
        var chunks = [];
        var size = 0;

        var result;

        res.on('data', chunk => {
            chunks.push(chunk);
            size += chunk.length;
        }).on('end', () => {
            result = Buffer.concat(chunks, size);

            var code = res.statusCode;

            if (code >= 200 && code <= 304) {
                cb && cb(null, res, result);
            } else {
                cb && cb(new Error(util.format('HTTP ERROR, code: %d, url: %s'), code, options.path), res, result);
            }
        })
    })

    req.end();
};

exports.get = (reqUrl, opts) => {
    let urlObj = url.parse(reqUrl);

    return new Promise((resolve, reject) => {
        request({
            method: "get",
            path: urlObj.path,
            hostname: urlObj.hostname,
            prot: urlObj.port,
            headers: Object.assign({}, opts, {
                host: urlObj.host
            })
        }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(iconv.decode(body,'gbk').toString());
            }
        })
    })
};
