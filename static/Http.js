/*
作者: alan
日期：2019.06.30
功能：封装前端Http请求接口
*/
function Http(){
    function getParamStr(param){
        var str = "";
        for(var o in param){
            str += encodeURIComponent(o)+"="+encodeURIComponent(param[o])+"&";
        }
        str = str.slice(0, str.length-1);
        return str;
    }
    function isFun(callback){
        return typeof callback === "function";
    }
    function getError(xhr, method){
        return new Error(method.toUpperCase()  + ' ' + xhr.responseURL + ' ' +  xhr.status + ' (' + xhr.statusText + ')');
    }
    Http.prototype.get = function(url, param, callback = ()=>{}){
        var promise = new Promise(function(resolve,reject){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = handler;
            xhr.withCredentials = true;// 带上cookie
            xhr.open("get", url + '?' + getParamStr(param), true);
            xhr.setRequestHeader("Content-type","application/json");
            xhr.send(null);
            function handler(){
                if(this.readyState == 4){
                    if(this.status == 200 ){
                        var str = xhr.responseText;
                        isFun(callback)&&callback(str, null);
                        return resolve(str);
                    }else{
                        const error = getError(xhr, "get");
                        isFun(callback)&&callback(null, error);
                        return reject(error);
                    }
                }
            }
        });
        return promise;
    }
    Http.prototype.post = function(url, param, callback = ()=>{}){
        var promise = new Promise(function(resolve,reject){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = handler;
            xhr.withCredentials = true;// 带上cookie
            xhr.open("post",url, true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(getParamStr(param));
            function handler(){
                if(this.readyState == 4){
                    if(this.status == 200 ){
                        var str = xhr.responseText;
                        isFun(callback)&&callback(str, null);
                        return resolve(str);
                    }else{
                        const error = getError(xhr, 'post');
                        isFun(callback)&&callback(null, error);
                        return reject(error);
                    }
                }
            }
        });
        return promise;
    }

    Http.prototype.jsonp = function(url, param, callback){
        if(isFun(callback)){
            window.handlejsonpRes = callback;
            var scriptDom = document.createElement("script");
            param = Object.assign({callback: "handlejsonpRes"}, param);
            scriptDom.src = url + '?' + getParamStr(param);
            document.body.appendChild(scriptDom);
            document.body.removeChild(scriptDom);
        }
        return new Promise(function(resolve, reject){
            window.handlejsonpResponse = resolve;
            var script = document.createElement("script");
            param = Object.assign({callback: "handlejsonpResponse"}, param);
            script.src = url + '?' + getParamStr(param);
            document.body.appendChild(script);
            document.body.removeChild(script);
        });
    }
}
// var http = new Http();