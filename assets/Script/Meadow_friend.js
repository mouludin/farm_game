// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        t_o:{
            default:null,
            type:cc.Prefab
        },
        home_1_prefab:{
            default:null,
            type:cc.Prefab
        },
        grinding_machine:{
            default:null,
            type:cc.Prefab
        },
        order_board_prefab:{
            default:null,
            type:cc.Prefab
        },
        tree_forest_prefab:{
            default:null,
            type:cc.Prefab
        },
        tree_apple_prefab:{
            default:null,
            type:cc.Prefab
        },
        tree_lemon_prefab:{
            default:null,
            type:cc.Prefab
        },
        planting_slot_prefab:{
            default:null,
            type:cc.Prefab
        },
        barn_prefab:{
            default:null,
            type:cc.Prefab
        },
        chicken_area_prefab:{
            default:null,
            type:cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.MeadowMouseDown = false;
        this.onDrag();
        this.sort_object_by_y_coord();
        this.spawn_many_object();
    },

    start () {

    },

    onDrag(){
        let parentWidth = this.node.parent.width;
        let parentHeight = this.node.parent.height;

        this.node.on("touchstart", (event) => {
            this.MeadowMouseDown = true;
        },this)
        
        this.node.on("touchmove", (event) => {
            this.delta = event.getDelta();
            this.mouse_position = event.getLocation();
            if(!this.MeadowMouseDown) return;
            this.node.x += this.delta.x;
            if(Math.abs(this.node.x) > (((this.node.width/2)* this.node.scaleX) - parentWidth/2)){
                if(this.node.x < 0){
                    this.node.x = (((this.node.width/2) * this.node.scaleX) - parentWidth/2) * -1;
                }else{
                    this.node.x = (((this.node.width/2) * this.node.scaleX)- parentWidth/2) * 1;
                }
            }
            
            this.node.y += this.delta.y;
            if(Math.abs(this.node.y) > (((this.node.height/2) * this.node.scaleY) - parentHeight/2)){
                if(this.node.y < 0){
                    this.node.y = (((this.node.height/2)* this.node.scaleY) - parentHeight/2) * -1;
                }else{
                    this.node.y = (((this.node.height/2)* this.node.scaleY) - parentHeight/2) * 1;
                }
            }
        },this)
        
        this.node.on("touchend", event => {
            this.MeadowMouseDown = false;
        },this)
    },

    sort_object_by_y_coord:function(){
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            let first = 0;
            let second = 0;
            let rows = 0;
            let cols = 0;
            for(let j = 0;j < window.object_identity.length;j++){
                if(window.object_identity[j].name == window.friend_meadow_load.object[i].name){
                    first = window.object_identity[j].plot_of_move_system.start_x;
                    cols = window.object_identity[j].plot_of_move_system.cols;
                    rows = window.object_identity[j].plot_of_move_system.rows;
                    second = window.object_identity[j].plot_of_move_system.start_y;
                    break;
                }
            }
            let vector_will_be_save = []
            for(let y = 0;y < rows;y++){
                let m_first = first;
                let m_second = second;
                for(let x = 0;x < cols; x++){
                    vector_will_be_save.push([window.friend_meadow_load.object[i].coord.x + m_first,window.friend_meadow_load.object[i].coord.y + m_second]);
                    m_first += 15;
                    m_second += 10;
                }
                first += 15;
                second -= 10;
            }
            window.friend_meadow_load.object[i].square_data = vector_will_be_save;
        }
        window.friend_meadow_load.object.sort((a,b)=>{
            return b.coord.y - a.coord.y;
        });
    },

    spawn_many_object:function(){
        for(let i = 0;i < this.node.children.length; i++){
            this.node.children[i].destroy();
        }
        for(let i = 0;i < window.default_data.friend_data[window.friend_meadow_load.index].history.length;i++){
            let object_index = window.default_data.friend_data[window.friend_meadow_load.index].history[i].index;
            window.friend_meadow_load.object[object_index] = window.default_data.friend_data[window.friend_meadow_load.index].history[i];
        }
        let last_index = 0;
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            window.friend_meadow_load.object[i].ID = i;
            last_index = i;
            this.spawnNewObject(window.friend_meadow_load.object[i]);
        }
        for(let i = 0;i < window.friend_meadow_load.object.length;i++){
            last_index += 1;
            let stuff_identity;
            for(let k = 0;k < window.stuff_identity.length;k++){
                if(window.stuff_identity[k].object_name == window.friend_meadow_load.object[i].name){
                    stuff_identity = window.stuff_identity[k];
                    break;
                }
            }
            if(stuff_identity.type == "plant" || stuff_identity.type == "tree" || stuff_identity.type == "animal" || stuff_identity.type == "machine"){
                let newObject = cc.instantiate(this.t_o);
                newObject._components[1].object_data = window.friend_meadow_load.object[i];
                newObject._components[1].t_o_id = last_index;
                newObject._components[1].stuff_identity = stuff_identity;
                for(let j = 0; j < window.object_identity.length; j++){
                    if(window.object_identity[j].name == newObject._components[1].object_data.name){
                        newObject._components[1].object_identity = window.object_identity[j];
                        newObject.angle = window.object_identity[j].t_o.rotation;
                        newObject.scaleX = window.object_identity[j].t_o.scaleX;
                        newObject.scaleY = window.object_identity[j].t_o.scaleY;
                        newObject.width = window.object_identity[j].t_o.width;
                        newObject.height = window.object_identity[j].t_o.height;
                        newObject.setPosition(
                        cc.v2(
                            window.object_identity[j].t_o.x + window.friend_meadow_load.object[i].coord.x,
                            window.object_identity[j].t_o.y + window.friend_meadow_load.object[i].coord.y
                        ));
                    }
                }
                this.node.addChild(newObject);
            }
        }
    },

    spawnNewObject: function(data){
        let newObject = cc.instantiate(this.get_object_by_macros(data.name));
        newObject._components[1].ownData = data;
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(data.coord.x, data.coord.y));
    },

    get_object_by_macros:function(name){
        switch (name){
            //tree
            case "forest_tree":
                return this.tree_forest_prefab;
            case "apple_tree":
                return this.tree_apple_prefab;
            case "lemon_tree":
                return this.tree_lemon_prefab;
            //plant
            case "planting_slot":
                return this.planting_slot_prefab;
            //other
            case "barn":
                return this.barn_prefab;
            case "home_1":
                return this.home_1_prefab;
            case "order_board":
                return this.order_board_prefab;
            //machine
            case "grinding_machine":
                return this.grinding_machine;
            //animal
            case "chicken_area":
                return this.chicken_area_prefab;
            default:
                console.error("unknown object");
        }
    },

    // update (dt) {},
});
