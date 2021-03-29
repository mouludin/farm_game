cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.object_data;
        this.onMove();
    },
    
    start () {

    },
    
    update (dt) {
    },


    onMove:function(){
        this.node.on("touchstart",(event)=>{
            this.mouseDown = true;
        },this)
        
        this.node.on("touchmove",(event)=>{
            if(!this.mouseDown) return;
        },this)

        this.node.on("touchend",(event)=>{
            try {
                this.node.parent.children[this.object_data.ID]._components[2].onTouch();
            } catch (error) {}
        },this)
    },
});
