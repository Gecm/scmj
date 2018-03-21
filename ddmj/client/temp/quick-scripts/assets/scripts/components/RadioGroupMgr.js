(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/RadioGroupMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '824eapeRYNKY4RJzg2Z4YA2', 'RadioGroupMgr', __filename);
// scripts/components/RadioGroupMgr.js

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
        _groups: null
    },

    // use this for initialization
    init: function init() {
        this._groups = {};
    },

    add: function add(radioButton) {
        var groupId = radioButton.groupId;
        var buttons = this._groups[groupId];
        if (buttons == null) {
            buttons = [];
            this._groups[groupId] = buttons;
        }
        buttons.push(radioButton);
    },

    del: function del(radioButton) {
        var groupId = radioButton.groupId;
        var buttons = this._groups[groupId];
        if (buttons == null) {
            return;
        }
        var idx = buttons.indexOf(radioButton);
        if (idx != -1) {
            buttons.splice(idx, 1);
        }
        if (buttons.length == 0) {
            delete this._groups[groupId];
        }
    },

    check: function check(radioButton) {
        var groupId = radioButton.groupId;
        var buttons = this._groups[groupId];
        if (buttons == null) {
            return;
        }
        for (var i = 0; i < buttons.length; ++i) {
            var btn = buttons[i];
            if (btn == radioButton) {
                btn.check(true);
            } else {
                btn.check(false);
            }
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
        //# sourceMappingURL=RadioGroupMgr.js.map
        