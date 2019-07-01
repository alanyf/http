# http  
## 介绍
实现简易前后端交互，封装前端get、post、jsonp、cors等常用的发送请求的方法，使用nodejs、express搭建简单的支持上述方法的http服务器。

## 查看演示
```
git clone http://***
cd http
npm install
npm run dev
```
打开浏览器访问：http://localhost:8081/static/demo.html

## 源文件  

1. 回调函数风格的接口  

    `httpCallback.js`

2. promise & async风格的接口  

    `httpPromise.js`

3. 兼容回调函数、promise & async风格的接口  

    `http.js`
