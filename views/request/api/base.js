var srv;
if (process.env.NODE_ENV !== 'production') { //阿里云测试服务器
     srv = 'https://ts.baoyitech.com.cn/car_server/'; //测试
} else { //正式服
    srv = 'https://app.baoyitech.com.cn/car_server/';
}
const base = {
    test: srv, //接口地址
}
export default base;