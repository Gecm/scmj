(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/NoticeTip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'df61b4+FzFDvbpO5g8UNVIM', 'NoticeTip', __filename);
// scripts/components/NoticeTip.js

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
        _guohu: null,
        _info: null,
        _guohuTime: -1
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._guohu = cc.find("Canvas/tip_notice");
        this._guohu.active = false;

        this._info = cc.find("Canvas/tip_notice/info").getComponent(cc.Label);

        var self = this;
        this.node.on('push_notice', function (data) {
            var data = data.detail;
            self._guohu.active = true;
            self._guohuTime = data.time;
            self._info.string = data.info;
        });
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this._guohuTime > 0) {
            this._guohuTime -= dt;
            if (this._guohuTime < 0) {
                this._guohu.active = false;
            }
        }
    }
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
        //# sourceMappingURL=NoticeTip.js.map
        