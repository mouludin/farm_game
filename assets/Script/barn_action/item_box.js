// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        item_name:"unknown",
        total:0,
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log(this.item_name + " : " + this.total);
        let item_prefab = this.node.parent._components[1].get_object_by_macros(this.item_name);
        this.spawnNewObject(item_prefab,cc.v2(0,0),{
            item:true
        });
        this.spawnNewObject(this.node.parent._components[1].total_label,cc.v2(42,-36),{
            string:this.total,
        });
    },
    
    update (dt) {
    },
    
    start () {
        
    },
    
    spawnNewObject: function(a,position,data){
        let newObject = cc.instantiate(a);
        this.node.addChild(newObject);
        if(data){
            if(data.string){
                newObject._components[0].string = `${data.string}`;
            }
            if(data.item){
                newObject.width *= 2;
                newObject.height *= 2;
            }
        }
        newObject.setPosition(position);
    },
});
