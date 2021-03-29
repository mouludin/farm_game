cc.Class({
    extends: cc.Component,

    properties: {
        type:cc.String,
        close:{
            default:null,
            type:cc.Node
        },
        yes_move:{
            default:null,
            type:cc.Prefab
        },
        no_move:{
            default:null,
            type:cc.Prefab
        },
        barn:{
            default:null,
            type:cc.Prefab
        },
        fertilizer_spreader:{
            default:null,
            type:cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.type_of_item;

        this.node.width = this.node.parent.width;
        
        this.mouseDownItemLocation = {x:0,y:0};

        this.node_delta_scroll_x = 0;

        this.all_item_identity = [];

        this.first_item_coord_x;

        window.action_active = true;

        this.close.setPosition(cc.v2(this.node.width/2 - this.close.width ,this.node.height/2))

        for(let i = 0;i < window.stuff_identity.length;i++){
            if(window.stuff_identity[i].type == this.type){
                this.all_item_identity.push(window.stuff_identity[i]);
            }
        }
        this.show_all_items();
        this.on_scroll_horizontal();
        this.itemOnDrag();
        this.onClose();
    },
    
    start () {
    },

    update (dt) {
        this.meadowOnDrag();
        if(this.mouseDownItem && this.addItemOnMeadow){
            this.autoMove();
        }
    },

    on_scroll_horizontal:function(){
        this.node.on("touchstart",(event)=>{
            this.mouseDown = true;
        },this)

        this.node.on("touchmove",(event)=>{
            if(!this.mouseDown || this.mouseDownItem)return;
            let delta_x = event.getDelta().x;
            if(this.node.children[1].x + delta_x > this.first_item_coord_x || this.node.children[this.node.children.length - 1].x + delta_x < this.first_item_coord_x){
                return;
            };
            this.node_delta_scroll_x += delta_x;
            for(let i = 1;i < this.node.children.length;i++)
            {
                if(this.item_selected_index){
                    if(i == this.item_selected_index ||i == this.node.children.length - 1 || i == this.node.children.length - 2){
                        continue;
                    }
                }
                this.node.children[i].x += delta_x;
            }
        },this)

        this.node.on("touchend",(event)=>{
            this.mouseDown = false;
        },this)
    },

    show_all_items:function(){
        for(let i = 0;i < this.all_item_identity.length;i++){
            let newObject = cc.instantiate(this.get_prefab_by_name(this.all_item_identity[i].name));

            newObject._components[1].import_data = this.all_item_identity[i];
            if(this.all_item_identity[i].available_level <= window.our_level){
                let price = cc.instantiate(this.node.parent._components[2].get_object_by_macros("text_global_mikado"));
                price._components[0].string = "$" + this.all_item_identity[i].price;
                price.setPosition(cc.v2(0,-price.height / 3));
                newObject.addChild(price);
                if(this.all_item_identity[i].max){
                    let max_item = cc.instantiate(this.node.parent._components[2].get_object_by_macros("text_global_mikado"));
                    let num_of_available = 0;
                    let num_of_have_on_meadow = 0;
                    for(let j = 0;j < window.default_data.object.length;j++){
                        if(window.default_data.object[j].name == this.all_item_identity[i].object_name){
                            num_of_have_on_meadow++;
                        }
                    }
                    for(let j = 0;j < this.all_item_identity[i].max.length;j++){
                        if(window.our_level >= this.all_item_identity[i].max[j][0]){
                            num_of_available = this.all_item_identity[i].max[j][1];
                        }else{
                            break;
                        }
                    }
                    if(num_of_have_on_meadow + 1 > num_of_available){
                        newObject._components[1].import_data.max_label = true;
                    }
                    max_item._components[0].string = num_of_have_on_meadow+"/"+num_of_available;
                    max_item.setPosition(cc.v2(newObject.width/2,newObject.height/2));
                    newObject.addChild(max_item);
                }
            }else{
                newObject.color = new cc.Color(100,100,100);
                let padlock = cc.instantiate(this.node.parent._components[2].get_object_by_macros("padlock"));
                padlock.setPosition(cc.v2(0, padlock.height / 3));
                newObject.addChild(padlock);
                let level_available = cc.instantiate(this.node.parent._components[2].get_object_by_macros("text_global_mikado"));
                level_available._components[0].string = "Lv." + this.all_item_identity[i].available_level;
                level_available.setPosition(cc.v2(0,(padlock.height / 3) - (padlock.height / 2 ) ));
                newObject.addChild(level_available);
            }
            this.node.addChild(newObject);
            newObject.setPosition(cc.v2(((this.node.width * (7/8)) * 0.5 * -1) + ((i+1)*((this.node.width * (2/8)) * 0.5)),0));
        }
        this.first_item_coord_x = this.node.children[1].x;
    },


    get_prefab_by_name:function(name){  
        switch (name) {
            case "barn":
                    return this.barn;
            case "fertilizer_spreader":
                    return this.fertilizer_spreader;
            default:
                console.error("unknown object: " + name);
                return 0;
        }
    },

    meadowOnDrag(){
        if(window.MeadowOnDrag && this.item_selected_index){
                this.node.children[this.item_selected_index].setPosition(cc.v2(
                    this.node.parent.children[window.m_i].children[this.index_object_selected].x * this.node.parent.children[window.m_i].scaleX + this.node.parent.children[window.m_i].x - this.node.x,
                    this.node.parent.children[window.m_i].children[this.index_object_selected].y * this.node.parent.children[window.m_i].scaleY + this.node.parent.children[window.m_i].y - this.node.y
                ))

                // No Button
                this.node.children[this.node.children.length - 1].setPosition(cc.v2(this.node.children[this.item_selected_index].x - 30,this.node.children[this.item_selected_index].y - 30));
                // Yes Button
                this.node.children[this.node.children.length - 2].setPosition(cc.v2(this.node.children[this.item_selected_index].x + 30,this.node.children[this.item_selected_index].y - 30));
        }
    },   

    itemOnDrag(){
        this.mouseDownItem = false;
        this.addItemOnMeadow = false;
        for(let i = 1; i < this.node.children.length;i++){
            this.node.children[i].on("touchstart",(event) => {
                this.mouseDownItem = true;
                this.mouseDownItemLocation.x = event.getLocation().x;
                this.mouseDownItemLocation.y = event.getLocation().y;
            },this)

            this.node.children[i].on("touchmove",(event)=>{
                if(!this.mouseDownItem) return;
                if(this.node.children[i].children[0].name == "padlock"){
                    this.node.parent._components[2].show_alert("terkunci",(this.node.x + this.node.children[i].x),(this.node.y + this.node.children[i].y),new cc.Color(200,0,0));
                    this.mouseDownItem = false;
                    this.mouseDownItemLocation.x = 0;
                    this.mouseDownItemLocation.y = 0;
                    return;
                };
                if(this.node.children[i]._components[1].import_data.max_label == true){
                    this.node.parent._components[2].show_alert("jumlah sudah maksimal",(this.node.x + this.node.children[i].x),(this.node.y + this.node.children[i].y),new cc.Color(200,0,0));
                    this.mouseDownItem = false;
                    this.mouseDownItemLocation.x = 0;
                    this.mouseDownItemLocation.y = 0;
                    return;
                }
                if(!this.addItemOnMeadow){
                    this.node.parent.children[window.m_i]._components[1].spawnNewObject_with_macros_and_pos(
                        this.node.children[i]._components[1].import_data.object_name,
                        ((this.node.x + this.node.children[i].x) - (this.node.parent.children[window.m_i].x)) / this.node.parent.children[window.m_i].scaleX,
                        ((this.node.y + this.node.children[i].y) - (this.node.parent.children[window.m_i].y)) / this.node.parent.children[window.m_i].scaleY
                        )

                    this.index_object_selected = this.node.parent.children[window.m_i].children.length - 1
                    
                    // index of selected Item
                    this.item_selected_index = i;

                    this.spawn_yes_and_no(i,this.node.children[i].x,this.node.children[i].y);
                    
                    
                    this.last_index_of_meadow = this.node.parent.children[window.m_i].children.length - 1;

                    this.mouseX = ((this.node.x + this.node.children[i].x) - (this.node.parent.children[window.m_i].x)) / this.node.parent.children[window.m_i].scaleX;
                    this.mouseY = ((this.node.y + this.node.children[i].y) - (this.node.parent.children[window.m_i].y)) / this.node.parent.children[window.m_i].scaleY;

                    for(let j = 0; j < window.object_identity.length;j++){
                        if(window.object_identity[j].name == this.node.children[i]._components[1].import_data.object_name){
                            this.node.parent.children[window.m_i]._components[1].spawn_many_square(
                                ((this.node.x + this.node.children[i].x) - (this.node.parent.children[window.m_i].x)) / this.node.parent.children[window.m_i].scaleX,
                                ((this.node.y + this.node.children[i].y) - (this.node.parent.children[window.m_i].y)) / this.node.parent.children[window.m_i].scaleY,
                                window.object_identity[j].plot_of_move_system.start_x,
                                window.object_identity[j].plot_of_move_system.start_y,
                                window.object_identity[j].plot_of_move_system.cols,
                                window.object_identity[j].plot_of_move_system.rows,
                                false);

                            this.num_of_move_plot = window.object_identity[j].plot_of_move_system.cols * window.object_identity[j].plot_of_move_system.rows;
                            this.index_object_identity = j;
                            break;
                        }
                    }
                    this.addItemOnMeadow = true;
                }

                this.mouseDownItemLocation.x = event.getLocation().x;
                this.mouseDownItemLocation.y = event.getLocation().y;

                this.mouseX += event.getDelta().x / this.node.parent.children[window.m_i].scaleX;
                this.mouseY += event.getDelta().y / this.node.parent.children[window.m_i].scaleY;

                let new_coord = this.node.parent.children[window.m_i]._components[1].ObjectOnMove(this.mouseX,this.mouseY);
                this.node.parent.children[window.m_i].children[this.index_object_selected].x = new_coord.x;
                this.node.parent.children[window.m_i].children[this.index_object_selected].y = new_coord.y;

                // Item selected position
                this.node.children[i].x = this.node.parent.children[window.m_i].children[this.index_object_selected].x * this.node.parent.children[window.m_i].scaleX + this.node.parent.children[window.m_i].x - this.node.x;
                this.node.children[i].y = this.node.parent.children[window.m_i].children[this.index_object_selected].y * this.node.parent.children[window.m_i].scaleY + this.node.parent.children[window.m_i].y - this.node.y;

                // No Button
                this.node.children[this.node.children.length - 1].setPosition(cc.v2(this.node.children[i].x - 30,this.node.children[i].y - 30));
                // Yes Button
                this.node.children[this.node.children.length - 2].setPosition(cc.v2(this.node.children[i].x + 30,this.node.children[i].y - 30));

                this.node.parent.children[window.m_i]._components[1].destroy_many_square();
                this.node.parent.children[window.m_i]._components[1].spawn_many_square(
                    this.node.parent.children[window.m_i].children[this.last_index_of_meadow].x,
                    this.node.parent.children[window.m_i].children[this.last_index_of_meadow].y,
                    window.object_identity[this.index_object_identity].plot_of_move_system.start_x,
                    window.object_identity[this.index_object_identity].plot_of_move_system.start_y,
                    window.object_identity[this.index_object_identity].plot_of_move_system.cols,
                    window.object_identity[this.index_object_identity].plot_of_move_system.rows,
                    false
                    );
                if(this.addItemOnMeadow){
                    this.node.children[i].opacity = 1;
                }else{
                    this.node.children[i].opacity = 255;
                }
            },this)

            this.node.children[i].on("touchend",(event) => {
                this.mouseDownItem = false;
            },this)
        }
    },
    spawn_yes_and_no(i,x,y){
        let YesMove = cc.instantiate(this.yes_move);
        YesMove.scaleX = this.node.parent.children[window.m_i].scaleX;
        YesMove.scaleY = this.node.parent.children[window.m_i].scaleY;
        this.node.addChild(YesMove);
        YesMove.setPosition(cc.v2(x + 30,y - 30));

        let NoMove = cc.instantiate(this.no_move);
        NoMove.scaleX = this.node.parent.children[window.m_i].scaleX;
        NoMove.scaleY = this.node.parent.children[window.m_i].scaleY;
        this.node.addChild(NoMove);
        NoMove.setPosition(cc.v2(x - 30,y - 30));

        this.node.children[this.node.children.length - 1].on("touchend",(event)=>{
            this.node.children[i].opacity = 255;
            this.node.children[i].setPosition(cc.v2(((this.node.width * (7/8)) * 0.5 * -1) + (i*((this.node.width * (2/8)) * 0.5)) + this.node_delta_scroll_x,0));
            this.node.parent.children[window.m_i]._components[1].destroy_many_square();
            this.node.parent.children[window.m_i]._components[1].destroy_last_child();
            this.node.children[this.node.children.length - 1].destroy();
            this.node.children[this.node.children.length - 2].destroy();
            this.addItemOnMeadow = false;
            this.item_selected_index = false;
            
        },this)
        
        this.node.children[this.node.children.length - 2].on("touchend",(event)=>{
            if(window.default_data.identity.money < this.node.children[i]._components[1].import_data.price){
                this.node.parent._components[2].show_alert("uang tidak cukup",
                this.node.x + this.node.children[i].x,
                this.node.y + this.node.children[i].y,
                new cc.Color(200,20,20));
                this.node.children[i].opacity = 255;
                this.node.children[i].setPosition(cc.v2(((this.node.width * (7/8)) * 0.5 * -1) + (i*((this.node.width * (2/8)) * 0.5)) + this.node_delta_scroll_x,0));
                this.node.parent.children[window.m_i]._components[1].destroy_many_square();
                this.node.parent.children[window.m_i]._components[1].destroy_last_child();
                this.node.children[this.node.children.length - 1].destroy();
                this.node.children[this.node.children.length - 2].destroy();
                this.addItemOnMeadow = false;
                this.item_selected_index = false;
                return;
            }
            window.default_data.object.push({
                name:this.node.children[i]._components[1].import_data.object_name,
                level:1,
                coord:{
                    x:((this.node.x + this.node.children[i].x) - (this.node.parent.children[window.m_i].x)) / this.node.parent.children[window.m_i].scaleX,
                    y:((this.node.y + this.node.children[i].y) - (this.node.parent.children[window.m_i].y)) / this.node.parent.children[window.m_i].scaleY
                },
                square_data:[]
            });
            this.node.parent._components[2].addMoney(-1*this.node.children[i]._components[1].import_data.price);
            let activity_string = "buy "+this.node.children[i]._components[1].import_data.object_name;
            this.node.parent._components[2].getActivity(activity_string);
            this.node.children[i].opacity = 255;
            this.node.children[i].setPosition(cc.v2(((this.node.width * (7/8)) * 0.5 * -1) + (i*((this.node.width * (2/8)) * 0.5)) + this.node_delta_scroll_x,0));
            this.node.parent.children[window.m_i]._components[1].sort_object_by_y_coord();
            this.node.parent.children[window.m_i]._components[1].spawn_many_object();
            this.node.children[this.node.children.length - 1].destroy();
            this.node.children[this.node.children.length - 2].destroy();
            
            let num_of_available = 0;
            let num_of_have_on_meadow = 0;
            for(let j = 0;j < window.default_data.object.length;j++){
                if(window.default_data.object[j].name == this.node.children[i]._components[1].import_data.object_name){
                    num_of_have_on_meadow++;
                }
            }
            for(let j = 0;j < this.node.children[i]._components[1].import_data.max.length;j++){
                if(window.our_level >= this.node.children[i]._components[1].import_data.max[j][0]){
                    num_of_available = this.node.children[i]._components[1].import_data.max[j][1];
                }else{
                    break;
                }
            }
            if(num_of_have_on_meadow + 1 > num_of_available){
                this.node.children[i]._components[1].import_data.max_label = true;
            }
            this.node.children[i].children[2]._components[0].string = num_of_have_on_meadow+"/"+num_of_available;

            this.addItemOnMeadow = false;
            this.item_selected_index = false;
        },this)
    },

    autoMove(){
        let moveX = 0;
        let moveY = 0;
        let move_active = false;
        if(this.mouseDownItemLocation.x > this.node.parent.width * (7/8)){
            moveX = 5;
            move_active = true;
        } else if(this.mouseDownItemLocation.x < this.node.parent.width * (1/8)){
            moveX = -5;
            move_active = true;
        }
        
        if(this.mouseDownItemLocation.y > this.node.parent.height * (7/8)){
            moveY = 5;
            move_active = true;
        } else if(this.mouseDownItemLocation.y < this.node.parent.height * (1/8)){
            moveY = -5;
            move_active = true;
        }

        if(move_active){

            let moveX_Y = this.node.parent.children[window.m_i]._components[1].MoveMeadow(-moveX,-moveY)
            
            if(moveX_Y.x == false) moveX = 0;
            if(moveX_Y.y == false) moveY = 0;
            this.mouseX += moveX / this.node.parent.children[window.m_i].scaleX;
            this.mouseY += moveY / this.node.parent.children[window.m_i].scaleX;
            
            let new_coord = this.node.parent.children[window.m_i]._components[1].ObjectOnMove(this.mouseX,this.mouseY);
            this.node.parent.children[window.m_i].children[this.index_object_selected].x = new_coord.x;
            this.node.parent.children[window.m_i].children[this.index_object_selected].y = new_coord.y;


            // Item selected position
            this.node.children[this.item_selected_index].x = this.node.parent.children[window.m_i].children[this.index_object_selected].x * this.node.parent.children[window.m_i].scaleX + this.node.parent.children[window.m_i].x - this.node.x;
            this.node.children[this.item_selected_index].y = this.node.parent.children[window.m_i].children[this.index_object_selected].y * this.node.parent.children[window.m_i].scaleY + this.node.parent.children[window.m_i].y - this.node.y;

            // No Button
            this.node.children[this.node.children.length - 1].setPosition(cc.v2(this.node.children[this.item_selected_index].x - 30,this.node.children[this.item_selected_index].y - 30));
            // Yes Button
            this.node.children[this.node.children.length - 2].setPosition(cc.v2(this.node.children[this.item_selected_index].x + 30,this.node.children[this.item_selected_index].y - 30));

            this.node.parent.children[window.m_i]._components[1].destroy_many_square();
            this.node.parent.children[window.m_i]._components[1].spawn_many_square(
                this.node.parent.children[window.m_i].children[this.last_index_of_meadow].x,
                this.node.parent.children[window.m_i].children[this.last_index_of_meadow].y,
                window.object_identity[this.index_object_identity].plot_of_move_system.start_x,
                window.object_identity[this.index_object_identity].plot_of_move_system.start_y,
                window.object_identity[this.index_object_identity].plot_of_move_system.cols,
                window.object_identity[this.index_object_identity].plot_of_move_system.rows,
                false
                );
        }

    },

    onClose(){
        this.node.children[0].on("touchend",(event)=>{
            window.action_active = false;
            this.node.destroy();
        },this)
    }
});
