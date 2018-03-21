"use strict";
cc._RF.push(module, 'eec07HsL4pBn5/PiT3SYBew', 'CreateRoom');
// scripts/components/CreateRoom.js

"use strict";

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
        _difenxuanze: null,
        _zimo: null,
        _wanfaxuanze: null,
        _zuidafanshu: null,
        _jushuxuanze: null,
        _dianganghua: null,
        _leixingxuanze: null

    },

    // use this for initialization
    onLoad: function onLoad() {
        //得到3种玩法
        this._leixingxuanze = [];
        var t = this.node.getChildByName("leixingxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._leixingxuanze.push(n);
            }
        }
        //得分选择不知道在哪里用到了
        this._difenxuanze = [];
        var t = this.node.getChildByName("difenxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._difenxuanze.push(n);
            }
        }
        //console.log(this._difenxuanze);

        this._zimo = [];
        var t = this.node.getChildByName("zimojiacheng");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._zimo.push(n);
            }
        }
        //console.log(this._zimo);

        this._wanfaxuanze = [];
        var t = this.node.getChildByName("wanfaxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("CheckBox");
            if (n != null) {
                this._wanfaxuanze.push(n);
            }
        }
        //console.log(this._wanfaxuanze);

        this._zuidafanshu = [];
        var t = this.node.getChildByName("zuidafanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._zuidafanshu.push(n);
            }
        }
        //console.log(this._zuidafanshu);

        this._jushuxuanze = [];
        var t = this.node.getChildByName("xuanzejushu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._jushuxuanze.push(n);
            }
        }

        this._dianganghua = [];
        var t = this.node.getChildByName("dianganghua");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._dianganghua.push(n);
            }
        }
        //console.log(this._jushuxuanze);
    },
    //onlode方法一直到这里
    onBtnBack: function onBtnBack() {
        this.node.active = false;
    },

    onBtnOK: function onBtnOK() {
        this.node.active = false;
        this.createRoom();
    },
    //创建房间的方法 
    createRoom: function createRoom() {
        var self = this;
        var onCreate = function onCreate(ret) {
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if (ret.errcode == 2222) {
                    cc.vv.alert.show("提示", "房卡不足，创建房间失败!");
                } else {
                    cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
                }
            } else {
                //ret是包装的用户信息这是已经Roommgr服务返回ret
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };
        //底分是0
        var difen = 0;
        for (var i = 0; i < self._difenxuanze.length; ++i) {
            if (self._difenxuanze[i].checked) {
                difen = i;
                break;
            }
        }
        //自摸加底，自摸加翻
        var zimo = 0;
        for (var i = 0; i < self._zimo.length; ++i) {
            if (self._zimo[i].checked) {
                zimo = i;
                break;
            }
        }
        //胡牌规则
        var huansanzhang = self._wanfaxuanze[0].checked;
        var jiangdui = self._wanfaxuanze[1].checked;
        var menqing = self._wanfaxuanze[2].checked;
        var tiandihu = self._wanfaxuanze[3].checked;

        var type = 0;
        //选择麻将规则血战到底和血流成河
        for (var i = 0; i < self._leixingxuanze.length; ++i) {
            if (self._leixingxuanze[i].checked) {
                type = i;
                break;
            }
        }

        if (type == 0) {
            type = "xzdd";
        }
        // else {
        //     type = "xlch";
        // }
        else if (type == 1) {
                type = "xlch";
            } else {
                type = "rzmj";
            }
        //最大翻数
        var zuidafanshu = 0;
        for (var i = 0; i < self._zuidafanshu.length; ++i) {
            if (self._zuidafanshu[i].checked) {
                zuidafanshu = i;
                break;
            }
        }

        //局数选择
        var jushuxuanze = 0;
        for (var i = 0; i < self._jushuxuanze.length; ++i) {
            if (self._jushuxuanze[i].checked) {
                jushuxuanze = i;
                break;
            }
        }
        //点杠花连个模式
        var dianganghua = 0;
        for (var i = 0; i < self._dianganghua.length; ++i) {
            if (self._dianganghua[i].checked) {
                dianganghua = i;
                break;
            }
        }
        //他们用conf记录
        if (type != 'rzmj') {

            var conf = {
                type: type,
                difen: difen,
                zimo: zimo,
                jiangdui: jiangdui,
                huansanzhang: huansanzhang,
                zuidafanshu: zuidafanshu,
                jushuxuanze: jushuxuanze,
                dianganghua: dianganghua,
                menqing: menqing,
                tiandihu: tiandihu
            };
        } else {
            var conf = {
                type: type,
                difen: difen,
                jushuxuanze: jushuxuanze,
                zuidafanshu: zuidafanshu
            };
        }

        //date 记录数据和类型
        var data = {
            //用户玩家
            account: cc.vv.userMgr.account,
            //类型
            sign: cc.vv.userMgr.sign,
            //选择的玩法类型
            conf: JSON.stringify(conf)
        };
        console.log(data);
        cc.vv.wc.show("正在创建房间");
        //一直到这里还是http请求，大厅服务器的client_server.js发消息，然后回调onCreat函数，通过服务消息gameNetMgr转发scoket服务
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();