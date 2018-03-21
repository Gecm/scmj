"use strict";
cc._RF.push(module, '6fd982Tyi5NOYJWt/fGY8Lj', 'OnBack');
// scripts/components/OnBack.js

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
    },

    // use this for initialization
    onLoad: function onLoad() {
        var btn = this.node.getChildByName("btn_back");
        cc.vv.utils.addClickEvent(btn, this.node, "OnBack", "onBtnClicked");
    },

    onBtnClicked: function onBtnClicked(event) {
        if (event.target.name == "btn_back") {
            this.node.active = false;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();