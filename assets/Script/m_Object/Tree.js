cc.Class({
    extends: cc.Component,

    properties: {
        type_of_tree:cc.String,
        tree_1:{
            default:null,
            type:cc.Prefab
        },
        tree_2:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(window.friend_meadow_load)return;
        this.pickRadius = this.node.width / 2;
        this.time_planting = 0;
        this.time_start = this.ownData.time_start;
        this.time_end = this.time_start + (this.time_planting * 1000);
        this.harvest = false;
        this.already_watered = false;
        this.stuff_identity;
        this.TimeShowDuration = 0;
    },

    start () {

    },

    update (dt) {
        if(window.friend_meadow_load)return;
        for(let i = 0;i < window.default_data.object.length;i++){
            if(window.default_data.object[i].ID == this.ownData.ID){
                for(let j = 0;j < window.stuff_identity.length;j++){
                    if(window.stuff_identity[j].name == this.type_of_tree){
                        this.time_planting = window.stuff_identity[j].harvest_time;
                        this.stuff_identity = window.stuff_identity[j];
                        break;
                    }
                }
                this.index_of_data_object = i;
                this.already_watered = window.default_data.object[i].already_watered;
                this.time_start = window.default_data.object[i].time_start;
                this.time_end = window.default_data.object[i].time_end;
                // this.time_end = this.time_start + (this.time_planting * 1000);
                break;
            }
        }

        if(window.default_data.object[this.index_of_data_object].fertilizer != window.default_data.fertilizer_data.now.type){
            let d = new Date()
            if(window.default_data.object[this.index_of_data_object].fertilizer == "none" && 
            window.default_data.object[this.index_of_data_object].already_watered == true && 
            window.default_data.object[this.index_of_data_object].time_end > d.getTime()){
                
                window.default_data.object[this.index_of_data_object].fertilizer = window.default_data.fertilizer_data.now.type;

                let fertilizer_result = this.fertilizer_result(window.default_data.fertilizer_data.now.type);
                let normal_end = window.default_data.object[this.index_of_data_object].time_end - window.default_data.object[this.index_of_data_object].time_start;

                let fertilizer_time = window.default_data.fertilizer_data.now.times_end - window.default_data.fertilizer_data.now.times_start;
                let out_left = window.default_data.fertilizer_data.now.times_start - window.default_data.object[this.index_of_data_object].time_start;
                let out_right = window.default_data.object[this.index_of_data_object].time_end - window.default_data.fertilizer_data.now.times_start;
                let out_right1 = out_right - (fertilizer_time * (fertilizer_result - 1));
                let result_end;

                if((out_right - (fertilizer_time * (fertilizer_result))) <= 0){
                    result_end = out_left + (out_right/fertilizer_result);
                    // console.log(1 + " : " + (result_end / 1000) + " > out_right1 : " +out_right1+ " > " + (fertilizer_time * (fertilizer_result - 1)));
                    // console.log("left : " + out_left/1000 + ", right :" + (out_right/fertilizer_result)/1000);
                }else{
                    result_end = out_left + out_right1;
                    // console.log(2 + " : " + (result_end / 1000) + " > out_right1 : " +out_right1+ " > " + (fertilizer_time * (fertilizer_result - 1)));
                    // console.log("left : " + out_left/1000 + ", right :" + out_right1/1000);
                }

                window.default_data.object[this.index_of_data_object].time_end = window.default_data.object[this.index_of_data_object].time_start + result_end;
            }
        }

        if(this.harvest == false && this.already_watered){
            this.showFruit(this.get_prefab());
            if(this.TimeShowDuration > 0)
            {
                this.showTime();
                this.TimeShowDuration -= 1;
            }
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
            result = this.tree_1;
        }else if(get_percent >= 1){
            result = this.tree_2;
        }

        return result;
    },

    showTime:function(){
        let d = new Date();
        let fertilizer_result = this.fertilizer_result(window.default_data.fertilizer_data.now.type);
        let getTimeLeft = (this.time_end - this.time_start) - (d.getTime() - this.time_start);
        if(window.default_data.fertilizer_data.now.type != "none"){
            let out_ = this.time_end - window.default_data.fertilizer_data.now.times_end;
            if(out_ > 0){
                getTimeLeft = (getTimeLeft - out_) + (out_ /fertilizer_result);
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
    
    onTouch:function(){
        let d = new Date();
        let get_percent = (d.getTime() - this.time_start) / (this.time_end - this.time_start);
	    if(!this.already_watered){
            this.destroy_bucket();
            let bucket = cc.instantiate(this.node.parent._components[1].Bucket);
            this.node.parent.addChild(bucket);
            bucket.setPosition(cc.v2(this.node.x,this.node.y + this.node.height));
            this.bucket_active = true;
            window.action_active = true;

            for(let i = 0;i < this.node.parent.children.length;i++){
                if(this.node.parent.children[i]._name == "bucket")
                {
                    this.node.parent.children[i].on("touchstart",event => {
                        this.mouseBucketDown = true;
                    },this);
                    this.node.parent.children[i].on("touchmove",event => {
                        if(!this.mouseBucketDown)return;
                        window.MeadowMouseDown = false;

                        this.node.parent.children[i].x += event.getDelta().x / this.node.parent.scaleX;
                        this.node.parent.children[i].y += event.getDelta().y / this.node.parent.scaleY;

                        for(let j = 0;j < this.node.parent.children.length;j++){
                            if(this.node.parent.children[j]._components[1] != undefined){
                                if(this.node.parent.children[j]._components[1].stuff_identity != undefined){
                                    if(this.node.parent.children[j]._components[1].stuff_identity.type == "tree"){
                                        if(this.node.parent.children[j]._components[1].already_watered == false){
                                            let dist = cc.v2(this.node.parent.children[j].x,this.node.parent.children[j].y).sub(cc.v2(this.node.parent.children[i].x,this.node.parent.children[i].y)).mag();
                                            if(dist <= 10){
                                                let d = new Date();
                                                window.default_data.object[this.node.parent.children[j]._components[1].ownData.ID].time_start = d.getTime();
                                                let our_time_start = window.default_data.object[this.node.parent.children[j]._components[1].ownData.ID].time_start;
                                                let time_end;
                                                let time_planting = this.node.parent.children[j]._components[1].stuff_identity.harvest_time;

                                                if( window.default_data.fertilizer_data.now.type != "none"){
                                                    let fertilizer_result = this.fertilizer_result(window.default_data.fertilizer_data.now.type);
                                                    let fertilizer_time = window.default_data.fertilizer_data.now.times_end - our_time_start;
                                                    let count_time = (time_planting * 1000) - (fertilizer_time * (fertilizer_result - 1));
                                                    let result_end;
                                                    
                                                    if((time_planting * 1000) - (fertilizer_time * (fertilizer_result)) <= 0){
                                                        result_end = (time_planting * 1000) / fertilizer_result;
                                                        // console.log(1 +"). "+ result_end/1000);
                                                    }else{
                                                        result_end = count_time;
                                                        // console.log(2 +"). "+ result_end/1000);
                                                    }
                                                    time_end =  our_time_start + result_end;
                                                }else if(window.default_data.fertilizer_data.now.type == "none"){
                                                    time_end = our_time_start + (time_planting * 1000);
                                                }else{
                                                    console.error("unknown : " + window.default_data.fertilizer_data.now.type)
                                                }



                                                window.default_data.object[this.node.parent.children[j]._components[1].ownData.ID].time_end = time_end
                                                window.default_data.object[this.node.parent.children[j]._components[1].ownData.ID].fertilizer = window.default_data.fertilizer_data.now.type;
                                                window.default_data.object[this.node.parent.children[j]._components[1].ownData.ID].already_watered = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },this);
                    this.node.parent.children[i].on("touchend",event => {
                        this.mouseBucketDown = false;
                        this.destroy_bucket();
                    },this);

                    this.node.parent.parent.on("touchstart",event=>{
                        if(!this.bucket_active)return;
                        let mouse_position_x = event.getLocation().x - (this.node.parent.parent.width / 2);
                        let mouse_position_y = event.getLocation().y - (this.node.parent.parent.height / 2);
        
                        let dist = cc.v2(mouse_position_x,mouse_position_y).sub(cc.v2(this.node.parent.x + (this.node.parent.children[this.node.parent.children.length - 1].x * this.node.parent.scaleX),this.node.parent.y + (this.node.parent.children[this.node.parent.children.length - 1].y * this.node.parent.scaleY))).mag();
                        if(dist > 50 && this.bucket_active){
                            this.destroy_bucket();
                        }
                    },this)

                }
            }
	    }else if(get_percent > 1){
            this.harvest_time();
        }else if(get_percent <= 1 && get_percent > 0){
            this.TimeShowDuration = 5000;
        }
    },
    
    harvest_time:function(){
        let result = this.node.parent.parent._components[2].addItemOnStorage(this.type_of_tree,this.stuff_identity.harvest_total);
        if(result[1] == true)return;

        let x = this.node.parent.x + (this.node.x * this.node.parent.scaleX);
        let y = this.node.parent.y + (this.node.y * this.node.parent.scaleY);
        this.node.parent.parent._components[2].getItemAction(this.type_of_tree,x,y);

        let activity_string = "harvest "+this.type_of_tree;
        this.node.parent.parent._components[2].getActivity(activity_string,this.stuff_identity.harvest_total);
        this.node.parent.parent._components[2].achievement_request("harvest from trees",this.stuff_identity.harvest_total);
        this.node.parent.parent._components[2].addLevelPoint(this.stuff_identity.add_exp);
        
        window.default_data.object[this.index_of_data_object].already_watered = false;
        window.default_data.object[this.index_of_data_object].time_start = 0;
        this.node.children[0].destroy();
        this.harvest = false;
    },
    destroy_bucket:function(){
        for(let i = 0;i < this.node.parent.children.length;i++){
            if(this.node.parent.children[i]._name == "bucket")
            {
                this.bucket_active = false;
                this.node.parent.children[i].destroy();
                window.action_active = false;
            }
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