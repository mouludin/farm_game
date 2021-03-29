cc.Class({
    extends: cc.Component,

    properties: {
        label:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.show_item(this.get_item_prefab(this.our_prefab.data.name));
        this.label.x = this.node.width / 4;
        this.insufficient = true;
        let total = 0;
        for(let i = 0;i < window.default_data.storage.length;i++){
            if(window.default_data.storage[i].name == this.our_prefab.data.name){
                    total = window.default_data.storage[i].total;
                break;
            }
        }

        if(total < this.our_prefab.data.count){
            this.insufficient = false;
            this.label.color = new cc.Color(200,20,20);
        }
        this.label._components[0].string = total+"/"+this.our_prefab.data.count;
    },
    show_item:function(a){
        let newObject = cc.instantiate(a);
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(-this.node.width/2,0));
        this.node.children[this.node.children.length - 1].width = 60;
        this.node.children[this.node.children.length - 1].height = 60;
    },
    get_item_prefab:function(name){
        switch (name){
            case "wheat":
                return this.node.parent._components[3].wheat_prefab;
            case "tomato":
                return this.node.parent._components[3].tomato_prefab;
            case "lemon":
                return this.node.parent._components[3].lemon_prefab;
            case "apple":
                return this.node.parent._components[3].apple_prefab;
            }    
    },

    start () {},

    // update (dt) {},
});
