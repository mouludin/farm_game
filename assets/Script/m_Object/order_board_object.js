cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onTouch:function(){
        if(window.action_active) return;
        window.action_active = true;
        this.node.parent.parent._components[2].spawnNewObject("order_board");
    }

    // update (dt) {},
});
