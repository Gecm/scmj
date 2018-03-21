"use strict";
cc._RF.push(module, '21e6a+ajGNDTJwDHbV3A72m', 'ReplayCtrl');
// scripts/components/ReplayCtrl.js

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
        _nextPlayTime: 1,
        _replay: null,
        _isPlaying: true
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.vv == null) {
            return;
        }

        this._replay = cc.find("Canvas/replay");
        this._replay.active = cc.vv.replayMgr.isReplay();
    },

    onBtnPauseClicked: function onBtnPauseClicked() {
        this._isPlaying = false;
    },

    onBtnPlayClicked: function onBtnPlayClicked() {
        this._isPlaying = true;
    },

    onBtnBackClicked: function onBtnBackClicked() {
        cc.vv.replayMgr.clear();
        cc.vv.gameNetMgr.reset();
        cc.vv.gameNetMgr.roomId = null;
        cc.director.loadScene("hall");
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (cc.vv) {
            if (this._isPlaying && cc.vv.replayMgr.isReplay() == true && this._nextPlayTime > 0) {
                this._nextPlayTime -= dt;
                if (this._nextPlayTime < 0) {
                    this._nextPlayTime = cc.vv.replayMgr.takeAction();
                }
            }
        }
    }
});

cc._RF.pop();