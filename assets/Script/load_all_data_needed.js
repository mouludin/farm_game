// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        all_machine_data:{
            default:null,
            type:cc.JsonAsset
        },
        all_project:{
            default:null,
            type:cc.JsonAsset
        },
        default_data:{
            default:null,
            type:cc.JsonAsset
        },
        item_selling_price:{
            default:null,
            type:cc.JsonAsset
        },
        object_identity:{
            default:null,
            type:cc.JsonAsset
        },
        planting_data:{
            default:null,
            type:cc.JsonAsset
        },
        stuff_identity:{
            default:null,
            type:cc.JsonAsset
        },
        achievement_data:{
            default:null,
            type:cc.JsonAsset
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad(){
    },

    start () {

    },

    // update (dt) {},
});
