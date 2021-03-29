cc.Class({
    extends: cc.Component,

    properties: {
        animal_name:cc.String,
        before_fed_prefab:{
            default:null,
            type:cc.Prefab
        },
        after_fed_prefab:{
            default:null,
            type:cc.Prefab
        },
        time_produce_prefab:{
            default:null,
            type:cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(window.friend_meadow_load)return;
        this.time_produce = 0;
        this.time_start = this.ownData.time_start;
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
        if(window.friend_meadow_load)return;
        this.auto_move_meadow();
        for(let i = 0;i < window.default_data.object.length;i++){
            for(let j = 0;j < window.stuff_identity.length;j++){
                if(window.stuff_identity[j].name == this.animal_name){
                    this.time_produce = window.stuff_identity[j].produce_time;
                    this.stuff_identity = window.stuff_identity[j];
                    this.stuff_identity_index = j;
                    break;
                }
            }
            if(this.ownData.shop){
                this.already_fed = false;
                this.time_start = 0;
                this.time_end = this.time_start + (this.time_produce * 1000);
                return;
            }
            if(window.default_data.object[i].ID == this.ownData.ID){
                this.index_of_data_object = i;
                this.already_fed = window.default_data.object[i].already_fed;
                this.time_start = window.default_data.object[i].time_start;
                this.time_end = this.time_start + (this.time_produce * 1000);
                break;
            }
        }

        if(this.get_prefab() != this.current_prefab)
        {
            this.showPrefab(this.get_prefab())
        }

        if(this.TimeShowDuration > 0)
        {
            this.showTime();
            this.TimeShowDuration -= 1;
        }

    },

    onTouch:function(){
        if(window.action_active)return;
        window.action_active = true;
        if(this.current_prefab == this.after_fed_prefab){
            this.TimeShowDuration = 200;
        }else if(this.current_prefab == this.time_produce_prefab){
            this.produce_time();
        }else if(this.current_prefab == this.before_fed_prefab){
            this.meadow_auto_move = true;
            this.mn_pos = [-this.node.x * this.node.parent.scaleX,-this.node.y * this.node.parent.scaleY];
            this.m_pos = [this.node.parent.x,this.node.parent.y];
            this.m_mn_percent = 0;
        }
    },

    auto_move_meadow:function(){
        if(this.meadow_auto_move == true){
            this.node.parent.x = this.m_pos[0] + ((this.mn_pos[0] - this.m_pos[0]) * this.m_mn_percent);
            this.node.parent.y = this.m_pos[1] + ((this.mn_pos[1] - this.m_pos[1]) * this.m_mn_percent);
            this.m_mn_percent += 0.1;
            if(this.m_mn_percent >= 1){
                this.meadow_auto_move = false;
                this.feeded();
            }
        }
    },

    feeded:function(){
        if(this.current_prefab == this.before_fed_prefab){

            window.action_active = true;
            let additional_item_index;

            this.item_data_i_need = [];

            for(let i = 0;i < window.stuff_identity[this.stuff_identity_index].the_food.length;i++){
                let x = -this.node.width / 2;
                let y = (this.node.width / 2) - ((i/window.stuff_identity[this.stuff_identity_index].the_food.length) * this.node.width);

                    let our_index = this.spawn_prefab_item(window.stuff_identity[this.stuff_identity_index].the_food[i],x,y,120,50);
                    let different_position = 20;
                    let mouseX;
                    let mouseY;
    
                    this.node.parent.parent.children[our_index].on("touchstart",event=>{
                        this.item_action_mouse_down = true;
                        mouseX = this.node.parent.parent.children[our_index].x;
                        mouseY = this.node.parent.parent.children[our_index].y;
                        additional_item_index = this.spawn_prefab_item(window.stuff_identity[this.stuff_identity_index].the_food[i],x,y,120,50,true);
                    },this)

                    this.node.parent.parent.children[our_index].on("touchmove",event=>{
                        if(this.item_action_mouse_down == false) return;
                        window.MeadowMouseDown = false;

                        mouseX += event.getDelta().x;
                        mouseY += event.getDelta().y;

                        this.node.parent.parent.children[our_index].x = mouseX;
                        this.node.parent.parent.children[our_index].y = mouseY;
                        this.node.parent.parent.children[additional_item_index].x = mouseX;
                        this.node.parent.parent.children[additional_item_index].y = mouseY;

                        for(let j = 0;j < this.item_data_i_need.length;j++){
                            if(this.item_data_i_need[j].index != our_index){
                                let other_item_index = this.item_data_i_need[j].index;
                                this.node.parent.parent.children[other_item_index].x = (this.node.parent.parent.children[our_index].x + ((this.item_data_i_need[j].x - this.node.parent.parent.children[our_index].x) * (different_position/20)));
                                this.node.parent.parent.children[other_item_index].y = (this.node.parent.parent.children[our_index].y + ((this.item_data_i_need[j].y - this.node.parent.parent.children[our_index].y) * (different_position/20)));
                            }
                        }
                        if(different_position > 0)different_position -= 1;
                    },this)

                    this.node.parent.parent.children[our_index].on("touchend",event=>{
                        this.item_action_mouse_down == false;  
                        let feed_animal = true;              
                        for(let o = 0;o < this.item_data_i_need.length;o++)
                        {
                            let index = this.item_data_i_need[o].index
                            if(this.node.parent.parent.children[index]._components[1].insufficient == false){
                                feed_animal = false;
                            }
                        }
                        let dist = this.node.parent.parent.children[our_index].position.sub(cc.v2(
                            this.node.parent.x + (this.node.x * this.node.parent.scaleX),this.node.parent.y + (this.node.y * this.node.parent.scaleY)
                            )).mag();
                        this.node.parent.parent.children[additional_item_index].destroy();

                        for(let j = 0;j < this.item_data_i_need.length;j++){
                            let item_index = this.item_data_i_need[j].index;
                            if(dist < this.node.height * this.node.parent.scaleY && feed_animal != false){
                                let d = new Date();
                                for(let k = 0;k < this.item_data_i_need.length;k++){
                                    this.node.parent.parent._components[2].addItemOnStorage(this.item_data_i_need[k].data.name,-this.item_data_i_need[k].data.count);
                                    this.node.parent.parent.children[this.item_data_i_need[k].index].destroy();
                                }
                                this.item_data_i_need = [];
                                window.default_data.object[this.ownData.ID].already_fed = true;
                                window.default_data.object[this.ownData.ID].time_start = d.getTime();
                                window.action_active = false;
                                return;
                            }
                            this.node.parent.parent.children[item_index].x = this.item_data_i_need[j].x;
                            this.node.parent.parent.children[item_index].y = this.item_data_i_need[j].y;                
                        }

                        different_position = 20;
                    },this)

                    if(this.item_data_i_need.length > 0){
                        this.node.parent.on("touchstart",event => {
                                for(let k = 0;k < this.item_data_i_need.length;k++){
                                    this.node.parent.parent.children[this.item_data_i_need[k].index].destroy();
                                    window.action_active = false;
                                }
                                this.item_data_i_need = [];
                        },this)
                    }
            }
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
            result = this.before_fed_prefab;
        }else if(get_percent < 1 && get_percent >= 0){
            result = this.after_fed_prefab;
        }else if(get_percent >= 1){
            result = this.time_produce_prefab;
        }

        return result;
    },


    spawn_prefab_item:function(a,x,y,w,h,other = false){
        let newObject = cc.instantiate(this.node.parent.parent._components[2].item_fed_box);
        let GameX = this.node.parent.x + ((this.node.x + x) * this.node.parent.scaleX);
        let GameY = this.node.parent.y + ((this.node.y + y) * this.node.parent.scaleY);

        newObject._components[1].our_prefab = {data:a,w:GameX,h:GameY};
        this.node.parent.parent.addChild(newObject);
        this.node.parent.parent.children[this.node.parent.parent.children.length - 1].width = w;
        this.node.parent.parent.children[this.node.parent.parent.children.length - 1].height = h;
        newObject.setPosition(cc.v2(GameX,GameY));
        let result = false;
        if(!other){
            this.item_data_i_need.push({data:a,index:this.node.parent.parent.children.length - 1,x:GameX,y:GameY});
            result =  this.node.parent.parent.children.length - 1;
        }else{
            result =  this.node.parent.parent.children.length - 1;
        }
        return result;
    },


    showTime:function(){
        let d = new Date();
        let getTimeLeft = (this.time_end - this.time_start) - (d.getTime() - this.time_start);
        if(getTimeLeft > 0){
            let timeShowing = cc.instantiate(this.node.parent._components[1].time_showing);
            let timeLabel = cc.instantiate(this.node.parent._components[1].time_label);
            for(let i = 0; i < this.node.children.length;i++){
                if(this.node.children[i]._name == timeShowing._name || this.node.children[i]._name == timeLabel._name){
                    this.node.children[i].destroy();
                }
            }
            this.node.addChild(timeShowing);
            let get_minutes = (getTimeLeft - (getTimeLeft % 60000)) / 60000 ;
            let get_second = Math.floor((getTimeLeft % 60000) / 1000); // 60000 == 60 second;
            timeLabel._components[0].string = "" + get_minutes + ":" + get_second;
            this.node.addChild(timeLabel);
        }
    },
    produce_time:function(){
        for(let i = 0;i < window.default_data.object.length;i++){
            if(window.default_data.object[i].ID == this.ownData.ID){
                let result = this.node.parent.parent._components[2].addItemOnStorage(this.stuff_identity.produce_item,this.stuff_identity.produce_total)
                if(result[1] == true)return;

                let x = this.node.parent.x + (this.node.x * this.node.parent.scaleX);
                let y = this.node.parent.y + (this.node.y * this.node.parent.scaleY);
                this.node.parent.parent._components[2].getItemAction(this.stuff_identity.produce_item,x,y);

                let random_fertilizer = Math.random();
                let from_;
                let to_;
                let times;
                if(random_fertilizer >= 0.8){
                    from_ = window.default_data.fertilizer_data.x8;
                    window.default_data.fertilizer_data.x8 += this.stuff_identity.fertilizer_added;
                    if(window.default_data.fertilizer_data.x8 > 1) window.default_data.fertilizer_data.x8 = 1;
                    to_ = window.default_data.fertilizer_data.x8;
                    times = "x8";
                }else if(random_fertilizer >= 0.5){
                    from_ = window.default_data.fertilizer_data.x4;
                    window.default_data.fertilizer_data.x4 += this.stuff_identity.fertilizer_added;
                    if(window.default_data.fertilizer_data.x4 > 1) window.default_data.fertilizer_data.x4 = 1;
                    to_ = window.default_data.fertilizer_data.x4;
                    times = "x4";
                }else{
                    from_ = window.default_data.fertilizer_data.x2;
                    window.default_data.fertilizer_data.x2 += this.stuff_identity.fertilizer_added;
                    if(window.default_data.fertilizer_data.x2 > 1) window.default_data.fertilizer_data.x2 = 1;
                    to_ = window.default_data.fertilizer_data.x2;
                    times = "x8";
                }

                this.produce_action(times,from_,to_);

                this.node.parent.parent._components[2].addLevelPoint(this.stuff_identity.add_exp);

                window.default_data.object[i].already_fed = false;
                window.default_data.object[i].time_start = 0;
                break;
            }
        }
    },

    produce_action:function(times,from_,to_){
        let prefab = this.node.parent.parent._components[3].get_prefab("fertilizer_"+times);
        let game_width_devided_2 = this.node.parent.parent.width / 2;
        let index_ = this.node.parent.parent._components[2].spawnNewObject("added_fertilizer_box", game_width_devided_2 + this.node.parent.parent._components[2].added_fertilizer_box.data.width/2,0);
        let added_fertilizer_box_uuid = this.node.parent.parent.children[index_].uuid;
        
        let fertilizer_object = cc.instantiate(prefab);
        fertilizer_object.setPosition(cc.v2(0,20));
        this.node.parent.parent.children[index_].addChild(fertilizer_object);
        
        let volume_object = cc.instantiate(this.node.parent.parent._components[2].volume);
        this.node.parent.parent.children[index_].addChild(volume_object);
        volume_object.setPosition(cc.v2(0,-25));
        volume_object.children[0].width = volume_object.width * from_;
        volume_object.children[0].setPosition(cc.v2(-volume_object.width/2 + volume_object.children[0].width/2,0));

        let fertilizer_on_game = cc.instantiate(prefab);
        fertilizer_on_game.scaleX = 0.01;
        fertilizer_on_game.scaleY = 0.01;
        let x = this.node.parent.x + (this.node.x * this.node.parent.scaleX);
        let y = this.node.parent.y + (this.node.y * this.node.parent.scaleY);
        fertilizer_on_game.setPosition(cc.v2(x,y));
        this.node.parent.parent.addChild(fertilizer_on_game);
        let fertilizer_on_game_index = this.node.parent.parent.children.length - 1;
        
        cc.tween(this.node.parent.parent.children[index_])
        .to(0.5,{position:cc.v2(game_width_devided_2 - (this.node.parent.parent._components[2].added_fertilizer_box.data.width/2),0)})
        .start();
        
        let move_to = cc.v2((game_width_devided_2 - (this.node.parent.parent._components[2].added_fertilizer_box.data.width/2)) + (volume_object.x),this.node.parent.parent.children[index_].y + volume_object.y);
        let move_volume = cc.v2(-volume_object.width/2 + ((volume_object.width * to_)/2),0);


        cc.tween(fertilizer_on_game)
        .delay(0.5)
        .to(0.2,{scale:2})
        .to(1.5,{scale:{value:0,easing: t=>t*t*t},position: { value: move_to, easing: t=>t*t*t*t}})
        .start();

        cc.tween(volume_object.children[0])
        .delay(2.2)
        .to(1,{width:volume_object.width * to_,position:move_volume})
        .delay(0.5)
        .call(()=>{
            this.node.parent.parent.children[fertilizer_on_game_index - 1].destroy()
            this.node.parent.parent.children[index_ - 1].destroy()
        })
        .start();
    }
});
