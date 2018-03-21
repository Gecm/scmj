"use strict";
cc._RF.push(module, '6edb3jjx+FBepS1mk1xKDF2', 'Hall');
// scripts/components/Hall.js

"use strict";

//拿到这两文件
var Net = require("Net");
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        //这些label，这些玩家信息
        lblName: cc.Label,
        lblMoney: cc.Label,
        lblGems: cc.Label,
        lblID: cc.Label,
        lblNotice: cc.Label,
        //这些是一些节点窗口或按钮
        joinGameWin: cc.Node,
        createRoomWin: cc.Node,
        settingsWin: cc.Node,
        helpWin: cc.Node,
        xiaoxiWin: cc.Node,
        btnJoinGame: cc.Node,
        btnReturnGame: cc.Node,
        //这是一张头像
        sprHeadImg: cc.Sprite
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

    },

    initNetHandlers: function initNetHandlers() {
        var self = this;
    },

    onShare: function onShare() {
        cc.vv.anysdkMgr.share("达达麻将", "达达麻将，包含了血战到底、血流成河等多种四川流行麻将玩法。");
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
        this.initLabels();

        if (cc.vv.gameNetMgr.roomId == null) {
            this.btnJoinGame.active = true;
            this.btnReturnGame.active = false;
        } else {
            this.btnJoinGame.active = false;
            this.btnReturnGame.active = true;
        }

        //var params = cc.vv.args;
        var roomId = cc.vv.userMgr.oldRoomId;
        if (roomId != null) {
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);
        }

        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
        cc.vv.utils.addClickEvent(this.sprHeadImg.node, this.node, "Hall", "onBtnClicked");

        this.addComponent("UserInfoShow");

        this.initButtonHandler("Canvas/right_bottom/btn_shezhi");
        this.initButtonHandler("Canvas/right_bottom/btn_help");
        this.initButtonHandler("Canvas/right_bottom/btn_xiaoxi");
        this.helpWin.addComponent("OnBack");
        this.xiaoxiWin.addComponent("OnBack");

        if (!cc.vv.userMgr.notice) {
            cc.vv.userMgr.notice = {
                version: null,
                msg: "数据请求中..."
            };
        }

        if (!cc.vv.userMgr.gemstip) {
            cc.vv.userMgr.gemstip = {
                version: null,
                msg: "数据请求中..."
            };
        }

        this.lblNotice.string = cc.vv.userMgr.notice.msg;

        this.refreshInfo();
        this.refreshNotice();
        this.refreshGemsTip();

        cc.vv.audioMgr.playBGM("bgMain.mp3");
    },

    refreshInfo: function refreshInfo() {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                if (ret.gems != null) {
                    this.lblGems.string = ret.gems;
                }
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign
        };
        cc.vv.http.sendRequest("/get_user_status", data, onGet.bind(this));
    },

    refreshGemsTip: function refreshGemsTip() {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                cc.vv.userMgr.gemstip.version = ret.version;
                cc.vv.userMgr.gemstip.msg = ret.msg.replace("<newline>", "\n");
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            type: "fkgm",
            version: cc.vv.userMgr.gemstip.version
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
    },

    refreshNotice: function refreshNotice() {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                cc.vv.userMgr.notice.version = ret.version;
                cc.vv.userMgr.notice.msg = ret.msg;
                this.lblNotice.string = ret.msg;
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            type: "notice",
            version: cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
    },

    initButtonHandler: function initButtonHandler(btnPath) {
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn, this.node, "Hall", "onBtnClicked");
    },

    initLabels: function initLabels() {
        this.lblName.string = cc.vv.userMgr.userName;
        this.lblMoney.string = cc.vv.userMgr.coins;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },

    onBtnClicked: function onBtnClicked(event) {
        if (event.target.name == "btn_shezhi") {
            this.settingsWin.active = true;
        } else if (event.target.name == "btn_help") {
            this.helpWin.active = true;
        } else if (event.target.name == "btn_xiaoxi") {
            this.xiaoxiWin.active = true;
        } else if (event.target.name == "head") {
            cc.vv.userinfoShow.show(cc.vv.userMgr.userName, cc.vv.userMgr.userId, this.sprHeadImg, cc.vv.userMgr.sex, cc.vv.userMgr.ip);
        }
    },
    //加入房间
    onJoinGameClicked: function onJoinGameClicked() {
        this.joinGameWin.active = true;
    },

    onReturnGameClicked: function onReturnGameClicked() {
        cc.director.loadScene("mjgame");
    },

    onBtnAddGemsClicked: function onBtnAddGemsClicked() {
        cc.vv.alert.show("提示", cc.vv.userMgr.gemstip.msg);
        this.refreshInfo();
    },

    onCreateRoomClicked: function onCreateRoomClicked() {
        if (cc.vv.gameNetMgr.roomId != null) {
            cc.vv.alert.show("提示", "房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        console.log("onCreateRoomClicked");
        this.createRoomWin.active = true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var x = this.lblNotice.node.x;
        x -= dt * 100;
        if (x + this.lblNotice.node.width < -1000) {
            x = 500;
        }
        this.lblNotice.node.x = x;

        if (cc.vv && cc.vv.userMgr.roomData != null) {
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
            cc.vv.userMgr.roomData = null;
        }
    }
});

cc._RF.pop();