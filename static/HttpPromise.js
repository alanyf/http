function HttpPromise(){
    function getParamStr(param){
        var str = "?";
        for(var o in param){
            str += encodeURIComponent(o)+"="+encodeURIComponent(param[o])+"&";
        }
        str = str.slice(0, str.length-1);
        return str;
    }
    HttpPromise.prototype.get = function(url, param){
        var promise = new Promise(function(resolve,reject){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = handler;
            xhr.open("get",url+getParamStr(param), true);
            xhr.send(null);
            function handler(){
                if(this.readyState == 4){
                    if(this.status == 200 ){
                        var str = xhr.responseText;
                        return resolve(str);
                    }else{
                        const error = new Error(getError(xhr, 'get'));
                        return reject(error);
                    }
                }
            }
        });
        return promise;
    }
    HttpPromise.prototype.post = function(url, param){
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
                        return resolve(str);
                    }else{
                        const error = new Error(getError(xhr, 'post'));
                        return reject(error);
                    }
                }
            }
        });
        return promise;
    }

    HttpPromise.prototype.jsonp = function(url, param){
        return new Promise(function(resolve, reject){
            window.handlejsonpResponse = resolve;
            var script = document.createElement("script");
            param = Object.assign({callback: "handlejsonpResponse"}, param);
            script.src = url + getParamStr(param);
            document.body.appendChild(script);
            document.body.removeChild(script);
        });
    }

}

// var http = new HttpPromise();