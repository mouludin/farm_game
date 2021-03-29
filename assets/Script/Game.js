cc.Class({
    extends: cc.Component,
    
    properties: {
        meadow_background_node:{
            default:null,
            type:cc.Node
        },

        /// icon ///
        Money_label:{
            default:null,
            type:cc.Node
        },
        Gold_label:{
            default:null,
            type:cc.Node
        },
        farm_shop_icon:{
            default:null,
            type:cc.Node
        },
        zoom_in:{
            default:null,
            type:cc.Node
        },
        zoom_out:{
            default:null,
            type:cc.Node
        },
        level:{
            default:null,
            type:cc.Node
        },
        friends:{
            default:null,
            type:cc.Node
        },
        project_icon:{
            default:null,
            type:cc.Node
        },
        text_global:{
            default:null,
            type:cc.Prefab
        },
        padlock_prefab:{
            default:null,
            type:cc.Prefab
        },
        text_global_mikado:{
            default:null,
            type:cc.Prefab
        },
        circle_seeds_choice:{
            default:null,
            type:cc.Prefab
        },
        alert_prefab:{
            default:null,
            type:cc.Prefab
        },
        item_fed_box:{
            default:null,
            type:cc.Prefab
        },
        project_box:{
            default:null,
            type:cc.Prefab
        },
        storage_box:{
            default:null,
            type:cc.Prefab
        },
        friends_box:{
            default:null,
            type:cc.Prefab
        },
        project_box:{
            default:null,
            type:cc.Prefab
        },
        achievement_box:{
            default:null,
            type:cc.Prefab
        },
        fertilizer_box:{
            default:null,
            type:cc.Prefab
        },
        added_fertilizer_box:{
            default:null,
            type:cc.Prefab
        },
        land_identity_box:{
            default:null,
            type:cc.Prefab
        },
        volume:{
            default:null,
            type:cc.Prefab
        },
        order_board:{
            default:null,
            type:cc.Prefab
        },
        farm_shop_items:{
            default:null,
            type:cc.Prefab
        },
        gold:{
            default:null,
            type:cc.Prefab
        },
        money:{
            default:null,
            type:cc.Prefab
        },

        // machine prefab
        machine_item_box:{
            default:null,
            type:cc.Prefab
        },
        info_item_box:{
            default:null,
            type:cc.Prefab
        },
        queue_box:{
            default:null,
            type:cc.Prefab
        },
        time_queue_box:{
            default:null,
            type:cc.Prefab
        },
        collect_button:{
            default:null,
            type:cc.Prefab
        },



        // shop
        ground_tree:{
            default:null,
            type:cc.Prefab
        },
        ground_building:{
            default:null,
            type:cc.Prefab
        },
        ground_machine:{
            default:null,
            type:cc.Prefab
        },
        ground_animal:{
            default:null,
            type:cc.Prefab
        },
        ground_decoration:{
            default:null,
            type:cc.Prefab
        },


    },

    // use this for initialization
    onLoad: function () {
        this.set_all_global_data();
        this.getMeadowIndex();
        this.mousePosition = {x:0,y:0};
        this.organize_data();
        this.setCapaciy();
        this.onDrag();
        this.farm_shop_icon_onClick();
        this.friend_icon_onClick();
        this.project_icon_onClick();
        this.zoomOnTouch();
        this.setLevel();
        this.setStorageCapacity();
        this.organize_friend();
        this.node._components[5].organize_project();
        this.on_alert = false;
        this.data_alert = null;
    },

    set_all_global_data:function(){
        window.action_active = false;
        window.barn_capacity = [0,40,70,100,120];
        window.level_weight = [0,20,50,100,180,300,480,700,1000];
        window.default_data = this.node._components[6].default_data.json;
        window.all_project = this.node._components[6].all_project.json;
        window.all_machine_data = this.node._components[6].all_machine_data.json;
        window.item_selling_price = this.node._components[6].item_selling_price.json;
        window.object_identity = this.node._components[6].object_identity.json;
        window.planting_data = this.node._components[6].planting_data.json;
        window.stuff_identity = this.node._components[6].stuff_identity.json;
        window.default_data.achievement = this.node._components[6].achievement_data.json;
    },

    organize_data(){
        this.Money_label.setPosition(cc.v2(-(this.node.width / 2) + (this.Money_label.width / 1.5), (this.node.height / 2) - (this.Money_label.height) ))
        this.Money_label.children[1]._components[0].string = window.default_data.identity.money;
        this.Money_label.children[1].setPosition(cc.v2((this.Money_label.width/2) - (this.Money_label.children[1].width/2) - (this.Money_label.width/10),0));
        this.Gold_label.setPosition(cc.v2(-(this.node.width / 2) + (this.Gold_label.width / 1.5), (this.node.height / 2) - (this.Gold_label.height * 2.5) ))
        this.Gold_label.children[1]._components[0].string = window.default_data.identity.gold;
        this.Gold_label.children[1].setPosition(cc.v2((this.Gold_label.width/2) - (this.Gold_label.children[1].width/2) - (this.Gold_label.width/10),0));
        this.farm_shop_icon.setPosition(cc.v2((this.node.width / 2) - (this.farm_shop_icon.width),-(this.node.height / 2) + (this.farm_shop_icon.height)))
        this.friends.setPosition(cc.v2(this.farm_shop_icon.x,this.farm_shop_icon.y + (2 * this.friends.height)))
        this.zoom_out.setPosition(cc.v2((this.node.width / 2) - (this.zoom_out.width),(this.node.height / 2) - (this.Money_label.height)));
        this.zoom_in.setPosition(cc.v2((this.node.width / 2) - (this.zoom_in.width),(this.node.height / 2) - (this.Money_label.height) - (this.zoom_out.height * 2)));
        this.project_icon.setPosition(cc.v2(-(this.node.width / 2) + (this.farm_shop_icon.width),-(this.node.height / 2) + (this.farm_shop_icon.height) ))
    }, 

    // called every frame
    update: function (dt) {
        this.organize_fertilizer();
        if(this.on_alert == true){
            let get_alert_index;
            for(let i = 0; i < this.node.children.length;i++){
                if(this.node.children[i].name == this.alert_prefab.data.name){
                    get_alert_index = i;
                    break;
                }
            }
            if(this.node.children[get_alert_index].opacity > 0){
                this.node.children[get_alert_index].opacity -= 2;
                this.node.children[get_alert_index].y += 0.5;
            }else if(this.node.children[get_alert_index].opacity <= 0){
                this.on_alert = false;
                this.data_alert = null;
                for(let i = 0;i < this.node.children.length;i++){
                    if(this.node.children[i].name == "alert"){
                        this.node.children[i].destroy();
                    }
                }
            }
        }
        if(this.on_zoom_out){
            this.node.children[window.m_i].scaleX += dt;
            this.node.children[window.m_i].scaleY += dt;
            if(this.node.children[window.m_i].scaleX > 2){
                this.node.children[window.m_i].scaleX = 2;
                this.node.children[window.m_i].scaleY = 2;
            }
        }
        if(this.on_zoom_in){
            this.node.children[window.m_i].scaleX -= dt;
            this.node.children[window.m_i].scaleY -= dt;
            if(this.node.children[window.m_i].x > (this.node.children[window.m_i].width / 2) - ((this.node.width / 2) / this.node.children[window.m_i].scaleX)){
                this.node.children[window.m_i].x = (this.node.children[window.m_i].width / 2) - ((this.node.width / 2) / this.node.children[window.m_i].scaleX)
            }
            if(this.node.children[window.m_i].x < -1*((this.node.children[window.m_i].width / 2) - ((this.node.width / 2) / this.node.children[window.m_i].scaleX))){
                this.node.children[window.m_i].x = -1*((this.node.children[window.m_i].width / 2) - ((this.node.width / 2) / this.node.children[window.m_i].scaleX))
            }
            if(this.node.children[window.m_i].y > (this.node.children[window.m_i].height / 2) - ((this.node.height / 2) / this.node.children[window.m_i].scaleY)){
                this.node.children[window.m_i].y = (this.node.children[window.m_i].height / 2) - ((this.node.height / 2) / this.node.children[window.m_i].scaleY)
            }
            if(this.node.children[window.m_i].y < -1*((this.node.children[window.m_i].height / 2) - ((this.node.height / 2) / this.node.children[window.m_i].scaleY))){
                this.node.children[window.m_i].y = -1*((this.node.children[window.m_i].height / 2) - ((this.node.height / 2) / this.node.children[window.m_i].scaleY))
            }
            if(this.node.children[window.m_i].scaleX < 1){
                this.node.children[window.m_i].scaleX = 1;
                this.node.children[window.m_i].scaleY = 1;
            }
        }
    },

    onDrag(){
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            window.MeadowMouseDown = true;
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            this.mousePosition.x = event.getLocation().x;
            this.mousePosition.y = event.getLocation().y;
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            window.MeadowMouseDown = false;
        })
    },
    spawnNewObject(name,x = undefined,y = undefined,funcAfter = undefined,funcBefore = undefined){
        let storage = false;
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i]._name == name) storage = true;
        }
        if(storage) return;
        let newObject = cc.instantiate(this.get_object_by_macros(name));

        
        if(x != undefined && y != undefined) newObject.setPosition(cc.v2(x,y));

        if(funcBefore != undefined) funcBefore(newObject);
        
        this.node.addChild(newObject);
        
        if(funcAfter != undefined) funcAfter(newObject);
        
        let index_;
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i].uuid == newObject.uuid){
                index_ = i;
                break;
            }
        }

        return index_;
    },

    
    get_object_by_macros:function(name){
        switch (name){
            case "circle_seeds_choice":
                return this.circle_seeds_choice;
            case "storage_box":
                return this.storage_box;
            case "farm_shop_items":
                return this.farm_shop_items;
            case "ground_tree":
                return this.ground_tree;
            case "ground_building":
                return this.ground_building;
            case "ground_machine":
                return this.ground_machine;
            case "ground_animal":
                return this.ground_animal;
            case "ground_decoration":
                return this.ground_decoration;
            case "order_board":
                return this.order_board;
            case "queue_box":
                return this.queue_box;
            case "friends_box":
                return this.friends_box;
            case "machine_item_box":
                return this.machine_item_box;
            case "time_queue_box":
                return this.time_queue_box;
            case "info_item_box":
                return this.info_item_box;
            case "achievement_box":
                return this.achievement_box;
            case "collect_button":
                return this.collect_button;
            case "text_global":
                return this.text_global;
            case "text_global_mikado":
                return this.text_global_mikado;
            case "padlock":
                return this.padlock_prefab;
            case "project_box":
                return this.project_box;
            case "fertilizer_box":
                return this.fertilizer_box;
            case "added_fertilizer_box":
                return this.added_fertilizer_box;
            case "land_identity_box":
                return this.land_identity_box;
            case "gold":
                return this.gold;
            case "money":
                return this.money;
            default:
                console.error("unknown object : "+name);
        }
    },

    farm_shop_icon_onClick:function(){
        this.farm_shop_icon.on("touchend",(event)=>{
            if(this.shop_open){
                for(let i = 0;i < this.node.children.length;i++){
                    if(this.node.children[i]._name == "type_shop"){
                        this.node.children[i].destroy();
                        this.shop_open = false;
                        break;
                    }
                }
            }else{
                this.spawnNewObject("farm_shop_items",this.farm_shop_icon.x - (120 + this.farm_shop_icon.width),this.farm_shop_icon.y);
                this.shop_open = true;
            }
        },this)
    },
    friend_icon_onClick:function(){
        this.friends.on("touchend",(event)=>{
            if(!window.action_active){
                this.spawnNewObject("friends_box",0,0);
                window.action_active= true;
            }
        },this)
    },
    project_icon_onClick:function(){
        this.project_icon.on("touchend",(event)=>{
            if(!window.action_active){
                this.spawnNewObject("project_box",-this.node.width/2 + this.project_box.data.width/2,-this.node.height/2 + this.project_box.data.height/2);
                window.action_active = true;
            }
        },this)
    },

    zoomOnTouch:function(){
        this.zoom_out.on("touchstart",event=>{
            if(window.action_active == true)return;
            this.on_zoom_in = false;
            this.on_zoom_out = true;
            this.zoom_in.scaleX = 1;
            this.zoom_in.scaleY = 1;
            this.zoom_out.scaleX = 1.5;
            this.zoom_out.scaleY = 1.5;
        },this);
        this.zoom_in.on("touchstart",event=>{
            if(window.action_active == true)return;
            this.on_zoom_out = false;
            this.on_zoom_in = true;
            this.zoom_out.scaleX = 1;
            this.zoom_out.scaleY = 1;
            this.zoom_in.scaleX = 1.5;
            this.zoom_in.scaleY = 1.5;
        },this);
        this.zoom_out.on("touchend",event=>{
            this.on_zoom_out = false;
            this.zoom_out.scaleX = 1;
            this.zoom_out.scaleY = 1;
        },this);
        this.zoom_in.on("touchend",event=>{
            this.on_zoom_in = false;
            this.zoom_in.scaleX = 1;
            this.zoom_in.scaleY = 1;
        },this);
    },

    show_alert:function(text,x,y,color){
        let have_ = false;
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i].name == this.alert_prefab.data.name){
                have_ = true;
            }
        }
        if(have_)return;
        let newObject = cc.instantiate(this.alert_prefab);
        this.node.addChild(newObject);
        newObject.color = color;
        newObject._components[0].string = text;
        newObject.setPosition(cc.v2(x,y));
        this.on_alert = true;
        this.data_alert = {index:this.node.children.length - 1,x,y};
    },
    getMeadowIndex:function(){
        for(let i = 0; i < this.node.children.length;i++){
            if(this.node.children[i].name == "game_background_meadow"){
                window.m_i = i;
                break;
            }
        }
    },
    setLevel:function(){
        window.our_level
        for(let i = 1;i <= window.level_weight.length;i++){
            if(window.default_data.point_level >= window.level_weight[i - 1]){
                window.our_level = i;
            }else if(window.default_data.point_level < window.level_weight[i - 1]){
                break;
            }
        }
        this.level.children[0].width = this.level.width * ((window.default_data.point_level - window.level_weight[window.our_level - 1]) / (window.level_weight[window.our_level] - window.level_weight[window.our_level - 1]));
        this.level.children[0].x = -(this.level.width / 2) + (this.level.children[0].width/2);
        this.level.children[1].children[0]._components[0].string = window.our_level;
    },
    addLevelPoint:function(a){
        let level_before = window.our_level;
        window.default_data.point_level += a;
        this.setLevel();
        if(window.our_level > level_before){
            this.node._components[5].organize_project();
        }
    },

    addMoney:function(a){
        window.default_data.identity.money += a;
        this.organize_data();
    },
    addGold:function(a){
        window.default_data.identity.gold += a;
        this.organize_data();
    },

    getActivity(a,total = undefined){
        a = a.replace("_"," ");
        for(let i = 0;i < window.default_data.task_now.length;i++){
            for(let j = 0;j < window.default_data.task_now[i].project.length;j++){
                if(window.default_data.task_now[i].project[j].activity == a && window.default_data.task_now[i].project[j].finish < window.default_data.task_now[i].project[j].times){
                    if(total != undefined){
                        window.default_data.task_now[i].project[j].finish += total;
                        if(window.default_data.task_now[i].project[j].finish >= window.default_data.task_now[i].project[j].times){
                            window.default_data.task_now[i].project[j].finish = window.default_data.task_now[i].project[j].times;
                        }
                    }else{
                        window.default_data.task_now[i].project[j].finish += 1;
                    }
                }
            }
        }
    },

    achievement_request:function(achievement_name,total = undefined){
        for(let i = 0; i < window.default_data.achievement.length;i++){
            if(window.default_data.achievement[i].name == achievement_name){
                if(total != undefined){
                    window.default_data.achievement[i].done += total;
                }else{
                    window.default_data.achievement[i].done += 1;
                }

                let count_length = window.default_data.achievement[i].count.length;
                if(window.default_data.achievement[i].done > window.default_data.achievement[i].count[count_length - 1].amount){
                    window.default_data.achievement[i].done = window.default_data.achievement[i].count[count_length - 1].amount;
                }
                break;
            }
        }
    },

    setCapaciy:function(){
        let our_storage = [];

        for(let i = 0;i < window.item_selling_price.length;i++)
        {
            let name = window.item_selling_price[i].name;
            let total = 0;
            for(let j = 0;j < window.default_data.storage.length;j++){
                if( window.default_data.storage[j].name == name){
                    total = window.default_data.storage[j].total;
                    break;
                }
            }
            our_storage.push({name,total});
        }

        window.default_data.storage = our_storage;
    },

    addItemOnStorage:function(name,count = 1){
        let insufficient = true;
        let capacity = 0;
        let full = true;
        for(let i = 0;i < window.default_data.storage.length;i++){
            capacity += window.default_data.storage[i].total;
        }
        if((capacity + count) <= window.our_capacity){
            full = false;
            for(let j = 0;j < window.default_data.storage.length;j++){
                if(window.default_data.storage[j].name == name){
                    if(window.default_data.storage[j].total + count < 0){
                        insufficient = false;
                        return;
                    }
                    window.default_data.storage[j].total += count;
                    break;
                }
            }
        }else{
            this.show_alert("kapasitas terbatas",0,0,new cc.Color(200,0,0));
        }
        return [insufficient,full,capacity,count];
    },

    organize_friend:function(){
        for(let i = 0;i < window.default_data.friend_data.length;i++){
            let d = new Date();
            let different_time = window.default_data.friend_data[i].last_helping_time - d.getTime();
            let one_day = 1000 * 60 * 60 * 24;
            if(different_time <= 0){
                window.default_data.friend_data[i].rest_of_helping = 5;
                window.default_data.friend_data[i].history = [];
                window.default_data.friend_data[i].friendship_level += 0.1 * Math.ceil(different_time / (one_day * 1.5));
                window.default_data.friend_data[i].last_helping_time = d.getTime() - one_day + (one_day + different_time%(one_day*1.5));
            }
            if(window.default_data.friend_data[i].friendship_level < 0){
                window.default_data.friend_data[i].friendship_level = 0;
            }
        }
    },

    setStorageCapacity:function(){
        window.our_capacity = 0;
        for(let i = 0;i < window.default_data.object.length;i++){
            if(window.default_data.object[i].name == "barn"){
                window.our_capacity += 40 + (window.default_data.object[i].level - 1) * 5;
            }
        }
    },

    getItemAction:function(item,x,y){
        let our_prefab = this.node._components[3].get_prefab(item);
        let newObject = cc.instantiate(our_prefab);
        newObject.scaleX = 0.01;
        newObject.scaleY = 0.01;
        newObject.setPosition(cc.v2(x,y));
        this.node.addChild(newObject);
        let nearest_barn;
        let barn_data = {index:0,x:0,y:0};

        for(let i = 0;i < window.default_data.object.length;i++){
            if(window.default_data.object[i].name == "barn"){
                let dist = cc.v2(
                    (x - this.node.children[window.m_i].x) / this.node.children[window.m_i].scaleX,
                    (y - this.node.children[window.m_i].y) / this.node.children[window.m_i].scaleY)
                    .sub(cc.v2(window.default_data.object[i].coord.x,window.default_data.object[i].coord.y)).mag();
                if(!nearest_barn){
                    nearest_barn = dist;
                    barn_data.index = i
                    barn_data.x = this.node.children[window.m_i].x + (window.default_data.object[i].coord.x * this.node.children[window.m_i].scaleX);
                    barn_data.y = this.node.children[window.m_i].y + (window.default_data.object[i].coord.y * this.node.children[window.m_i].scaleY);
                }else{
                    if(dist < nearest_barn ){
                        nearest_barn = dist;
                        barn_data.index = i
                        barn_data.x = this.node.children[window.m_i].x + (window.default_data.object[i].coord.x * this.node.children[window.m_i].scaleX);
                        barn_data.y = this.node.children[window.m_i].y + (window.default_data.object[i].coord.y * this.node.children[window.m_i].scaleY);
                    }
                }
            }
        }

        cc.tween(newObject)
        .to(0.2,{scale:1})
        .to(1.5,{scale:{value:0.2,easing: t=>t*t*t},position: { value: cc.v2(barn_data.x, barn_data.y), easing: t=>t*t*t*t}})
        .call(() => { 
            cc.tween(this.node.children[window.m_i].children[barn_data.index]).to(0.2,{scale:1.1}).to(0.2,{scale:1}).start();
            newObject.destroy();
        })
        .start();
    },

    addGoldWithAction:function(num_of_gold,x,y){
        let newObject = cc.instantiate(this.gold);
        newObject.width = 50;
        newObject.height = 50;
        newObject.scaleX = 0.01;
        newObject.scaleY = 0.01;
        newObject.setPosition(cc.v2(x,y));
        this.node.addChild(newObject);
        let textObject = cc.instantiate(this.text_global);
        textObject.setPosition(cc.v2(20,-10));
        textObject._components[0].string = `+${num_of_gold}`;
        textObject._components[0].fontSize = 18;
        textObject._components[0].enabledBold = true;
        newObject.addChild(textObject);
        console.log(textObject);

        
        cc.tween(newObject)
        .to(0.5,{scale:1})
        .to(1.5,{scale:{value:0.2,easing: t=>t*t*t},position: { value: cc.v2(this.Gold_label.x,this.Gold_label.y), easing: t=>t*t*t*t}})
        .call(() => {
            window.default_data.identity.gold += num_of_gold;
            this.organize_data();
            newObject.destroy();
        })
        .start();

    },

    addMoneyWithAction:function(num_of_money,x,y){
        let newObject = cc.instantiate(this.money);
        newObject.width = 50;
        newObject.height = 50;
        newObject.scaleX = 0.01;
        newObject.scaleY = 0.01;
        newObject.setPosition(cc.v2(x,y));
        this.node.addChild(newObject);
        let textObject = cc.instantiate(this.text_global);
        textObject.setPosition(cc.v2(20,-10));
        textObject._components[0].string = `+${num_of_money}`;
        textObject._components[0].fontSize = 18;
        textObject._components[0].enabledBold = true;
        newObject.addChild(textObject);

        
        cc.tween(newObject)
        .to(0.5,{scale:1})
        .to(1.5,{scale:{value:0.2,easing: t=>t*t*t},position: { value: cc.v2(this.Money_label.x,this.Money_label.y), easing: t=>t*t*t*t}})
        .call(() => {
            window.default_data.identity.money += num_of_money;
            this.organize_data();
            newObject.destroy();
        })
        .start();

    },



    organize_fertilizer:function(){
        if(window.default_data.fertilizer_data.now.type != "none"){
            let d = new Date()
            if(window.default_data.fertilizer_data.now.times_end < d.getTime()){
                window.default_data.fertilizer_data.now.type = "none"
                window.default_data.fertilizer_data.now.times_start = 0
                window.default_data.fertilizer_data.now.times_end = 0
            }
        }
    },
});