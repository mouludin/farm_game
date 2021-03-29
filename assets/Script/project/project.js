cc.Class({
    extends: cc.Component,

    properties: {
        project_item_prefab:{
            default:null,
            type:cc.Prefab
        },
        check_project:{
            default:null,
            type:cc.Prefab
        },
        finish_check_project:{
            default:null,
            type:cc.Prefab
        },
        mikado_text_label:{
            default:null,
            type:cc.Prefab
        },
        text_label:{
            default:null,
            type:cc.Prefab
        },
        collect_button:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.index_active = 0;
        this.spawn_project_item();
        this.when_destroy_this_node();
    },
    start () {

    },

    when_destroy_this_node:function(){
        this.node.on("touchstart",event=>{return},this);
        this.node.parent.children[window.m_i].on("touchstart",event=>{
            window.action_active = false;
            this.node.destroy();
        },this)
    },

    spawn_project_item:function(){
        for(let i = 0;i < this.node.children.length;i++){
            this.node.children[i].destroy();
        }
        for(let i = 0;i < window.default_data.task_now.length;i++){
            let x = -this.node.width/2 + this.project_item_prefab.data.width/2;
            let y = this.node.height/2 - this.project_item_prefab.data.height/2 - (i * this.project_item_prefab.data.height);
            let newObject = cc.instantiate(this.project_item_prefab);
            if(i != this.index_active){
                newObject.color = new cc.Color(210,105,30);
            }
            this.node.addChild(newObject);
            newObject.setPosition(cc.v2(x,y));
            newObject.on("touchend",event=>{
                this.index_active = i;
                this.spawn_project_item();
            },this)
        }

        let count_of_finish_project = window.default_data.task_now[this.index_active].project.length;

        for(let i = 0;i < window.default_data.task_now[this.index_active].project.length;i++){
            let newObject = cc.instantiate(this.check_project);
            let x = (-this.node.width/2) + (this.project_item_prefab.data.width/2) + (newObject.height * 1.5);
            let y = 34 - (i * newObject.height * 1.5);
            if(window.default_data.task_now[this.index_active].project[i].finish >= window.default_data.task_now[this.index_active].project[i].times){
                let finish_ = cc.instantiate(this.finish_check_project);
                newObject.addChild(finish_);
                finish_.setPosition(cc.v2(0,0));
                count_of_finish_project -= 1;
            }
            this.node.addChild(newObject);
            newObject.setPosition(cc.v2(x,y));

            let activity_text = cc.instantiate(this.mikado_text_label);
            activity_text._components[0].string = window.default_data.task_now[this.index_active].project[i].activity;
            this.node.addChild(activity_text);
            let x_text = -80 + activity_text.width/2;
            let y_text = 34 - (i * newObject.height * 1.5);
            activity_text.setPosition(cc.v2(x_text,y_text));

            let count_finish = cc.instantiate(this.mikado_text_label);
            count_finish._components[0].string = window.default_data.task_now[this.index_active].project[i].finish +"/"+window.default_data.task_now[this.index_active].project[i].times;
            this.node.addChild(count_finish);
            let x_count = 175;
            let y_count = 34 - (i * newObject.height * 1.5);
            count_finish.setPosition(cc.v2(x_count,y_count));
        }

        let description = cc.instantiate(this.text_label);
        description.color = new cc.Color(0,0,0);
        description._components[0].string = window.default_data.task_now[this.index_active].description;
        description._components[0].fontSize = 18;
        this.node.addChild(description);
        description.setPosition(30,135);

        if(count_of_finish_project == 0){
            let collect_button = cc.instantiate(this.collect_button);
            collect_button.color = new cc.Color(50,255,50);
            collect_button.children[0].color = new cc.Color(255,255,255);
            this.node.addChild(collect_button);
            collect_button.setPosition(cc.v2(127,-153));
            collect_button.on("touchend",event=>{
                this.node.parent._components[2].addLevelPoint(window.default_data.task_now[this.index_active].gift.exp);
                this.node.parent._components[2].addMoney(window.default_data.task_now[this.index_active].gift.money);
                for(let i = 0;i < window.all_project.length;i++){
                    if(window.all_project[i].id == window.default_data.task_now[this.index_active].id){
                        window.all_project[i].done = true;
                        break;
                    }
                }
                window.default_data.task_now.splice(this.index_active,1);
                window.action_active = false;

                this.node.parent._components[5].organize_project();
                this.node.destroy();
            },this);
        }
    }

    // update (dt) {},
});
