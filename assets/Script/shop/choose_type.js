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

    onLoad () {
        for(let i = 0;i < this.node.children.length;i++){
            switch (this.node.children[i]._name) {
                case "animal_type":
                    this.node.children[i].on("touchend",(event)=>{
                        if(window.action_active) return;
                        this.node.parent._components[2].spawnNewObject("ground_animal");
                        this.node.parent._components[2].shop_open = false;
                        this.node.destroy();
                    },this)
                    break;
                case "decoration_type":
                    this.node.children[i].on("touchend",(event)=>{
                        if(window.action_active) return;
                        this.node.parent._components[2].spawnNewObject("ground_decoration");
                        this.node.parent._components[2].shop_open = false;
                        this.node.destroy();
                    },this)
                    break;
                case "plant_type":
                    this.node.children[i].on("touchend",(event)=>{
                        if(window.action_active) return;
                        this.node.parent._components[2].spawnNewObject("circle_seeds_choice");
                        this.node.parent._components[2].shop_open = false;
                        this.node.destroy();
                    },this)
                    break;
                case "building_type":
                    this.node.children[i].on("touchend",(event)=>{
                        if(window.action_active) return;
                        this.node.parent._components[2].spawnNewObject("ground_building");
                        this.node.parent._components[2].shop_open = false;
                        this.node.destroy();
                    },this)
                    break;
                case "machine_type":
                    this.node.children[i].on("touchend",(event)=>{
                        if(window.action_active) return;
                        this.node.parent._components[2].spawnNewObject("ground_machine");
                        this.node.parent._components[2].shop_open = false;
                        this.node.destroy();
                    },this)
                    break;   
                case "tree_type":
                    this.node.children[i].on("touchend",(event)=>{
                        if(window.action_active) return;
                        this.node.parent._components[2].spawnNewObject("ground_tree");
                        this.node.parent._components[2].shop_open = false;
                        this.node.destroy();
                    },this)
                    break;   
                default:
                    break;
            }
        }
    },

    start () {

    },

    // update (dt) {},
});
