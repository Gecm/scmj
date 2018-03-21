"use strict";
cc._RF.push(module, 'f58cea6lrpDZJSNs2BGBqxN', 'AnysdkMgr');
// scripts/AnysdkMgr.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _isCapturing: false
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    init: function init() {
        this.ANDROID_API = "com/vivigames/scmj/WXAPI";
        this.IOS_API = "AppController";
    },

    login: function login() {

        //注释掉所有的调原声的
        // if(cc.sys.os == cc.sys.OS_ANDROID){ 
        //     jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        // }
        // else if(cc.sys.os == cc.sys.OS_IOS){
        //     jsb.reflection.callStaticMethod(this.IOS_API, "login");
        // }
        // else{
        //     console.log("platform:" + cc.sys.os + " dosn't implement share.");
        // }
    },

    share: function share(title, desc) {
        // if(cc.sys.os == cc.sys.OS_ANDROID){
        //     jsb.reflection.callStaticMethod(this.ANDROID_API, "Share", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",cc.vv.SI.appweb,title,desc);
        // }
        // else if(cc.sys.os == cc.sys.OS_IOS){
        //     jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:",cc.vv.SI.appweb,title,desc);
        // }
        // else{
        //     console.log("platform:" + cc.sys.os + " dosn't implement share.");
        // }
    },

    shareResult: function shareResult() {
        if (this._isCapturing) {
            return;
        }
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if (jsb.fileUtils.isFileExist(fullPath)) {
            jsb.fileUtils.removeFile(fullPath);
        }
        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height));
        texture.setPosition(cc.p(size.width / 2, size.height / 2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);

        var self = this;
        var tryTimes = 0;
        var fn = function fn() {
            if (jsb.fileUtils.isFileExist(fullPath)) {
                var height = 100;
                var scale = height / size.height;
                var width = Math.floor(size.width * scale);

                // if(cc.sys.os == cc.sys.OS_ANDROID){
                //     jsb.reflection.callStaticMethod(self.ANDROID_API, "ShareIMG", "(Ljava/lang/String;II)V",fullPath,width,height);
                // }
                // else if(cc.sys.os == cc.sys.OS_IOS){
                //     jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:",fullPath,width,height);
                // }
                // else{
                //     console.log("platform:" + cc.sys.os + " dosn't implement share.");
                // }
                self._isCapturing = false;
            } else {
                tryTimes++;
                if (tryTimes > 10) {
                    console.log("time out...");
                    return;
                }
                setTimeout(fn, 50);
            }
        };
        setTimeout(fn, 50);
    },

    onLoginResp: function onLoginResp(code) {
        // var fn = function(ret){
        //     if(ret.errcode == 0){
        //         cc.sys.localStorage.setItem("wx_account",ret.account);
        //         cc.sys.localStorage.setItem("wx_sign",ret.sign);
        //     }
        //     cc.vv.userMgr.onAuth(ret);
        // }
        // cc.vv.http.sendRequest("/wechat_auth",{code:code,os:cc.sys.os},fn);
    }
});

cc._RF.pop();