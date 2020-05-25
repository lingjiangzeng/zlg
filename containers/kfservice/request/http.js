import axios from 'axios'; 
var instance = axios.create({
  timeout: 1000 * 60
});
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]
instance.interceptors.response.use(
  res =>{
	  if(res.status === 200){
		  return Promise.resolve(res.data);
	  } else if(!/^2/.test(res.status)){
		  return Promise.resolve({message:res.request.responseURL+' 接口无法正常请求，状态码为'+res.status,status:30000});
	  }
  },
  error => {
	  console.log(error);
	  return Promise.reject(error);
  });

export default instance;