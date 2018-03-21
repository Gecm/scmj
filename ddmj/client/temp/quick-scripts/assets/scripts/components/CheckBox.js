(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/CheckBox.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dc9e5hcegFBFpbh0CwUFw8V', 'CheckBox', __filename);
// scripts/components/CheckBox.js

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
        target: cc.Node,
        sprite: cc.SpriteFrame,
        checkedSprite: cc.SpriteFrame,
        checked: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.refresh();
    },

    onClicked: function onClicked() {
        this.checked = !this.checked;
        this.refresh();
    },

    refresh: function refresh() {
        var targetSprite = this.target.getComponent(cc.Sprite);
        if (this.checked) {
            targetSprite.spriteFrame = this.checkedSprite;
        } else {
            targetSprite.spriteFrame = this.sprite;
        }
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
        //# sourceMappingURL=CheckBox.js.map
        