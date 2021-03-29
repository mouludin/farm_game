cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(!window.friend_meadow_load)return;
        this.time_produce = 0;
        this.time_start = this.node._components[1].ownData.time_start;
        this.time_end = this.time_start + (this.time_produce * 1000);
        this.produce = false;
        this.already_fed = false;
        this.stuff_identity;
        this.stuff_identity_index;
        this.TimeShowDuration = 0;
        this.item_data_i_need = [];

        this.current_prefab = this.before_fed_prefab;
        this.showPrefab(this.get_prefab()); 
    },

    start () {

    },

    update (dt) {
        if(!window.friend_meadow_load)return;
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            for(let j = 0;j < window.stuff_identity.length;j++){
                if(window.stuff_identity[j].name == this.node._components[1].animal_name){
                    this.time_produce = window.stuff_identity[j].produce_time;
                    this.stuff_identity = window.stuff_identity[j];
                    this.stuff_identity_index = j;
                    break;
                }
            }
            if(this.node._components[1].ownData.shop){
                this.already_fed = false;
                this.time_start = 0;
                this.time_end = this.time_start + (this.time_produce * 1000);
                return;
            }
            if(window.friend_meadow_load.object[i].ID == this.node._components[1].ownData.ID){
                this.index_of_data_object = i;
                this.already_fed = window.friend_meadow_load.object[i].already_fed;
                this.time_start = window.friend_meadow_load.object[i].time_start;
                this.time_end = this.time_start + (this.time_produce * 1000);
                break;
            }
        }

        if(this.get_prefab() != this.current_prefab)
        {
            this.showPrefab(this.get_prefab())
        }

    },

    onTouch:function(){
        if(window.action_active)return;
        if(this.current_prefab == this.node._components[1].time_produce_prefab){
            this.produce_time();
        }
    },

    showPrefab:function(a){
        this.node._children = [];
        let newObject = cc.instantiate(a);
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(0,0));
        this.current_prefab = a;
    },

    get_prefab: function(){
        let d = new Date();
        let result;
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);

        if(this.already_fed == false){
            result = this.node._components[1].before_fed_prefab;
        }else if(get_percent < 1 && get_percent >= 0){
            result = this.node._components[1].after_fed_prefab;
        }else if(get_percent >= 1){
            result = this.node._components[1].time_produce_prefab;
        }

        return result;
    },

    produce_time:function(){
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            if(window.friend_meadow_load.object[i].ID == this.node._components[1].ownData.ID){
                let result = this.node.parent.parent._components[2].doActivity(i);
                if(result == false)return;
                this.node.parent.parent._components[2].achievement_request("help friends farm");
                this.node.parent.parent._components[2].addLevelPoint(this.stuff_identity.add_exp);
                window.friend_meadow_load.object[i].already_fed = false;
                window.friend_meadow_load.object[i].time_start = 0;
                break;
            }
        }
    }

});
