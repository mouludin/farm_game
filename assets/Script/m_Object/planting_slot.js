cc.Class({
    extends: cc.Component,

    properties: {
        sickle_prefab:{
            default:null,
            type:cc.Prefab
        },
        seed_prefab:{
            default:null,
            type:cc.Prefab
        },
        wheat_1_prefab:{
            default:null,
            type:cc.Prefab
        },
        wheat_2_prefab:{
            default:null,
            type:cc.Prefab
        },
        tomato_1_prefab:{
            default:null,
            type:cc.Prefab
        },
        tomato_2_prefab:{
            default:null,
            type:cc.Prefab
        },
    },
    
    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        if(window.friend_meadow_load)return;
        this.pickRadius = this.node.height / 2;
        this.plant_name = "none";
        this.time_planting = 0;
        this.time_start = this.ownData.time_start;
        this.time_end = this.time_start + (this.time_planting * 1000);
        this.harvest = false;

        this.TimeShowDuration = 0;
    },
    
    // start () {
        
        // },
        
        
    update (dt) {
        if(window.friend_meadow_load)return;
        for(let i = 0;i < window.default_data.object.length;i++){
            if(window.default_data.object[i].ID == this.ownData.ID){
                this.index_object = i;
                this.plant_name = window.default_data.object[i].plant;
                for(let j = 0;j < window.planting_data.length;j++){
                    if(window.planting_data[j].name == this.plant_name){
                        this.time_planting = window.planting_data[j].harvest_time;
                        this.stuff_identity = window.planting_data[j];
                    }
                }
                this.time_start = window.default_data.object[i].time_start;
                this.time_end = window.default_data.object[i].time_end;
            }
        }

        if(window.default_data.object[this.index_object].fertilizer != window.default_data.fertilizer_data.now.type){

            if(window.default_data.object[this.index_object].fertilizer == "none"){
                window.default_data.object[this.index_object].fertilizer = window.default_data.fertilizer_data.now.type;

                let fertilizer_result = this.fertilizer_result(window.default_data.fertilizer_data.now.type);
                let fertilizer_time = window.default_data.fertilizer_data.now.times_end - window.default_data.fertilizer_data.now.times_start;
                let out_left = window.default_data.fertilizer_data.now.times_start - window.default_data.object[this.index_object].time_start;
                let out_right = window.default_data.object[this.index_object].time_end - window.default_data.fertilizer_data.now.times_start;
                let out_right1 = out_right - (fertilizer_time * (fertilizer_result - 1));
                let result_end;

                if((out_right - (fertilizer_time * (fertilizer_result))) <= 0){
                    result_end = out_left + (out_right/fertilizer_result);
                }else{
                    result_end = out_left + out_right1;
                }

                window.default_data.object[this.index_object].time_end = window.default_data.object[this.index_object].time_start + result_end;
            }
        }

        if(this.plant_name != "none" && this.harvest == false){
            this.showPlant(this.get_prefab_by_name(this.plant_name));
            if(this.TimeShowDuration > 0)
            {
                this.showTime();
                this.TimeShowDuration -= 1;
            }
        }
    },

    onTouch:function(){
        let d = new Date();
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);
        if(this.plant_name == "none" && !window.action_active){

            this.node.parent.parent._components[2].spawnNewObject("circle_seeds_choice");

        }else if(get_percent > 1){

            this.destroySickle()
            if(this.sickle_active || window.action_active) return;
            
            window.action_active = true;
            this.sickle_active = true;
            let newObject = cc.instantiate(this.sickle_prefab);
            this.node.parent.addChild(newObject);
            newObject.setPosition(cc.v2(this.node.x,this.node.y + 40));
            this.node.parent.children.length - 1

            this.node.parent.children[this.node.parent.children.length - 1].on("touchstart",(event)=>{
                this.mouseSickleDown = true;
            },this)
            this.node.parent.children[this.node.parent.children.length - 1].on("touchmove",(event)=>{
                if(!this.mouseSickleDown) return;
                window.MeadowMouseDown = false;

                this.node.parent.children[this.node.parent.children.length - 1].x += event.getDelta().x / this.node.parent.scaleX;
                this.node.parent.children[this.node.parent.children.length - 1].y += event.getDelta().y / this.node.parent.scaleY;

                for(let i = 0;i < this.node.parent.children.length;i++){
                    if(this.node.parent.children[i]._name == "planting_slot"){
                        if(this.node.parent.children[i]._components[1].harvest){
                            let dist = cc.v3(this.node.parent.children[i].x,this.node.parent.children[i].y).sub(cc.v3(this.node.parent.children[this.node.parent.children.length - 1].x,this.node.parent.children[this.node.parent.children.length - 1].y)).mag();
                            if(dist <= 10){
                                this.node.parent.children[i]._components[1].harvest_time();
                            }
                        }
                    }
                }
            },this)
            this.node.parent.children[this.node.parent.children.length - 1].on("touchend",(event)=>{
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

        }else if(get_percent <= 1 && get_percent > 0){
            this.TimeShowDuration = 1000;
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
                    result = this.wheat_1_prefab;
                }else if(get_percent > 1){
                    result = this.wheat_2_prefab;
                }else if(get_percent <= 0.5 && get_percent >= 0){
                    result = this.seed_prefab;
                }
                return result;
            case "tomato":
                if(get_percent <= 1 && get_percent > 0.5){
                    result = this.tomato_1_prefab;
                }else if(get_percent > 1){
                    result = this.tomato_2_prefab;
                }else if(get_percent <= 0.5 && get_percent >= 0){
                    result = this.seed_prefab;
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

    harvest_time:function(){
        for(let i = 0;i < window.default_data.object.length;i++){
            if(window.default_data.object[i].ID == this.ownData.ID){

                let result = this.node.parent.parent._components[2].addItemOnStorage(this.ownData.plant,1);
                if(result[1] == true)return;

                let x = this.node.parent.x + (this.node.x * this.node.parent.scaleX);
                let y = this.node.parent.y + (this.node.y * this.node.parent.scaleY);
                this.node.parent.parent._components[2].getItemAction(this.ownData.plant,x,y);
                
                let activity_string = "harvest "+this.ownData.plant;
                this.node.parent.parent._components[2].getActivity(activity_string);
                this.node.parent.parent._components[2].achievement_request("harvest from plants");
                
                this.node.parent.parent._components[2].addLevelPoint(this.stuff_identity.add_exp);
                window.default_data.object[i].plant = "none";
                window.default_data.object[i].time_start = 0;
                break;
            }
        }
        this.node.children[0].destroy();
        this.plant_name = "none";
        this.harvest = false;
    },

    showTime:function(){
        let d = new Date();
        let fertilizer_result = this.fertilizer_result(window.default_data.fertilizer_data.now.type);
        let getTimeLeft = (this.time_end - this.time_start) - (d.getTime() - this.time_start);
        if(window.default_data.fertilizer_data.now.type != "none"){
            let out_ = this.time_end - window.default_data.fertilizer_data.now.times_end;
            if(out_ > 0){
                getTimeLeft = (getTimeLeft - out_) + (out_ / fertilizer_result)
            }
        }
        if(getTimeLeft > 0){
            let timeShowing = cc.instantiate(this.node.parent._components[1].time_showing);
            this.node.addChild(timeShowing);
            let timeLabel = cc.instantiate(this.node.parent._components[1].time_label);


            let get_minutes = (getTimeLeft - (getTimeLeft % (60000/fertilizer_result))) / (60000/fertilizer_result) ;
            let get_second = Math.floor((getTimeLeft % (60000/fertilizer_result)) / (1000/fertilizer_result)); // 60000 == 60 second;
            timeLabel._components[0].string = "" + get_minutes + ":" + get_second;
            this.node.addChild(timeLabel);
        }
    },

    fertilizer_result:function(times){
        switch (times) {
            case "none": return 1;
            case "x2": return 2;
            case "x4": return 4;
            case "x8": return 8;
            default:
                console.error("unknown fertilizer: " + times);
                break;
        }
    }
});