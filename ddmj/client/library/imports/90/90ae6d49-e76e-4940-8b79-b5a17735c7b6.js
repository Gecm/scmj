"use strict";
cc._RF.push(module, '90ae61J525JQIt5taF3Nce2', 'HTTP');
// scripts/HTTP.js

"use strict";

//var URL = "http://127.0.0.1:9000";
var URL = "http://169.254.111.174:9000";
//var URL = "http://497.93.188.77:9000";

//var URL = "http://192.168.7.186:9000";
//var URL = "http://47.93.188.77:9000";
cc.VERSION = 20161227;
var HTTP = cc.Class({
    extends: cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        master_url: URL,
        url: URL,
        sendRequest: function sendRequest(path, data, handler, extraUrl) {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for (var k in data) {
                if (str != "?") {
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            if (extraUrl == null) {
                extraUrl = HTTP.url;
            }
            //这里把str（就是CreateRoom里面选择好的数据）交给requestURL，然后通过get把数据打给服务器
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);
            //这个方法调用一下这只是初始化一个请请求
            xhr.open("GET", requestURL, true);
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                    console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if (handler !== null) {
                            handler(ret);
                        } /* code */
                    } catch (e) {
                        console.log("err:" + e);
                        //handler(null);
                    } finally {
                        if (cc.vv && cc.vv.wc) {
                            //       cc.vv.wc.hide();    
                        }
                    }
                }
            };

            if (cc.vv && cc.vv.wc) {}
            //cc.vv.wc.show();

            //发送请求
            xhr.send();
            return xhr;
        }
    }
});

cc._RF.pop();