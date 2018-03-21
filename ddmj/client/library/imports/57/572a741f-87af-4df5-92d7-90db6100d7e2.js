"use strict";
cc._RF.push(module, '572a7Qfh69N9ZLXkNthANfi', 'Login');
// scripts/components/Login.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && (typeof args === "undefined" ? "undefined" : _typeof(args)) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                } else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    } else {
        return this;
    }
};

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _mima: null,
        _mimaIndex: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        if (!cc.vv) {
            cc.director.loadScene("loading");
            return;
        }
        cc.vv.http.url = cc.vv.http.master_url;
        //接受服务器传来的信息
        cc.vv.net.addHandler('push_need_create_role', function () {
            console.log("onLoad:push_need_create_role");
            cc.director.loadScene("createrole");
        });

        cc.vv.audioMgr.playBGM("bgMain.mp3");

        this._mima = ["A", "A", "B", "B", "A", "B", "A", "B", "A", "A", "A", "B", "B", "B"];

        if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS) {
            cc.find("Canvas/btn_yk").active = true;
        }

        cc.find("Canvas/btn_yk").active = true;
    },

    start: function start() {
        var account = cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");
        if (account != null && sign != null) {
            var ret = {
                errcode: 0,
                account: account,
                sign: sign
            };
            cc.vv.userMgr.onAuth(ret);
        }
    },

    onBtnQuickStartClicked: function onBtnQuickStartClicked() {
        cc.vv.userMgr.guestAuth();
    },

    onBtnWeichatClicked: function onBtnWeichatClicked() {
        var self = this;
        cc.vv.anysdkMgr.login();
    },

    onBtnMIMAClicked: function onBtnMIMAClicked(event) {
        // if(this._mima[this._mimaIndex] == event.target.name){
        //     this._mimaIndex++;
        //     if(this._mimaIndex == this._mima.length){
        cc.find("Canvas/btn_yk").active = true;
        //     }
        // }
        // else{
        //     console.log("oh ho~~~");
        //     this._mimaIndex = 0;
        // }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();