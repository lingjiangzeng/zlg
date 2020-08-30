/**
 * Created by Administrator on 2016/10/8 0008.
 */

/*引入express*/
var express = require('express');
const bodyParser = require('body-parser');

/*实例化express*/
var app = express();
//指定一个静态目录
app.use(express.static('./containers'));

//序列化JSON
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

//判断是否为空对象
function isEmptyObject(obj) {
	for (var key in obj) {
		return false; //返回false，不为空对象
	}
	return true; //返回true，为空对象
}

app.post('/test', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	if (isEmptyObject(req.body)) {
		res.json('请提交参数');
	} else {
		res.json(req.body);
	}
});

app.get('/test', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	res.send(require('./mock/test.json'));
});
/*设置监听端口,同时设置回调函数，监听到事件时执行回调函数*/
app.listen(9999, function afterListen() {
	console.log('express running on the http://localhost:9999');
});
