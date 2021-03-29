cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(!window.friend_meadow_load)return;
        this.pickRadius = this.node.width / 2;
        this.time_planting = 0;
        this.time_start = this.node._components[1].ownData.time_start;
        this.time_end = this.time_start + (this.time_planting * 1000);
        this.harvest = false;
        this.already_watered = false;
        this.stuff_identity;
    },

    start () {

    },

    update (dt) {
        if(!window.friend_meadow_load)return;
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            if(window.friend_meadow_load.object[i].ID == this.node._components[1].ownData.ID){
                for(let j = 0;j < window.stuff_identity.length;j++){
                    if(window.stuff_identity[j].name == this.node._components[1].type_of_tree){
                        this.time_planting = window.stuff_identity[j].harvest_time;
                        this.stuff_identity = window.stuff_identity[j];
                        break;
                    }
                }
                this.index_of_data_object = i;
                this.already_watered = window.friend_meadow_load.object[i].already_watered;
                this.time_start = window.friend_meadow_load.object[i].time_start;
                this.time_end = this.time_start + (this.time_planting * 1000);
                break;
            }
        }

        if(this.harvest == false && this.already_watered){
            this.showFruit(this.get_prefab());
        }
    },

    showFruit:function(a){
        this.node._children = [];
        let newObject = cc.instantiate(a);
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(0,0));

        let d = new Date();
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);
        if(get_percent > 1){
            this.harvest = true;
        }
    },

    get_prefab: function(){
        let d = new Date();
        let result;
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);

        if(get_percent < 1 && get_percent >= 0){
            result = this.node._components[1].tree_1;
        }else if(get_percent >= 1){
            result = this.node._components[1].tree_2;
        }

        return result;
    },
    
    onTouch:function(){
        let d = new Date();
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);
        if(get_percent > 1 && this.already_watered){
            this.harvest_time();
        }
    },
    
    harvest_time:function(){
        // let activity_string = "harvest "+this.node._components[1].type_of_tree;
        // this.node.parent.parent._components[2].getActivity(activity_string,this.stuff_identity.harvest_total);
        
        let result = this.node.parent.parent._components[2].doActivity(this.index_of_data_object);
        if(result == false)return;
        
        window.friend_meadow_load.object[this.index_of_data_object].already_watered = false;
        window.friend_meadow_load.object[this.index_of_data_object].time_start = 0;
        this.node.parent.parent._components[2].achievement_request("help friends farm");
        this.node.parent.parent._components[2].addLevelPoint(this.stuff_identity.add_exp);
        this.node.children[0].destroy();
        this.harvest = false;
    },
});
