// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onTouch(){
        if(window.action_active) return;
        window.action_active = true;
        this.node.parent.parent._components[2].spawnNewObject("achievement_box",0,0);
    },

    start () {

    },

    // update (dt) {},
});
