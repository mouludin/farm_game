cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        if(!window.friend_meadow_load)return;
        this.pickRadius = this.node.height / 2;
        this.plant_name = "none";
        this.time_planting = 0;
        this.time_start = this.node._components[1].ownData.time_start;
        this.time_end = this.time_start + (this.time_planting * 1000);
        this.harvest = false;

        this.TimeShowDuration = 0;
    },
    
    // start () {
        
        // },
        
        
    update (dt) {
        if(!window.friend_meadow_load)return;
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            if(window.friend_meadow_load.object[i].ID == this.node._components[1].ownData.ID){
                this.plant_name = window.friend_meadow_load.object[i].plant;
                for(let j = 0;j < window.planting_data.length;j++){
                    if(window.planting_data[j].name == this.plant_name){
                        this.time_planting = window.planting_data[j].harvest_time;
                        this.stuff_identity = window.planting_data[j];
                    }
                }
                this.time_start = window.friend_meadow_load.object[i].time_start;
                this.time_end = this.time_start + (this.time_planting * 1000);
            }
        }
        if(this.plant_name != "none" && this.harvest == false){
            this.showPlant(this.get_prefab_by_name(this.plant_name));
        }

    },

    showPlant:function(a){
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

    get_prefab_by_name: function(name){
        let d = new Date();
        let result;
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);
        switch(name){
            case "wheat":
                if(get_percent <= 1 && get_percent > 0.5){
                    result = this.node._components[1].wheat_1_prefab;
                }else if(get_percent > 1){
                    result = this.node._components[1].wheat_2_prefab;
                }else if(get_percent <= 0.5 && get_percent >= 0){
                    result = this.node._components[1].seed_prefab;
                }
                return result;
            case "tomato":
                if(get_percent <= 1 && get_percent > 0.5){
                    result = this.node._components[1].tomato_1_prefab;
                }else if(get_percent > 1){
                    result = this.node._components[1].tomato_2_prefab;
                }else if(get_percent <= 0.5 && get_percent >= 0){
                    result = this.node._components[1].seed_prefab;
                }
                return result;

        }
    },

    
    destroySickle:function()
    {
        for(let i = 0; i < this.node.parent.children.length;i++)
        {
            if(this.node.parent.children[i]._name == "aret"){
                this.node.parent.children[i].destroy();
            }
        }
    },

    onTouch:function(){
        let d = new Date();
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);
        if(get_percent > 1){
            this.destroySickle()
            if(this.sickle_active || window.action_active) return;
            
            window.action_active = true;
            this.sickle_active = true;
            let newObject = cc.instantiate(this.node._components[1].sickle_prefab);
            this.node.parent.addChild(newObject);
            newObject.setPosition(cc.v2(this.node.x,this.node.y + 40));

            newObject.on("touchstart",(event)=>{
                this.mouseSickleDown = true;
            },this)
            newObject.on("touchmove",(event)=>{
                if(!this.mouseSickleDown) return;
                this.node.parent._components[1].MeadowMouseDown = false;

                newObject.x += event.getDelta().x / this.node.parent.scaleX;
                newObject.y += event.getDelta().y / this.node.parent.scaleY;

                for(let i = 0;i < this.node.parent.children.length;i++){
                    if(this.node.parent.children[i]._name == "planting_slot"){
                        if(this.node.parent.children[i]._components[2].harvest){
                            let dist = cc.v3(this.node.parent.children[i].x,this.node.parent.children[i].y).sub(cc.v3(newObject.x,newObject.y)).mag();
                            if(dist <= 10){
                                this.node.parent.children[i]._components[2].harvest_time();
                            }
                        }
                    }
                }
            },this)
            newObject.on("touchend",(event)=>{
                if(!this.sickle_active)return;
                this.mouseSickleDown = false;
                this.sickle_active = false;
                window.action_active = false;

                this.destroySickle();
            },this)

            this.node.parent.parent.on("touchstart",event=>{
                if(!this.sickle_active)return;
                let mouse_position_x = event.getLocation().x - (this.node.parent.parent.width / 2);
                let mouse_position_y = event.getLocation().y - (this.node.parent.parent.height / 2);
                
                let dist = cc.v3(mouse_position_x,mouse_position_y).sub(cc.v3(this.node.parent.x + (this.node.parent.children[this.node.parent.children.length - 1].x * this.node.parent.scaleX),this.node.parent.y + (this.node.parent.children[this.node.parent.children.length - 1].y * this.node.parent.scaleY))).mag();
                if(dist > 50 && this.sickle_active){
                    window.action_active = false;
                    this.sickle_active = false;
                    this.destroySickle();
                }
            },this)
        }
    },

    harvest_time:function(){
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            if(window.friend_meadow_load.object[i].ID == this.node._components[1].ownData.ID){
                let result = this.node.parent.parent._components[2].doActivity(i);
                if(result == false)return;
                this.node.parent.parent._components[2].achievement_request("help friends farm");
                this.node.parent.parent._components[2].addLevelPoint(this.stuff_identity.add_exp);
                window.friend_meadow_load.object[i].plant = "none";
                window.friend_meadow_load.object[i].time_start = 0;
                break;
            }
        }
        this.node.children[0].destroy();
        this.plant_name = "none";
        this.harvest = false;
    },

    showTime:function(){
        let d = new Date();
        let getTimeLeft = (this.time_end - this.time_start) - (d.getTime() - this.time_start);
        if(getTimeLeft > 0){
            let timeShowing = cc.instantiate(this.node.parent._components[2].time_showing);
            this.node.addChild(timeShowing);
            let timeLabel = cc.instantiate(this.node.parent._components[2].time_label);
            let get_minutes = (getTimeLeft - (getTimeLeft % 60000)) / 60000 ;
            let get_second = Math.floor((getTimeLeft % 60000) / 1000); // 60000 == 60 second;
            timeLabel._components[0].string = "" + get_minutes + ":" + get_second;
            this.node.addChild(timeLabel);
        }
    }
});