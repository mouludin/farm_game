cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.our_queue = "none";
        this.our_queue_before = "none";
        this.button_or_time_or_not = "none";
        this.button_or_time_or_not_before = "none";
        this.collect_exp = 0;
        this.start_time = 0;
        this.timeLeftShow = 0;
        this.timeLeft = 0;
        this.onTouch();
    },

    start () {
    },

    onTouch(){
        this.node.on("touchstart",event => {
            this.mouseDown = true;
        },this);

        this.node.on("touchend",event => {
            this.mouseDown = false
        },this);
    },

    update (dt) {
        if(this.our_queue_before != this.our_queue){
            for(let i = 0; i < this.node.children.length;i++){
                this.node.children[i].destroy();
            }
            if(this.our_queue != "none"){
                let newObject = cc.instantiate(this.node.parent._components[3].get_prefab(this.our_queue));
                this.spawnNewObject(
                    this.node.parent._components[3].get_prefab(this.our_queue),0,0,
                )
            }
            this.our_queue_before = this.our_queue;
        }
        if(this.button_or_time_or_not_before != this.button_or_time_or_not){
            if(this.node.children[1]){
                this.node.children[1].destroy();
            }
            if(this.node.children[2]){
                this.node.children[1].destroy();
            }
            if(this.button_or_time_or_not == "button"){
                this.spawnNewObject(this.node.parent._components[2].get_object_by_macros("collect_button"),0,-(this.node.height / 2),
                function(event){
                    let result = this.node.parent._components[2].addItemOnStorage(this.our_queue,1);
                    if(result[1] == true)return;

                    this.node.parent._components[2].getItemAction(this.our_queue,this.node.x,this.node.y);
                    
                    window.default_data.object[this.machine_data.ID].process_data.start_time += this.timeLeft;
                    window.default_data.object[this.machine_data.ID].process_data.queue.splice(this.queue_box_index,1);
                    window.default_data.object[this.machine_data.ID].process_data.queue.push(null);
                    this.node.parent._components[2].addLevelPoint(this.collect_exp);
                    this.node.parent.children[1].children[this.machine_data.ID]._components[1].queue_child_added = false;
                })
                
                this.start_time = 0;
            }else if(this.button_or_time_or_not == "time"){
                this.spawnNewObject(this.node.parent._components[2].get_object_by_macros("time_queue_box"),0,(this.node.height / 2))
                this.spawnNewObject(this.node.parent._components[2].get_object_by_macros("collect_button"),0,-(this.node.height / 2),
                function(event){
                    
                    let d =  new Date();
                    let getTimeLeft = this.start_time - d.getTime();
                    let pay = Math.ceil(getTimeLeft/(1000 * 120));
                    
                    if(window.default_data.identity.gold >= pay){
                        this.node.parent._components[2].addGold(-pay);
                        window.default_data.object[this.machine_index].process_data.start_time -= getTimeLeft;
                        this.node.parent.children[1].children[this.machine_data.ID]._components[1].queue_child_added = false;
                    }else{
                        this.node.parent._components[2].show_alert("emas tidak cukup", this.node.x, this.node.y, new cc.Color(200,20,20));
                    }
                    
                },undefined,object=>{
                    let d =  new Date();
                    let getTimeLeft = this.start_time - d.getTime();
                    let pay = Math.ceil(getTimeLeft/(1000 * 120));
                    
                    object.children[0]._components[0].string = pay;
                    object.children[0].x = -object.width/2 + (object.width/4) * 3;
                    
                    let gold_prefab = this.node.parent._components[2].get_object_by_macros("gold");
                    let goldObject = cc.instantiate(gold_prefab);
                    goldObject.setPosition(cc.v2(-object.width/2 + (object.width/4) * 1));
                    object.addChild(goldObject);
                    object.children[1].width = object.height;
                    object.children[1].height = object.height;
                });
            }else{
                this.spawnNewObject(this.node.parent._components[2].get_object_by_macros("time_queue_box"),0,(this.node.height / 2),
                function(event){},{color:new cc.Color(0,0,0),opacity:255})
                this.start_time = 0;
            }
            this.button_or_time_or_not_before = this.button_or_time_or_not;
        }

        if(this.node.children[1]){
            if(this.node.children[1].name == "time_queue_box"){
                if(this.button_or_time_or_not_before != "none"){
                    let d =  new Date();
                    let getTimeLeft = this.start_time - d.getTime();
                    let get_minutes = (getTimeLeft - (getTimeLeft % 60000)) / 60000 ;
                    let get_second = Math.floor((getTimeLeft % 60000) / 1000);

                    if(getTimeLeft > this.timeLeftShow){
                        this.node.children[1].opacity = 0;
                        this.node.children[2].opacity = 0;
                        this.node.children[2].active = false;
                    }else{
                        this.node.children[1].opacity = 255;
                        this.node.children[2].opacity = 255;
                        this.node.children[2].active = true;
                    }

                    this.node.children[1].children[0]._components[0].string = `${get_minutes}:${get_second}`;
                }
            }
        }
    },

    spawnNewObject:function(our_object,x,y,onTouch = undefined,data = undefined,func = undefined){
        let newObject = cc.instantiate(our_object);
        if(data != undefined){
            if(data.opacity){
                newObject.opacity = data.opacity
            }
            if(data.color){
                newObject.color = data.color
            }
        }

        if(func != undefined){
            func(newObject);
        }

        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(x,y));
        if(onTouch){
            newObject.on("touchstart",onTouch,this);
        }
    }
});
