var srv;
if (document.domain == 'wetest.baoyitech.com.cn') { //阿里云测试服务器
     srv = 'https://ts.baoyitech.com.cn/car_server/'; //测试
} else if (document.domain == 'mp.baoyitech.com.cn') { //正式服
    srv = 'https://app.baoyitech.com.cn:7777/car_server/';
} else {
    // srv = 'http://ts.baoyitech.com.cn/car_server/'; //测试实时
	srv = 'https://ts.baoyitech.com.cn/car_server/'; //测试实时
    // srv = 'http://192.168.1.35:9090/car_server/'; ///杨衡 
    // srv = 'http://192.168.1.110:9090/car_server/'; //庄鹏腾
    // srv = 'http://192.168.1.21:9099/pingan/'; //曾令江
    // srv = 'http://test.baoyitech.com.cn/car_server/';
    // srv = 'http://192.168.1.40:9090/car_server/';
    // srv = 'http://192.168.1.40:9090/car_server/'; //本地CCREATEORDER
    // srv = 'http://192.168.1.28:9090/car_server/'; //黄华文
    // srv = 'http://192.168.1.28:9096/car_server/' //伟城	
}
const base = {
    test: srv, //接口地址
}
export default base;