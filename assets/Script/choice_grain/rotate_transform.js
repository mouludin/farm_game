cc.Class({
    extends: cc.Component,

    properties: {
        purpose:"",
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.mouseDown = false;

        this.node.on("touchstart", (event) => {
            this.mouseDown = true;
        });
        this.node.on("touchend", (event) => {
            this.mouseDown = false;
        });
    },
    
    start () {
        
    },
    
    onDrag(){
    },
    
    update (dt) {
        for(let i = 0;i < this.node.parent.children.length;i++){
            if(this.node.parent.children[i]._name == "grain_bags"){
                if(this.mouseDown){
                    if(this.purpose == "right")
                    {
                        this.node.parent.children[i]._components[1].rotate("right");
                    }
                    else if( this.purpose == "left")
                    {
                        this.node.parent.children[i]._components[1].rotate("left");
                    }
                }
            }
        }
    },
});
