cc.Class({
    extends: cc.Component,

    properties: {
        on_process_prefab:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.machine_data;
        this.add_machine_item_box = false;
        this.get_our_data();
        this.item_data_i_need = [];
        this.queue_box_index = [];
        this.already_spawn_time = false;
        this.getGLobalTimeLeft = 0;
        this.have_child = false;
        this.have_child_before = false;
        this.collect_data = [null,null,null];
    },

    start () {

    },

    onTouch(){
        if(window.action_active) return;
        
        this.meadow_auto_move = true;
        this.mn_pos = [-this.node.x * this.node.parent.scaleX,-this.node.y * this.node.parent.scaleY];
        this.m_pos = [this.node.parent.x,this.node.parent.y];
        this.m_mn_percent = 0;
    },
    
    update (dt) {
        this.have_process_check();
        
        this.auto_move_meadow();
        
        if(this.queue_box_index.length == 3){
            if(this.queue_child_added){
                let d = new Date();
                let now = d.getTime();
                let sum_of_all_queued_time = 0;
                this.arrayTimeLeft = [];
                let last_index = 0;
                for(let i = 0;i < window.default_data.object[this.ownData.ID].process_data.queue.length;i++){
                    if(window.default_data.object[this.ownData.ID].process_data.queue[i] != null){
                        last_index = i;
                    }
                }
                
                for(let i = 0;i < window.default_data.object[this.ownData.ID].process_data.queue.length;i++){
                    if(window.default_data.object[this.ownData.ID].process_data.queue[i] != null){
                        let our_queue = window.default_data.object[this.ownData.ID].process_data.queue[i];
                        let time_production = this.getMachineData(our_queue).time_production * 1000;
                        let get_queue_time = time_production + sum_of_all_queued_time;
                        let getTimeLeft = window.default_data.object[this.ownData.ID].process_data.start_time + get_queue_time - now; 
                        sum_of_all_queued_time += time_production;
                        this.arrayTimeLeft[i] = sum_of_all_queued_time;
                        let queue_box_index;
                        for(let j = 0;j < this.node.parent.parent.children.length;j++){
                            if(this.node.parent.parent.children[j].uuid == this.queue_box_index[i].uuid){
                                queue_box_index = j;
                                this.queue_box_index[i].index = j;
                                break;
                            }
                        }
                        if(getTimeLeft <= 0){
                            this.node.parent.parent.children[queue_box_index]._components[1].button_or_time_or_not = "button";
                            let plus = 0;
                            if(i != 0){
                                plus = this.arrayTimeLeft[i-1];
                            };
                            if(i == last_index){
                                let d = new Date();
                                window.default_data.object[this.ownData.ID].process_data.start_time = d.getTime() - this.arrayTimeLeft[i] ;
                            }


                            this.collect_data[i] = time_production;
                            this.node.parent.parent.children[queue_box_index]._components[1].timeLeft = this.arrayTimeLeft[i] - plus;
                            this.node.parent.parent.children[queue_box_index]._components[1].collect_exp = this.getMachineData(our_queue).add_exp;
                            this.queue_box_index[i].add_time = false;
                        }else if(getTimeLeft > 0){
                            this.collect_data[i] = null;
                            this.node.parent.parent.children[queue_box_index]._components[1].button_or_time_or_not = "time";
                            this.node.parent.parent.children[queue_box_index]._components[1].start_time = window.default_data.object[this.ownData.ID].process_data.start_time + get_queue_time;
                            this.node.parent.parent.children[queue_box_index]._components[1].machine_index = this.ownData.ID;
                            this.node.parent.parent.children[queue_box_index]._components[1].timeLeftShow = time_production;
                            this.node.parent.parent.children[queue_box_index]._components[1].collect_exp = 0;
                        }else{
                            this.collect_data[i] = null;
                            this.node.parent.parent.children[queue_box_index]._components[1].button_or_time_or_not = "none";
                            this.node.parent.parent.children[queue_box_index]._components[1].collect_exp = 0;
                        }
                    }else if(window.default_data.object[this.ownData.ID].process_data.queue[i] == null){
                        this.collect_data[i] = null;
                        if(i == 0){
                            window.default_data.object[this.ownData.ID].process_data.start_time = now;
                        }
                    }
                }
            }else{
                this.queue_child_added = true;
                for(let i = 0;i < window.default_data.object[this.ownData.ID].process_data.queue.length;i++){
                    if(!this.node.parent.parent.children[this.queue_box_index[i].index])return;
                    if(window.default_data.object[this.ownData.ID].process_data.queue[i] != null){
                        this.node.parent.parent.children[this.queue_box_index[i].index]._components[1].our_queue = window.default_data.object[this.ownData.ID].process_data.queue[i];
                    }else if(window.default_data.object[this.ownData.ID].process_data.queue[i] == null){
                        this.node.parent.parent.children[this.queue_box_index[i].index]._components[1].our_queue = "none";
                    }
                }
            }
        }

        if(this.have_child_before != this.have_child){
            this.have_child_before = this.have_child
            if(this.have_child_before == true){
                let newObject = cc.instantiate(this.on_process_prefab);
                newObject.width = this.node.width;
                newObject.height = this.node.height;
                newObject.anchorX = this.node.anchorX;
                newObject.anchorY = this.node.anchorY;
                this.node.addChild(newObject);
                newObject.setPosition(cc.v2(0,0))
            }else if(this.have_child_before == false){
                for(let i = 0;i < this.node.children.length;i++){
                    if(this.node.children[i].name == this.on_process_prefab.data.name){
                        this.node.children[i].destroy();
                    }
                }
            }
        }
    },

    auto_move_meadow:function(){
        if(this.meadow_auto_move == true){
            this.node.parent.x = this.m_pos[0] + ((this.mn_pos[0] - this.m_pos[0]) * this.m_mn_percent);
            this.node.parent.y = this.m_pos[1] + ((this.mn_pos[1] - this.m_pos[1]) * this.m_mn_percent);
            this.m_mn_percent += 0.1;
            if(this.m_mn_percent >= 1){
                this.meadow_auto_move = false;
                window.action_active = true;
                this.show_all();
            }
        }
    },
    
    get_our_data:function(){
        for(let i = 0;i < window.all_machine_data.length;i++){
            if(window.all_machine_data[i].name == this.node.name)
            {
                this.machine_data = window.all_machine_data[i];
                break;
            }
        }
    },

    show_all:function(){
        this.add_machine_item_box = true;

        this.spawn_machine_item();
        this.spawn_queue_box();

        this.node.parent.on("touchstart",event => {
            if(this.add_machine_item_box && this.queue_box_index.length > 0){
                this.add_machine_item_box = false;
                this.destroy_all();
                window.action_active = false; 
            }
        },this)
    },

    spawn_machine_item:function(){
        for(let i = 0;i < 6;i++){
            if(!this.machine_data.produce[i]) return;
            
            let newObject = cc.instantiate(this.node.parent.parent._components[2].get_object_by_macros("machine_item_box"));

            let x;

            let right_or_left;

            if(i < 3){ right_or_left = -1}
            else if(i >= 3 && i < 6){ right_or_left = 1 }

            x = this.node.height * right_or_left * (2/this.node.parent.scaleX);

            let yy = i;
            if(yy > 2) yy -= 3;
            if(yy == 1) x += newObject.width * right_or_left;
            let y = ((this.node.height) - ((yy/3) * (this.node.height * 2))) * (2/this.node.parent.scaleX);

            newObject._components[1].item_data = this.machine_data.produce[i];
            newObject._components[1].machine_data = this.ownData;
            newObject._components[1].first_x = this.node.parent.x + ((this.node.x + x) * this.node.parent.scaleX);
            newObject._components[1].first_y = this.node.parent.y + ((this.node.y + y) * this.node.parent.scaleY);

            this.node.parent.parent.addChild(newObject);
            this.node.parent.parent.children[this.node.parent.parent.children.length - 1].width *= 3; 
            this.node.parent.parent.children[this.node.parent.parent.children.length - 1].height *= 3;
            this.item_data_i_need.push(this.node.parent.parent.children.length - 1);
            
            newObject.setPosition(cc.v2(
                this.node.parent.x + ((this.node.x + x) * this.node.parent.scaleX),
                this.node.parent.y + ((this.node.y + y) * this.node.parent.scaleY)
                ));
        }
    },
    spawn_queue_box:function(){
        for(let i = 0;i < this.node.parent.parent.children.length;i++){
            if(this.node.parent.parent.children[i].name == "queue_box"){
                this.node.parent.parent.children[i].destroy();
            }
        }

        this.queue_box_index = [];
        this.queue_child_added = false;

        for(let i = 0;i < window.default_data.object[this.ownData.ID].process_data.queue.length;i++){
            let newObject = cc.instantiate(this.node.parent.parent._components[2].get_object_by_macros("queue_box"));
            let x = this.node.parent.x + (this.node.x * this.node.parent.scaleX) - newObject.width;
            let y = this.node.parent.y + (this.node.y * this.node.parent.scaleY) - (this.node.height * 2 ) ;
            newObject._components[1].machine_data = this.ownData;
            newObject._components[1].queue_box_index = i;
            this.node.parent.parent.addChild(newObject);
            this.queue_box_index.push({index:this.node.parent.parent.children.length - 1,uuid:newObject.uuid});
            newObject.setPosition(cc.v2(
                x + (i * newObject.width),
                y
                ));
            }
    },

    destroy_all(){
        for(let k = 0;k < this.node.parent.parent.children.length;k++){
            if(this.node.parent.parent.children[k].name == "machine_item_box"){
                this.node.parent.parent.children[k].destroy();
            }
        }
        for(let k = 0;k < this.node.parent.parent.children.length;k++){
            if(this.node.parent.parent.children[k].name == "queue_box"){
                this.node.parent.parent.children[k].destroy();
            }
        }
        this.item_data_i_need = [];
        this.add_machine_item_box = false; 
        this.queue_box_index = [];
        this.queue_child_added = false;
        this.already_spawn_time = false;   
        sum_of_all_queued_time = 0;
    },

    have_process_check:function(){
        let have_process = false;

        if(this.ownData){
            if(!window.friend_meadow_load){
                for(let i = 0;i < window.default_data.object[this.ownData.ID].process_data.queue.length;i++){
                    if(window.default_data.object[this.ownData.ID].process_data.queue[i] != null){
                        have_process = true;
                        break;
                    }
                }
            }else{
                for(let i = 0;i < window.friend_meadow_load.object[this.ownData.ID].process_data.queue.length;i++){
                    if(window.friend_meadow_load.object[this.ownData.ID].process_data.queue[i] != null){
                        have_process = true;
                        break;
                    }
                }
            }
        }
        if(have_process == true){
            this.have_child = true;
        }else{
            this.have_child = false;
        }
    },

    getMachineData:function(a){
        let result;
        for(let i = 0;i < window.all_machine_data[0].produce.length;i++){
            if(window.all_machine_data[0].produce[i].name == a){
                result = window.all_machine_data[0].produce[i];
                break;
            }
        }
        return result;
    }
});
