cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.stuff_prefab;
        this.initial_x;
        this.initial_y;
        this.degree_by_index_per_length;

        this.spawnNewObject(this.stuff_prefab,cc.v2(4,-8));
        this.onDrag();
    },

    onDrag(){
        let mouseDown = false;

        this.node.on("touchstart", (event) => {
            if(this.plant.available_level > window.our_level)return;
            mouseDown = true;
        });
        
        this.node.on("touchmove", (event) => {
            if(!mouseDown) return;
            window.MeadowMouseDown = false;
            let delta = event.getDelta();

            for(let i = 0;i < window.default_data.object.length;i++){
                if(window.default_data.object[i].name == "planting_slot"){
                    let position_planting_slot_by_window_x = window.default_data.object[i].coord.x * this.node.parent.parent.children[window.m_i].scaleX + this.node.parent.parent.children[window.m_i].getPosition().x;
                    let position_planting_slot_by_window_y = window.default_data.object[i].coord.y * this.node.parent.parent.children[window.m_i].scaleY + this.node.parent.parent.children[window.m_i].getPosition().y;
                    let position_this_bags_by_window_x = this.node.x * this.node.parent.scaleX + this.node.parent.getPosition().x;
                    let position_this_bags_by_window_y = this.node.y * this.node.parent.scaleY + this.node.parent.getPosition().y;
    
                    
                    let dist = cc.v2(position_this_bags_by_window_x,position_this_bags_by_window_y).sub(cc.v2(position_planting_slot_by_window_x,position_planting_slot_by_window_y)).mag();
                    
                    if(dist < this.node.width/2){
                        if(window.default_data.object[i].plant == "none"){
                            if(window.default_data.identity.money > this.plant.price){
                                window.default_data.identity.money -= this.plant.price;
                                window.default_data.object[i].plant = this.plant.name;

                                let activity_string = "plant "+this.plant.name;
                                this.node.parent.parent._components[2].getActivity(activity_string);
                                
                                let d = new Date();
                                window.default_data.object[i].time_start = d.getTime();
                                let our_time_start = window.default_data.object[i].time_start;
                                
                                let time_end;
                                if( window.default_data.fertilizer_data.now.type != "none"){

                                    let fertilizer_result = this.fertilizer_result(window.default_data.fertilizer_data.now.type);
                                    let fertilizer_time = window.default_data.fertilizer_data.now.times_end - our_time_start;
                                    let count_time = (this.plant.harvest_time * 1000) - (fertilizer_time * (fertilizer_result - 1));
                                    let result_end;

                                    if((this.plant.harvest_time * 1000) - (fertilizer_time * (fertilizer_result)) <= 0){
                                        result_end = (this.plant.harvest_time * 1000) / fertilizer_result;
                                    }else{
                                        result_end = count_time;
                                    }

                                    time_end = our_time_start + result_end;

                                }else{
                                    time_end = our_time_start + (this.plant.harvest_time * 1000);
                                }
                                window.default_data.object[i].time_end = time_end;
                                window.default_data.object[i].fertilizer = window.default_data.fertilizer_data.now.type;
                                this.node.parent.parent._components[2].organize_data();
                            }
                        }
                    }
                }
            }
            
            this.node.x += delta.x / this.node.parent.scaleX;
            this.node.y += delta.y / this.node.parent.scaleY;

        });

        this.node.on("touchend", (event) => {
            mouseDown = false;
            this.node.x = this.initial_x;
            this.node.y = this.initial_y;
        });
    },

    start () {

    },

    spawnNewObject: function(a,position){
        let newObject;
        if(this.plant.available_level <= window.our_level){
            newObject = cc.instantiate(a);
        }else{
            newObject = cc.instantiate(this.node.parent.parent._components[2].get_object_by_macros("padlock"));
        }
        newObject.scaleX = 0.5;
        newObject.scaleY = 0.5;
        this.node.addChild(newObject);
        newObject.setPosition(position);

        if(this.plant.available_level <= window.our_level){
            let price_label = cc.instantiate(this.label_price);
            price_label._components[0].string = "$"+this.plant.price;
            this.node.addChild(price_label);
            price_label.setPosition(cc.v2(0,-(this.node.height / 2)));
        }else{
            let level_needed = cc.instantiate(this.label_price);
            level_needed._components[0].string = "Lv."+this.plant.available_level;
            this.node.addChild(level_needed);
            level_needed.setPosition(cc.v2(0,-(this.node.height / 2)));
        }

    },

    rotate: function(purpose){
        let pos;
        let changed;
        if(purpose == "right"){
            changed = -5;
        }else if(purpose == "left"){
            changed = 5;
        }
        
        this.degree_by_index_per_length = this.degree_by_index_per_length + changed;

        pos = this.rotation_transform_formula(0,32,this.degree_by_index_per_length,360);

        this.node.x = pos.x;
        this.node.y = pos.y;
        this.initial_x = pos.x;
        this.initial_y = pos.y;
    },

    rotation_transform_formula(x,y,index,length){
        let times_PI_square = (Math.PI * 2) * (index/length);
        let result =  {
            x:(Math.cos(times_PI_square) * x) + (-Math.sin(times_PI_square) * y),
            y:(Math.sin(times_PI_square) * x) + (Math.cos(times_PI_square) * y)
        }
        return result;
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

    // update (dt) {},
});