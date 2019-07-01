//express_demo.js 文件
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser"); 
const express = require('express'); 
const app = express();


const domin = process.argv[2]==='prod'?'':'localhost'
const port = 8081;
const host = domin + ':' + port;
const jsonpFuncParam = 'callback';
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));
app.use('/static', express.static( path.resolve(__dirname, './static') ));

function getJsonpRes(funcNmae, data){
    return funcNmae + "('" + JSON.stringify(data) + "')";
}

app.all('*', function(req, res, next) {
    // //允许跨域
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1');
    console.log(req.method, req.method.toLocaleUpperCase()==='GET'?req.query:req.body, Date.now());
    if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
    else next();
});

app.use('/get', function (req, res) {
    const param = req.query;
    if(typeof param[jsonpFuncParam] !== 'undefined'){
        const resStr = getJsonpRes(param[jsonpFuncParam], {
            method: 'jsonp',
            data: param||'request has not param'
        });
        res.end(resStr);
    }else{
        res.writeHead(200, {'Content-Type': 'application/json'});
        const resStr = JSON.stringify({
            method: req.method,
            data: param||'request has not param'
        });
        res.end(resStr);
    }
});
app.use('/post', function (req, response) {
    const param = req.body;
    response.writeHead(200, {'Content-Type': 'application/json'});  
    const resStr =  JSON.stringify({
        method: req.method,
        data: param||'request has not param'
    }); 
    response.end(resStr);     
});
app.use('/jsonp', function (req, res) {
    const param = req.query;
    if(typeof param[jsonpFuncParam] !== 'undefined'){
        const resStr = getJsonpRes(param[jsonpFuncParam], {
            method: 'jsonp',
            data: param||'request has not param'
        });
        res.end(resStr);
    }
});
app.use('/cors', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    const param = req.query;
    res.writeHead(200, {'Content-Type': 'application/json'});
    const resStr =  JSON.stringify({
        method: req.method,
        data: param||'request has not param'
    }); 
    res.end(resStr);
});

app.listen(port, function () {
  console.log('http://' + host);
});