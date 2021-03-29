cc.Class({
    extends: cc.Component,

    properties: {
        close_button:{
            default:null,
            type:cc.Node
        },
        update_button:{
            default:null,
            type:cc.Node
        },
        back_button:{
            default:null,
            type:cc.Prefab
        },
        right_page:{
            default:null,
            type:cc.Prefab
        },
        left_page:{
            default:null,
            type:cc.Prefab
        },
        item_box:{
            default:null,
            type:cc.Prefab
        },

        total_label:{
            default:null,
            type:cc.Prefab
        },
        buy_item_increase_button:{
            default:null,
            type:cc.Prefab
        },

        sufficient_item_increase:{
            default:null,
            type:cc.Prefab
        },

        storage_label_o_c:{
            default:null,
            type:cc.Prefab
        },
        storage_count_o_c:{
            default:null,
            type:cc.Prefab
        },
        item_box_o_c:{
            default:null,
            type:cc.Prefab
        },
        name_o_c:{
            default:null,
            type:cc.Prefab
        },
        selling_price_o_c:{
            default:null,
            type:cc.Prefab
        },
        selling_price_num_o_c:{
            default:null,
            type:cc.Prefab
        },
        purchase_price_o_c:{
            default:null,
            type:cc.Prefab
        },
        purchase_price_num_o_c:{
            default:null,
            type:cc.Prefab
        },
        purchase_price_num_o_c:{
            default:null,
            type:cc.Prefab
        },
        buy_info_box_o_c:{
            default:null,
            type:cc.Prefab
        },
        sell_info_box_o_c:{
            default:null,
            type:cc.Prefab
        },
        buy_count_o_c:{
            default:null,
            type:cc.Prefab
        },
        buy_button_o_c:{
            default:null,
            type:cc.Prefab
        },
        sell_count_o_c:{
            default:null,
            type:cc.Prefab
        },
        sell_button_o_c:{
            default:null,
            type:cc.Prefab
        },
        gold_sell_o_c:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.page_index = 0;

        // let our_storage = [];

        // for(let i = 0;i < window.default_data.storage.length;i++)
        // {
        //     our_storage.push(window.default_data.storage[i]);
        // }

        // window.default_data.storage = our_storage;
        this.items_list = this.array_to_matrix(this.array_to_matrix(window.default_data.storage));

        this.close_button.on("touchstart", function(event){
            window.action_active = false;
            this.node.destroy();
        },this);
        
        this.show_item();
        this.onDrag();
        this.update_button_onClick();
        
    },

    start () {
        
    },
    
    update (dt) {
        
    },
    
    show_item: function(){
        this.onIncrease_storage = false;
        this.update_button.children[0]._components[0].string = "Increase Storage";
        for(let i = 0;i < this.items_list[this.page_index].length;i++){
            for(let j = 0; j < this.items_list[this.page_index][i].length;j++){
                let x = -200 + ((j/3) * 400);
                let y = 200 - ((i/3) * 400);
                // console.log(this.items_list[this.page_index][i][j].name);
                this.spawnNewObject(this.item_box, cc.v2(x, y),this.items_list[this.page_index][i][j].name,this.items_list[this.page_index][i][j].total,object=>{
                    object.on("touchstart",event=>{
                        this.spawn_item_action(this.items_list[this.page_index][i][j].name,this.items_list[this.page_index][i][j].total);
                    },this)
                });

            }
        }
        if(this.items_list[this.page_index + 1]){ this.spawnNewObject(this.right_page,cc.v2(300,-250)) };
        if(this.items_list[this.page_index - 1]){ this.spawnNewObject(this.left_page,cc.v2(-300,-250)) };
    },

    spawnNewObject: function(a,position = undefined,name = undefined,total = undefined,func = undefined){
        let newObject = cc.instantiate(a);
        if(name != undefined && total != undefined){
            newObject._components[1].item_name = name;
            newObject._components[1].total = total;
        }
        this.node.addChild(newObject);
        if(position != undefined){
            newObject.setPosition(position);
        }
        if(func != undefined){
            func(newObject);
        }
    },

    array_to_matrix: function(storage){

        let matrix_storage = [];
        let size_each_line = 4;
        let array_per_line = [];
        for(let i = 0;i < storage.length;i++)
        {
            array_per_line.push(storage[i]);
            size_each_line -= 1;

            if(size_each_line == 0){
                matrix_storage.push(array_per_line);
                array_per_line = [];
                size_each_line = 4;
            }

            if(i == storage.length - 1){
                matrix_storage.push(array_per_line);
            }
        }
        return matrix_storage;
    },

    right_page_act:function(){
        this.page_index += 1;
        for(let i = 0;i < this.node._children.length;i++){
            if(
                this.node._children[i].name == 'item' ||
                this.node._children[i].name == 'right_page' ||
                this.node._children[i].name == 'left_page'
            ){
                this.node._children[i].destroy();
            }
        }
        this.show_item();
    },
    
    left_page_act:function(){
        this.page_index -= 1;
        for(let i = 0;i < this.node._children.length;i++){
            if(
                this.node._children[i].name == 'item' ||
                this.node._children[i].name == 'right_page' ||
                this.node._children[i].name == 'left_page'
            ){
                this.node._children[i].destroy();
            }
        }
        this.show_item();

    },

    onDrag(){
        this.node.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
            this.mouseDown = true;
            window.MeadowMouseDown = false;
        })

        this.node.on(cc.Node.EventType.MOUSE_MOVE, (event) => {
            window.MeadowMouseDown = false;
        })

        this.node.on(cc.Node.EventType.MOUSE_UP, (event) => {
            this.mouseDown = false;
        })
    },

    update_button_onClick:function(){
        this.update_button.on("touchstart",event=>{
            this.update_button.color = new cc.Color(120,120,120);
        },this)
        this.update_button.on("touchend",event=>{
            this.update_button.color = new cc.Color(255,255,255);
            if(this.onIncrease_storage){
                if(this.num_of_item_sufficient != 3){
                    console.log("tidak cukup");
                }else{
                    let total_item_needed = 1 + (window.default_data.object[this.barn_id].level - (window.default_data.object[this.barn_id].level % 2)) / 2;
                    window.default_data.object[this.barn_id].level += 1;
                    for(let i = 0;i < window.default_data.storage.length;i++){
                        if(window.default_data.storage[i].name == this.get_object_by_macros("nail").data.name ||
                        window.default_data.storage[i].name == this.get_object_by_macros("measuring_tape").data.name ||
                        window.default_data.storage[i].name == this.get_object_by_macros("hammer").data.name
                        ){
                            window.default_data.storage[i].total -= total_item_needed;
                        }
                    }
                    this.node.parent._components[2].setStorageCapacity();
                    this.increase_storage_show();
                    console.log(window.default_data.storage);
                }
            }else{
                this.increase_storage_show();
            }
        },this);
    },

    increase_storage_show:function(){
        
        this.nail_price_data;
        this.measuring_tape_price_data;
        this.hammer_price_data;

        this.num_of_item_sufficient = 0;

        this.onIncrease_storage = true;
        this.update_button.color = new cc.Color(255,255,255);

        this.update_button.setPosition(cc.v2(60,-280));
        this.update_button.children[0]._components[0].string = "confirm";
        let total_item_needed = 1 + (window.default_data.object[this.barn_id].level - (window.default_data.object[this.barn_id].level % 2)) / 2;
        
        for(let i = 0;i < this.node._children.length;i++){
            if(this.node._children[i].name == this.close_button.name || this.node._children[i].name == this.update_button.name)continue;
            this.node._children[i].destroy();
        }

        this.spawnNewObject(this.back_button,undefined,undefined,undefined,object=>{
            object.on("touchend",event=>{
                this.update_button.setPosition(cc.v2(0,-280));
                for(let i = 0; i < this.node.children.length;i++){
                    if(!(this.node.children[i].name == this.close_button.name || this.node.children[i].name == this.update_button.name)){
                        this.node.children[i].destroy();
                    }
                }
                this.show_item();
            },this)
        })


        function get_price_data(name){
            let price_data;
            for(let j = 0;j < window.item_selling_price.length;j++){
                if(window.item_selling_price[j].name == name){
                    price_data = window.item_selling_price[j];
                    break;
                }
            }
            return price_data;
        }
        for(let i = 0; i < window.default_data.storage.length;i++){
            if(window.default_data.storage[i].name == this.get_object_by_macros("nail").data.name) {
                this.nail_price_data = window.default_data.storage[i];
                this.nail_price_data.index = i;
                this.nail_price_data.price_data = get_price_data(window.default_data.storage[i].name);
            }
            if(window.default_data.storage[i].name == this.get_object_by_macros("measuring_tape").data.name){
                this.measuring_tape_price_data = window.default_data.storage[i];
                this.measuring_tape_price_data.index = i;
                this.measuring_tape_price_data.price_data = get_price_data(window.default_data.storage[i].name);
            };
            if(window.default_data.storage[i].name == this.get_object_by_macros("hammer").data.name){
                this.hammer_price_data = window.default_data.storage[i];
                this.hammer_price_data.index = i;
                this.hammer_price_data.price_data = get_price_data(window.default_data.storage[i].name);
            };
        }

        this.spawnNewObject(this.node.parent._components[2].text_global,cc.v2(0,200),undefined,undefined,object=>{
            object._components[0].string = "Requirements to increase \n this barn capacity by 5";
            object.color = new cc.Color(0,0,0);
        });

        this.spawnNewObject(this.get_object_by_macros("nail"),cc.v2(-180,100),undefined,undefined,object=>{
            object.width = 115;
            object.height = 115;
        });
        this.spawnNewObject(this.get_object_by_macros("measuring_tape"),cc.v2(-180,-30),undefined,undefined,object=>{
            object.width = 115;
            object.height = 115;
        });
        this.spawnNewObject(this.get_object_by_macros("hammer"),cc.v2(-180,-160),undefined,undefined,object=>{
            object.width = 118;
            object.height = 108;
        });

        this.spawnNewObject(this.node.parent._components[2].text_global,cc.v2(0,100),undefined,undefined,object=>{
            object._components[0].string = `${this.nail_price_data.total}/${total_item_needed}`;
            object._components[0].fontSize = 40;
            object.color = new cc.Color(0,0,0);
        });
        this.spawnNewObject(this.node.parent._components[2].text_global,cc.v2(0,-30),undefined,undefined,object=>{
            object._components[0].string = `${this.measuring_tape_price_data.total}/${total_item_needed}`;
            object._components[0].fontSize = 40;
            object.color = new cc.Color(0,0,0);
        });
        this.spawnNewObject(this.node.parent._components[2].text_global,cc.v2(0,-160),undefined,undefined,object=>{
            object._components[0].string = `${this.hammer_price_data.total}/${total_item_needed}`;
            object._components[0].fontSize = 40;
            object.color = new cc.Color(0,0,0);
        });

        let button_add_item_action = (object,item)=>{
            object.children[1]._components[0].string = (item.price_data.gold * 5);
            object.on("touchstart",event=>{
                object.color = new cc.Color(200,20,20);
                if(window.default_data.identity.gold < (item.price_data.gold * 5)){
                    this.node.parent._components[2].show_alert("emas tidak cukup",0,0,new cc.Color(0,0,0));
                }else{
                    let result = this.node.parent._components[2].addItemOnStorage(item.name);
                    window.default_data.storage[item.index] = {name:window.default_data.storage[item.index].name,total:window.default_data.storage[item.index].total};
                    if(result[1] == true){
                        return;
                    }
                    this.node.parent._components[2].addGold(-item.price_data.gold * 5);
                    this.increase_storage_show();
                }
            },this)
            object.on("touchend",event=>{
                object.color = new cc.Color(255,255,255);
            },this)
        }

        if(this.nail_price_data.total < total_item_needed){
            this.spawnNewObject(this.buy_item_increase_button,cc.v2(180,100),undefined,undefined,object=>{
                button_add_item_action(object,this.nail_price_data)
            });
        }else{
            this.spawnNewObject(this.sufficient_item_increase,cc.v2(180,100));
            this.num_of_item_sufficient += 1;
        }
        
        if(this.measuring_tape_price_data.total < total_item_needed){
            this.spawnNewObject(this.buy_item_increase_button,cc.v2(180,-30),undefined,undefined,object=>{
                button_add_item_action(object,this.measuring_tape_price_data)
            });
        }else{
            this.spawnNewObject(this.sufficient_item_increase,cc.v2(180,-30));
            this.num_of_item_sufficient += 1;
        }
        
        if(this.hammer_price_data.total < total_item_needed){
            this.spawnNewObject(this.buy_item_increase_button,cc.v2(180,-160),undefined,undefined,object=>{
                button_add_item_action(object,this.hammer_price_data)
            });
        }else{
            this.spawnNewObject(this.sufficient_item_increase,cc.v2(180,-160));
            this.num_of_item_sufficient += 1;
        }
    },

    spawn_item_action:function(name,total){
        for(let i = 0;i < this.node._children.length;i++){
            if(this.node._children[i].name == this.close_button.name || this.node._children[i].name == this.update_button.name)continue;
            this.node._children[i].destroy();
        }
        let capacity = 0;
        for(let i = 0;i < window.default_data.storage.length;i++){
            capacity += window.default_data.storage[i].total;
            this.update_button.setPosition(cc.v2(60,-280));
        }

        this.buy_count_num = 0;
        this.sell_count_num = 0;
        this.sell_item_price = undefined;
        this.sell_info_box_index = 10;
        this.buy_info_box_index = 11;
        this.update_button.setPosition(cc.v2(60,-280));
        this.spawnNewObject(this.storage_label_o_c)

        this.spawnNewObject(this.storage_count_o_c,undefined,undefined,undefined,object=>{
            object._components[0].string = `${capacity}/${window.our_capacity}`;
            object.x = 255 - object.width/2;
        })
        this.spawnNewObject(this.item_box_o_c,undefined,undefined,undefined,object=>{
            let newObject = cc.instantiate(this.get_object_by_macros(name))
            let total_prefab = cc.instantiate(this.total_label)
            object.addChild(newObject);
            object.addChild(total_prefab);
            total_prefab._components[0].string = total;
            total_prefab.setPosition(cc.v2(42*1.5,-36*1.5));
            newObject.scaleX = 3;
            newObject.scaleY = 3;
            newObject.setPosition(cc.v2(0,0));
        })
        this.spawnNewObject(this.name_o_c,undefined,undefined,undefined,object=>{
            object._components[0].string = name.replace("_"," ");
        })


        this.spawnNewObject(this.selling_price_o_c,undefined,undefined,undefined,object=>{

        })


        this.spawnNewObject(this.selling_price_num_o_c,undefined,undefined,undefined,object=>{
            for(let i = 0;i < window.item_selling_price.length;i++){
                if(window.item_selling_price[i].name == name){
                    object._components[0].string = window.item_selling_price[i].price;
                    this.sell_item_price = window.item_selling_price[i];
                    object.x = 255 - object.width/2;
                    break;
                }
            }
        })

        this.spawnNewObject(this.purchase_price_o_c,undefined,undefined,undefined,object=>{

        })

        this.spawnNewObject(this.purchase_price_num_o_c,undefined,undefined,undefined,object=>{
            for(let i = 0;i < window.item_selling_price.length;i++){
                if(window.item_selling_price[i].name == name){
                    object._components[0].string = window.item_selling_price[i].price * 5;
                    object.x = 255 - object.width/2;
                    break;
                }
            }
        })
        this.spawnNewObject(this.sell_info_box_o_c,undefined,undefined,undefined,object=>{
            object.children[1]._components[0].string = this.sell_count_num ;
            object.children[3]._components[0].string = this.sell_item_price.price * this.sell_count_num;
            if(object.children[4]){
                object.children[4].destroy();
                let newObject = cc.instantiate(this.get_object_by_macros(name));
                object.addChild(newObject);
                newObject.scaleX = 0.85;
                newObject.scaleY = 0.85;
                newObject.setPosition(cc.v2(-100,0));
            }
        })
        
        this.spawnNewObject(this.buy_info_box_o_c,undefined,undefined,undefined,object=>{
            if(this.sell_item_price.gold){
                object.children[1]._components[0].string = this.sell_item_price.gold * 5 * this.buy_count_num;
                object.children[0].opacity = 0;
            }else{
                object.children[1]._components[0].string = this.sell_item_price.price * 5 * this.buy_count_num;
            }
            object.children[3]._components[0].string = this.buy_count_num;
            if(object.children[4]){
                object.children[4].destroy();
                let newObject = cc.instantiate(this.get_object_by_macros(name));
                object.addChild(newObject);
                newObject.scaleX = 0.85;
                newObject.scaleY = 0.85;
                newObject.setPosition(cc.v2(60,0));

                if(!this.sell_item_price.gold) return;
                let goldObject = cc.instantiate(this.gold_sell_o_c);
                object.addChild(goldObject);
                goldObject.width = 40;
                goldObject.height = 40;
                goldObject.setPosition(cc.v2(object.children[0].x,object.children[0].y));
            }
        })

        this.spawnNewObject(this.buy_count_o_c,undefined,undefined,undefined,object=>{
            object.children[2]._components[0].string = this.buy_count_num;
            // MIN
            object.children[0].on("touchstart",event=>{
                object.children[0].color = new cc.Color(120,120,120)
            },this)
            object.children[0].on("touchend",event=>{
                object.children[0].color = new cc.Color(255,255,255)
                if(this.buy_count_num + -1 < 0)return;
                this.buy_count_num += -1;
                object.children[2]._components[0].string = this.buy_count_num;
                if( this.sell_item_price.gold){
                    this.node.children[this.buy_info_box_index].children[1]._components[0].string = this.sell_item_price.gold * 5 * this.buy_count_num;
                }else{
                    this.node.children[this.buy_info_box_index].children[1]._components[0].string = this.sell_item_price.price * 5 * this.buy_count_num;
                }
                this.node.children[this.buy_info_box_index].children[3]._components[0].string = this.buy_count_num;
            },this)

            // ADD
            object.children[1].on("touchstart",event=>{
                object.children[1].color = new cc.Color(120,120,120)
            },this)
            object.children[1].on("touchend",event=>{
                object.children[1].color = new cc.Color(255,255,255)
                if(this.buy_count_num + 1 > (window.our_capacity - capacity))return;
                this.buy_count_num += 1;
                object.children[2]._components[0].string = this.buy_count_num;
                if( this.sell_item_price.gold){
                    this.node.children[this.buy_info_box_index].children[1]._components[0].string = this.sell_item_price.gold * 5 * this.buy_count_num;
                }else{
                    this.node.children[this.buy_info_box_index].children[1]._components[0].string = this.sell_item_price.price * 5 * this.buy_count_num;
                }
                this.node.children[this.buy_info_box_index].children[3]._components[0].string = this.buy_count_num;
            },this)
        })

        this.spawnNewObject(this.buy_button_o_c,undefined,undefined,undefined,object=>{
            object.on("touchstart",event=>{
                object.color = new cc.Color(120,120,120)
            },this)
            object.on("touchend",event => {
                object.color = new cc.Color(255,255,255)
                let index = this.get_index_item_on_save_data(name);
                let condition;
                if(this.sell_item_price.gold){
                    condition = (this.sell_item_price.gold * 5 * this.buy_count_num <= window.default_data.identity.gold)
                }else{
                    condition = (this.sell_item_price.price * 5 * this.buy_count_num <= window.default_data.identity.money)
                }
                if(condition){
                    if(index != undefined){
                        window.default_data.storage[index].total += this.buy_count_num;
                        if(this.sell_item_price.gold){
                            this.node.parent._components[2].addGold(-this.sell_item_price.gold * 5 * this.buy_count_num)
                        }else{
                            this.node.parent._components[2].addMoney(-this.sell_item_price.price * 5 * this.buy_count_num)
                        }
                        this.spawn_item_action(name,window.default_data.storage[index].total);
                    }else{
                        console.error("unknown : " + index)
                    }
                }else{
                    if(this.sell_item_price.gold){
                        this.node.parent._components[2].show_alert("emas tidak cukup",0,0, new cc.Color(200,100,100))
                    }
                    this.node.parent._components[2].show_alert("uang tidak cukup",0,0, new cc.Color(200,100,100))
                }
            },this)

        })

        this.spawnNewObject(this.sell_count_o_c,undefined,undefined,undefined,object=>{
            object.children[2]._components[0].string = this.sell_count_num;
            // MIN
            object.children[0].on("touchstart",event=>{
                object.children[0].color = new cc.Color(120,120,120)
            },this)
            object.children[0].on("touchend",event=>{
                object.children[0].color = new cc.Color(255,255,255)
                if(this.sell_count_num + -1 < 0)return;
                this.sell_count_num += -1;
                object.children[2]._components[0].string = this.sell_count_num;
                this.node.children[this.sell_info_box_index].children[1]._components[0].string = this.sell_count_num ;
                this.node.children[this.sell_info_box_index].children[3]._components[0].string = this.sell_item_price.price * this.sell_count_num;
            },this)
            
            // ADD
            object.children[1].on("touchstart",event=>{
                object.children[1].color = new cc.Color(120,120,120);
            },this)
            object.children[1].on("touchend",event=>{
                object.children[1].color = new cc.Color(255,255,255);
                if(this.sell_count_num + 1 > total)return;
                this.sell_count_num += 1;
                object.children[2]._components[0].string = this.sell_count_num;
                this.node.children[this.sell_info_box_index].children[1]._components[0].string = this.sell_count_num ;
                this.node.children[this.sell_info_box_index].children[3]._components[0].string = this.sell_item_price.price * this.sell_count_num;
            },this)
        })

        this.spawnNewObject(this.sell_button_o_c,undefined,undefined,undefined,object=>{
            object.on("touchstart",event=>{
                object.color = new cc.color(120,120,120);
            },this)

            object.on("touchend",event=>{
                object.color = new cc.color(255,255,255);
                let index = this.get_index_item_on_save_data(name);
                if(index != undefined){
                    window.default_data.storage[index].total -= this.sell_count_num;
                    this.node.parent._components[2].addMoney(this.sell_item_price.price * this.sell_count_num);
                    this.spawn_item_action(name,window.default_data.storage[index].total);
                }else{
                    console.error("unknown : "+index)
                }
            },this)
        })

        this.spawnNewObject(this.back_button,undefined,undefined,undefined,object=>{
            object.on("touchend",event=>{
                this.update_button.setPosition(cc.v2(0,-280));
                for(let i = 0; i < this.node.children.length;i++){
                    if(!(this.node.children[i].name == this.close_button.name || this.node.children[i].name == this.update_button.name)){
                        this.node.children[i].destroy();
                    }
                }
                this.show_item();
            },this)
        })
    },

    get_index_item_on_save_data:function(name){
        let result = undefined;
        for(let i = 0;i < window.default_data.storage.length;i++){
            if(window.default_data.storage[i].name == name){
                result = i;
                break;
            }
        }
        if(result != undefined){
            return result;
        }else{
            console.error("unknown : "+ name);
            return undefined;
        }
    },

    get_object_by_macros:function(name){
        return this.node.parent._components[3].get_prefab(name);
    },
});
