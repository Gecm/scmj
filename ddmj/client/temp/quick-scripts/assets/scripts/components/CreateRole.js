(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/CreateRole.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5d56bFYy/REb77pQCq9YHh6', 'CreateRole', __filename);
// scripts/components/CreateRole.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        inputName: cc.EditBox
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

    onRandomBtnClicked: function onRandomBtnClicked() {
        var names = ["上官", "欧阳", "东方", "端木", "独孤", "司马", "南宫", "夏侯", "诸葛", "皇甫", "长孙", "宇文", "轩辕", "东郭", "子车", "东阳", "子言"];

        var names2 = ["雀圣", "赌侠", "赌圣", "稳赢", "不输", "好运", "自摸", "有钱", "土豪"];
        var idx = Math.floor(Math.random() * (names.length - 1));
        var idx2 = Math.floor(Math.random() * (names2.length - 1));
        this.inputName.string = names[idx] + names2[idx2];
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.onRandomBtnClicked();
    },

    onBtnConfirmClicked: function onBtnConfirmClicked() {
        var name = this.inputName.string;
        if (name == "") {
            console.log("invalid name.");
            return;
        }
        console.log(name);
        cc.vv.userMgr.create(name);
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
        //# sourceMappingURL=CreateRole.js.map
        