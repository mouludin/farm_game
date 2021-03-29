cc.Class({
    extends: cc.Component,

    properties: {
        storage_box:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.ownData;

    },
    
    start () {
        
    },

    onTouch:function(){
        if(window.action_active) return;
        window.action_active = true;
        this.node.parent.parent._components[2].spawnNewObject("storage_box",0,0,storage_box => {
            storage_box._components[1].barn_id = this.ownData.ID;
        });
    },
    
    // update (dt) {
    // },
    
});
