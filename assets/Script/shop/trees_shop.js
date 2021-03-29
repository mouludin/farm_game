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
        apple_tree:{
            default:null,
            type:cc.Prefab
        },
        lemon_tree:{
            default:null,
            type:cc.Prefab
        }
    },

    onLoad () {
        this.type_of_item;

        this.node.width = this.node.parent.width;
        
        this.mouseDownItemLocation = {x:0,y:0};

        this.node_delta_scroll_x = 0;

        this.all_item_identity = [];

        this.first_item_coord_x;

        this.mouseDownItem = false;
        this.addItemOnMeadow = false;

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

            newObject.scaleX = this.node.parent.children[window.m_i].scaleX;
            newObject.scaleY = this.node.parent.children[window.m_i].scaleY;
            newObject._components[1].import_data = this.all_item_identity[i];
            if(this.all_item_identity[i].available_level <= window.our_level){
                let price = cc.instantiate(this.node.parent._components[2].get_object_by_macros("text_global_mikado"));
                price._components[0].string = "$" + this.all_item_identity[i].price;
                price.scaleX = 1 / this.node.parent.children[window.m_i].scaleX;
                price.scaleY = 1 / this.node.parent.children[window.m_i].scaleY;
                price.setPosition(cc.v2(0,-price.height / 3));
                newObject.addChild(price);
            }else{
                newObject.color = new cc.Color(100,100,100);
                newObject.children[0].color = new cc.Color(100,100,100);
                let padlock = cc.instantiate(this.node.parent._components[2].get_object_by_macros("padlock"));
                padlock.scaleX = 1 / this.node.parent.children[window.m_i].scaleX;
                padlock.scaleY = 1 / this.node.parent.children[window.m_i].scaleY;
                padlock.setPosition(cc.v2(0, padlock.height / 3));
                newObject.addChild(padlock);
                let level_available = cc.instantiate(this.node.parent._components[2].get_object_by_macros("text_global_mikado"));
                level_available._components[0].string = "Lv." + this.all_item_identity[i].available_level;
                level_available.scaleX = 1 / this.node.parent.children[window.m_i].scaleX;
                level_available.scaleY = 1 / this.node.parent.children[window.m_i].scaleY;
                level_available.setPosition(cc.v2(0,(padlock.height / 3) - (padlock.height / 2 )));
                newObject.addChild(level_available);
            }
            this.node.addChild(newObject);
            newObject.setPosition(cc.v2(((this.node.width * (7/8)) * 0.5 * -1) + ((i+1)*((this.node.width * (2/8)) * 0.5)),0));

        }
        this.first_item_coord_x = this.node.children[1].x;
    },


    get_prefab_by_name:function(name){  
        let result;
        switch (name) {
            case "apple":
                    result = this.apple_tree;
                break;
            case "lemon":
                    result = this.lemon_tree;
                break;
            default:
                break;
        }
        return result;
    },

    meadowOnDrag(){
        if(window.MeadowOnDrag && this.item_selected_index){
                this.node.children[this.item_selected_index].setPosition(cc.v2(
                    this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].x * this.node.parent.children[window.m_i].scaleX + this.node.parent.children[window.m_i].x - this.node.x,
                    this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].y * this.node.parent.children[window.m_i].scaleY + this.node.parent.children[window.m_i].y - this.node.y
                ))

                // No Button
                this.node.children[this.node.children.length - 1].setPosition(cc.v2(this.node.children[this.item_selected_index].x - 30,this.node.children[this.item_selected_index].y - 30));
                // Yes Button
                this.node.children[this.node.children.length - 2].setPosition(cc.v2(this.node.children[this.item_selected_index].x + 30,this.node.children[this.item_selected_index].y - 30));
        }
    },   

    itemOnDrag(){
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
                if(!this.addItemOnMeadow){
                    let x_add = ((this.node.x + this.node.children[i].x) - (this.node.parent.children[window.m_i].x)) / this.node.parent.children[window.m_i].scaleX;
                    let y_add = ((this.node.y + this.node.children[i].y) - (this.node.parent.children[window.m_i].y)) / this.node.parent.children[window.m_i].scaleY;
                    this.node.parent.children[window.m_i]._components[1].spawnNewObject(
                            {name:this.node.children[i]._name,coord:{x:x_add,y:y_add},ID:this.node.parent.children[window.m_i].children.length - 1,already_watered:false,time_start:0,square_data:[]}
                        );

                    // index of selected Item
                    this.item_selected_index = i;

                    this.spawn_yes_and_no(i,this.node.children[i].x,this.node.children[i].y);

                    this.last_index_of_meadow = this.node.parent.children[window.m_i].children.length - 1;

                    this.mouseX = ((this.node.x + this.node.children[i].x) - (this.node.parent.children[window.m_i].x)) / this.node.parent.children[window.m_i].scaleX;
                    this.mouseY = ((this.node.y + this.node.children[i].y) - (this.node.parent.children[window.m_i].y)) / this.node.parent.children[window.m_i].scaleY;

                    for(let j = 0; j < window.object_identity.length;j++){
                        if(window.object_identity[j].name == this.node.children[i]._name){
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
                this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].x = new_coord.x;
                this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].y = new_coord.y;


                // Item selected position
                this.node.children[i].x = this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].x * this.node.parent.children[window.m_i].scaleX + this.node.parent.children[window.m_i].x - this.node.x;
                this.node.children[i].y = this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].y * this.node.parent.children[window.m_i].scaleY + this.node.parent.children[window.m_i].y - this.node.y;

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
                name:this.node.children[i]._name,
                coord:{
                    x:((this.node.x + this.node.children[i].x) - (this.node.parent.children[window.m_i].x)) / this.node.parent.children[window.m_i].scaleX,
                    y:((this.node.y + this.node.children[i].y) - (this.node.parent.children[window.m_i].y)) / this.node.parent.children[window.m_i].scaleY
                },
                already_watered:false,
                time_start:0,
                time_end:0,
                fertilizer:"none",
                square_data:[]
            });
            this.node.parent._components[2].addMoney(-1*this.node.children[i]._components[1].import_data.price);
            let activity_string = "buy "+this.node.children[i]._name;
            this.node.parent._components[2].getActivity(activity_string);
            this.node.children[i].opacity = 255;
            this.node.children[i].setPosition(cc.v2(((this.node.width * (7/8)) * 0.5 * -1) + (i*((this.node.width * (2/8)) * 0.5)) + this.node_delta_scroll_x,0));
            this.node.parent.children[window.m_i]._components[1].sort_object_by_y_coord();
            this.node.parent.children[window.m_i]._components[1].spawn_many_object();
            this.node.children[this.node.children.length - 1].destroy();
            this.node.children[this.node.children.length - 2].destroy();
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
            this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].x = new_coord.x;
            this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].y = new_coord.y;


            // Item selected position
            this.node.children[this.item_selected_index].x = this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].x * this.node.parent.children[window.m_i].scaleX + this.node.parent.children[window.m_i].x - this.node.x;
            this.node.children[this.item_selected_index].y = this.node.parent.children[window.m_i].children[this.node.parent.children[window.m_i].children.length  - (this.num_of_move_plot + 1)].y * this.node.parent.children[window.m_i].scaleY + this.node.parent.children[window.m_i].y - this.node.y;

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
