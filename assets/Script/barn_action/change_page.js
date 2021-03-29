// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        purpose:"",
    },

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function(e){
            if(this.purpose == "right"){this.node.parent.getComponent('storage_box').right_page_act()};
            if(this.purpose == "left"){this.node.parent.getComponent('storage_box').left_page_act()};
        },this);
    },

    start () {

    },

    // update (dt) {},
});
