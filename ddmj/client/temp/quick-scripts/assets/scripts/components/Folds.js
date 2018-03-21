(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Folds.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0bf63eiZEFMWbW03o8heqa5', 'Folds', __filename);
// scripts/components/Folds.js

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
        _folds: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.vv == null) {
            return;
        }

        this.initView();
        this.initEventHandler();

        this.initAllFolds();
    },

    initView: function initView() {
        this._folds = {};
        var game = this.node.getChildByName("game");
        var sides = ["myself", "right", "up", "left"];
        for (var i = 0; i < sides.length; ++i) {
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var folds = [];
            var foldRoot = sideRoot.getChildByName("folds");
            for (var j = 0; j < foldRoot.children.length; ++j) {
                var n = foldRoot.children[j];
                n.active = false;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = null;
                folds.push(sprite);
            }
            this._folds[sideName] = folds;
        }

        this.hideAllFolds();
    },

    hideAllFolds: function hideAllFolds() {
        for (var k in this._folds) {
            var f = this._folds[i];
            for (var i in f) {
                f[i].node.active = false;
            }
        }
    },

    initEventHandler: function initEventHandler() {
        var self = this;
        this.node.on('game_begin', function (data) {
            self.initAllFolds();
        });

        this.node.on('game_sync', function (data) {
            self.initAllFolds();
        });

        this.node.on('game_chupai_notify', function (data) {
            self.initFolds(data.detail);
        });

        this.node.on('guo_notify', function (data) {
            self.initFolds(data.detail);
        });
    },

    initAllFolds: function initAllFolds() {
        var seats = cc.vv.gameNetMgr.seats;
        for (var i in seats) {
            this.initFolds(seats[i]);
        }
    },

    initFolds: function initFolds(seatData) {
        var folds = seatData.folds;
        if (folds == null) {
            return;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);

        var foldsSprites = this._folds[side];
        for (var i = 0; i < foldsSprites.length; ++i) {
            var index = i;
            if (side == "right" || side == "up") {
                index = foldsSprites.length - i - 1;
            }
            var sprite = foldsSprites[index];
            sprite.node.active = true;
            this.setSpriteFrameByMJID(pre, sprite, folds[i]);
        }
        for (var i = folds.length; i < foldsSprites.length; ++i) {
            var index = i;
            if (side == "right" || side == "up") {
                index = foldsSprites.length - i - 1;
            }
            var sprite = foldsSprites[index];

            sprite.spriteFrame = null;
            sprite.node.active = false;
        }
    },

    setSpriteFrameByMJID: function setSpriteFrameByMJID(pre, sprite, mjid) {
        sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Folds.js.map
        