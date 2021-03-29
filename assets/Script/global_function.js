window.myFunc = {
    map:function(value,d1,u1,d2,u2){
        return d2 + (u2-d2) * ((value - d1)/(u1-d1));
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // onLoad () {},

    start () {},

    // update (dt) {},
});
