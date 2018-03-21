(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/RadioButton.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8d571y2U+9AiKntO+TSf0Fb', 'RadioButton', __filename);
// scripts/components/RadioButton.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        target: cc.Node,
        sprite: cc.SpriteFrame,
        checkedSprite: cc.SpriteFrame,
        checked: false,
        groupId: -1
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.vv == null) {
            return;
        }
        if (cc.vv.radiogroupmgr == null) {
            var RadioGroupMgr = require("RadioGroupMgr");
            cc.vv.radiogroupmgr = new RadioGroupMgr();
            cc.vv.radiogroupmgr.init();
        }
        console.log(_typeof(cc.vv.radiogroupmgr.add));
        cc.vv.radiogroupmgr.add(this);

        this.refresh();
    },

    refresh: function refresh() {
        var targetSprite = this.target.getComponent(cc.Sprite);
        if (this.checked) {
            targetSprite.spriteFrame = this.checkedSprite;
        } else {
            targetSprite.spriteFrame = this.sprite;
        }
    },

    check: function check(value) {
        this.checked = value;
        this.refresh();
    },

    onClicked: function onClicked() {
        cc.vv.radiogroupmgr.check(this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onDestroy: function onDestroy() {
        if (cc.vv && cc.vv.radiogroupmgr) {
            cc.vv.radiogroupmgr.del(this);
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
        //# sourceMappingURL=RadioButton.js.map
        