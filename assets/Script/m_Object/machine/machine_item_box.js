cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.show_item();
        this.onTouch();
    },

    start () {

    },

    show_item:function(){
        let newObject;
        if(this.item_data.available_level <= window.our_level){
            newObject = cc.instantiate(this.node.parent._components[3].get_prefab(this.item_data.name));
        }else{
            newObject = cc.instantiate(this.node.parent._components[2].get_object_by_macros("padlock"));
        }
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(0,0));
    },

    show_info:function(){
        let getPrefab = this.node.parent._components[2].get_object_by_macros("info_item_box");
        let newObject = cc.instantiate(getPrefab);
        newObject._components[1].item_data_info = this.item_data;
        this.node.parent.addChild(newObject);
        let positive_or_negative = 1;
        if(this.first_x < 0)positive_or_negative = -1;
        newObject.setPosition(cc.v2(this.first_x + (this.node.width + (getPrefab.data.width/2)) * positive_or_negative,this.first_y));
    },
    destroy_info:function(){
        for(let i = 0;i < this.node.parent.children.length;i++){
            if(this.node.parent.children[i].name == this.node.parent._components[2].get_object_by_macros("info_item_box").name){
                this.node.parent.children[i].destroy();
            }
        }
    },

    onTouch:function(){
        let machine_pos_x = this.node.parent.children[window.m_i].x + (this.machine_data.coord.x *this.node.parent.children[window.m_i].scaleX );
            let machine_pos_y = this.node.parent.children[window.m_i].y + (this.machine_data.coord.y *this.node.parent.children[window.m_i].scaleY );
        let dist;
        this.node.on("touchstart",event => {
            if(this.item_data.available_level > window.our_level)return;
            let gameWidth = this.node.parent.width;
            let gameHeight = this.node.parent.height;
            dist = cc.v2(this.node.x,this.node.y).sub(cc.v2(machine_pos_x,machine_pos_y)).mag();
            this.node.x = window.myFunc.map(event.touch._point.x,0,gameWidth,-gameWidth/2,gameWidth/2);
            this.node.y = window.myFunc.map(event.touch._point.y,0,gameHeight,-gameHeight/2,gameHeight/2);
            this.mouseDown = true;
            this.show_info();
        },this);

        this.node.on("touchmove",event => {
            this.destroy_info();
            if(!this.mouseDown) return;
            this.node.x += event.getDelta().x;
            this.node.y += event.getDelta().y;
            dist_on_move = cc.v2(this.node.x,this.node.y).sub(cc.v2(machine_pos_x,machine_pos_y)).mag();
            if(dist_on_move > dist){
                dist_on_move = dist;
            }
            let per = dist_on_move/dist;
            this.node.scaleX = window.myFunc.map(per,0,1,0.4,1);
            this.node.scaleY = window.myFunc.map(per,0,1,0.4,1);
        },this);

        this.node.on("touchend",event => {
            this.mouseDown = false
            this.destroy_info();
            let dist = cc.v3(this.node.x,this.node.y).sub(cc.v3(machine_pos_x,machine_pos_y)).mag();
            if(dist < this.node.parent.children[window.m_i].children[this.machine_data.ID].height){
                this.produce();
            }else{
                this.node.scaleX = 1;
                this.node.scaleY = 1;
                this.node.x = this.first_x;
                this.node.y = this.first_y;
            }
        },this);
    },

    produce:function(){
        let sufficient = true;
        for(let i = 0;i < this.item_data.needed.length;i++){
            let have_ = false;
            for(let j = 0;j < window.default_data.storage.length;j++){
                if(this.item_data.needed[i].name == window.default_data.storage[j].name){
                    if(window.default_data.storage[j].total >= this.item_data.needed[i].total){
                        have_ = true;
                    }
                    break;
                }
            }

            if(have_ == false){
                sufficient = false;
                break;
            }
        }

        if(sufficient){
            let empty_slot = false
            for(let i = 0;i < window.default_data.object[this.machine_data.ID].process_data.queue.length;i++){
                if(window.default_data.object[this.machine_data.ID].process_data.queue[i] == null){
                    window.default_data.object[this.machine_data.ID].process_data.queue[i] = this.item_data.name
                    empty_slot = true;
                    break;
                }
            }
            if(empty_slot == true){
                for(let i = 0;i < this.item_data.needed.length;i++){
                    for(let j = 0;j < window.default_data.storage.length;j++){
                        if(this.item_data.needed[i].name == window.default_data.storage[j].name){
                            window.default_data.storage[j].total -= this.item_data.needed[i].total;
                            this.node.parent.children[window.m_i].children[this.machine_data.ID]._components[1].spawn_queue_box();
                            // this.node.parent.children[window.m_i].children[this.machine_data.ID]._components[1].queue_child_added = false;
                            break;
                        }
                    }
                }
            }else{
                this.node.parent._components[2].show_alert("slot penuh",0,0,new cc.Color(200,20,20))
            }
        }else{
            this.node.parent._components[2].show_alert("kebutuhan tidak terpenuhi",0,0,new cc.Color(200,20,20))
        }

        this.node.x = this.first_x;
        this.node.y = this.first_y;
        this.node.scaleX = 1;
        this.node.scaleY = 1;
    },

    destroy_machine_item_box:function(){
        for(let i = this.node.parent.children.length - 1;i >= 0 ;i--){
            if(this.node.parent.children[i]._name == "machine_item_box"){
                this.node.parent.children[i].destroy();
            }
        }
    }
    // update (dt) {},
});
