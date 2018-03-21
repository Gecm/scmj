(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '24e30ZJLgdH3rs1R1CvqN8U', 'Global', __filename);
// scripts/Global.js

"use strict";

var Global = cc.Class({
    extends: cc.Component,
    statics: {

        isstarted: false,
        netinited: false,
        userguid: 0,
        nickname: "",
        money: 0,
        lv: 0,
        roomId: 0
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
        //# sourceMappingURL=Global.js.map
        