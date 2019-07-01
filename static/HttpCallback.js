/*
作者: alan
日期：2018.12.22
功能：封装前端Http请求接口
*/

function HttpCallback(){
    
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
    this.constructor.prototype.get = function(url, param, callback = ()=>{}){
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
                }else{
                    const error = getError(xhr, "get");
                    isFun(callback)&&callback(null, error);
                }
            }
        }
    }
    this.constructor.prototype.post = function(url, param, callback = ()=>{}){
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
                }else{
                    const error = getError(xhr, 'post');
                    isFun(callback)&&callback(null, error);
                }
            }
        }
    }

    this.constructor.prototype.jsonp = function(url, param, callback = ()=>{}){
        window.handlejsonpRes = callback;
        var scriptDom = document.createElement("script");
        param = Object.assign({callback: "handlejsonpRes"}, param);
        scriptDom.src = url + '?' + getParamStr(param);
        document.body.appendChild(scriptDom);
        document.body.removeChild(scriptDom);
    }

}

// var http = new HttpCallback();