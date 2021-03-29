cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onTouch:function(){
        if(window.action_active) return;
        window.action_active = true;
        this.node.parent.parent._components[2].spawnNewObject("fertilizer_box");
    },

    start () {

    },

    // update (dt) {},
});
