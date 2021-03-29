cc.Class({
    extends: cc.Component,

    properties: {
        land_object:{
            default:null,
            type:cc.JsonAsset
        },
        Bucket:{
            default:null,
            type:cc.Prefab
        },
        time_showing:{
            default:null,
            type:cc.Prefab
        },
        time_label:{
            default:null,
            type:cc.Prefab
        },
        t_o:{
            default:null,
            type:cc.Prefab
        },
        home_1_prefab:{
            default:null,
            type:cc.Prefab
        },
        whiteSquare:{
            default:null,
            type:cc.Prefab
        },
        redSquare:{
            default:null,
            type:cc.Prefab
        },
        order_board_prefab:{
            default:null,
            type:cc.Prefab
        },
        barn_prefab:{
            default:null,
            type:cc.Prefab
        },
        fertilizer_spreader_prefab:{
            default:null,
            type:cc.Prefab
        },
        grinding_machine_prefab:{
            default:null,
            type:cc.Prefab
        },
        sales_desk_prefab:{
            default:null,
            type:cc.Prefab
        },
        planting_slot_prefab:{
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
        chicken_area_prefab:{
            default:null,
            type:cc.Prefab
        },
        grass_1:{
            default:null,
            type:cc.Prefab
        },
        grass_2:{
            default:null,
            type:cc.Prefab
        },
        grass_3:{
            default:null,
            type:cc.Prefab
        },
        grass_4:{
            default:null,
            type:cc.Prefab
        },
        dot_land:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.show();

        window.MeadowMouseDown = false;
        this.onDrag();
    },

    update(dt){
        this.move_meadow();
    },

    start () {

    },

    show(){
        this.land_coord(window.default_data.land);
        for(let i = 0; i < this.node.children.length;i++){
            if(this.node.children[i]){
                this.node.children[i].destroy();
            }
        }
        this.sort_object_by_y_coord();
        this.spawn_many_object();
    },

    MoveMeadow(delta_x,delta_y){
        let result = {x:true,y:true};
        this.node.x += delta_x;
        if(Math.abs(this.node.x) > (((this.node.width/2)* this.node.scaleX) - this.node.parent.width/2)){
            if(this.node.x < 0){
                this.node.x = (((this.node.width/2) * this.node.scaleX) - this.node.parent.width/2) * -1;
                result.x = false;
            }else{
                this.node.x = (((this.node.width/2) * this.node.scaleX)- this.node.parent.width/2) * 1;
                result.x = false;
            }
        }
        
        this.node.y += delta_y;
        if(Math.abs(this.node.y) > (((this.node.height/2) * this.node.scaleY) - this.node.parent.height/2)){
            if(this.node.y < 0){
                this.node.y = (((this.node.height/2)* this.node.scaleY) - this.node.parent.height/2) * -1;
                result.y = false;
            }else{
                this.node.y = (((this.node.height/2)* this.node.scaleY) - this.node.parent.height/2) * 1;
                result.y = false;
            }
        }
        return result;
    },

    onDrag(){
        let parentWidth = this.node.parent.width;
        let parentHeight = this.node.parent.height;

        this.node.on("touchstart", (event) => {
            window.MeadowMouseDown = true;
        },this)

        this.node.on("touchmove", (event) => {
            this.delta = event.getDelta();
            this.mouse_position = event.getLocation();
            if(!window.MeadowMouseDown) return;
            window.MeadowOnDrag = true;

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
            window.MeadowMouseDown = false;
            window.MeadowOnDrag = false;
        },this)
    },
    
    spawnNewObject: function(data,import_data){
        let newObject = cc.instantiate(this.get_object_by_macros(data.name));
        newObject._components[1].ownData = data;
        if(import_data){
            newObject._components[1].import_data = import_data;
        }
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(data.coord.x, data.coord.y));
        return newObject.uuid;
    },

    spawnNewObject_with_macros_and_pos: function(prefab,x,y,import_data = undefined,func = undefined){
        let newObject = cc.instantiate(this.get_object_by_macros(prefab));
        if(import_data != undefined){
            newObject._components[1].import_data = import_data;
        }
        if(func != undefined){
            func(newObject);
        }
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(x, y));
    },

    spawn_many_square:function(NodeXPos,NodeYPos,first,second,cols,rows,id_,last_child){
        let last_object_index = this.node.children.length - 1;
        if(this.last_index_for_square == undefined){
            this.last_index_for_square = this.node.children.length;
        }

        this.cols_and_rows_square = [cols,rows, first,second];
        if(last_child){
            NodeXPos = this.node.children[this.node.children.length  - (cols*rows + 2)].x;
            NodeYPos = this.node.children[this.node.children.length  - (cols*rows + 2)].y;
        }
        
        let result = false;
        let result_last = undefined;

        let squareIndex = this.last_index_for_square;

        // if(this.last_index_for_square != undefined){
        //     console.log(this.node.children[this.last_index_for_square]);
        // }

        for(let y = 0;y < rows;y++){
            let m_first = first;
            let m_second = second;
            for(let x = 0;x < cols; x++){
                let colorSquare = "redSquare";

                for(let i = 0;i < this.land_square_coord.length;i++){
                    let x = NodeXPos + m_first;
                    let y = NodeYPos + m_second;
                    let break_ = false;
                    for(let j = 0;j < this.land_square_coord[i].length;j++){
                        if(Math.abs(x - this.land_square_coord[i][j][0]) <= 7.5){
                            if(y <= this.land_square_coord[i][j][1] && y >= this.land_square_coord[i][j][2]){
                                colorSquare = "greenSquare";
                                result = true;
                                break_ = true;
                                break;
                            }
                        }
                    }
                    if(break_)break;
                }

                if(colorSquare == "greenSquare"){
                    for(let i = 0;i < window.default_data.object.length;i++)
                    {
                        if(id_ == window.default_data.object[i].ID){
                            continue;
                        }else{
                            for(let j = 0;j < window.default_data.object[i].square_data.length;j++){
                                let dist = cc.v3(window.default_data.object[i].square_data[j][0],window.default_data.object[i].square_data[j][1]).sub(cc.v3(NodeXPos + m_first,NodeYPos + m_second)).mag();
                                if(dist <= 15){
                                    colorSquare = "redSquare";
                                }
                            }
                        }
                    }
                }

                if(colorSquare == "redSquare"){
                    result = false;
                }else if(colorSquare == "greenSquare"){
                    result = true;
                }
                if(result == false && result_last == undefined){
                    result_last = false;
                }

                if(this.node.children[last_object_index]._name != this.whiteSquare.data._name){
                    let newObject = cc.instantiate(this.whiteSquare);
    
                    if(colorSquare == "greenSquare"){
                        newObject.color = new cc.Color(20,200,20);
                    }else if(colorSquare == "redSquare"){
                        newObject.color = new cc.Color(200,20,20);
                    }else{
                        console.error("unknown color : " + colorSquare);
                    }
    
                    this.node.addChild(newObject);
                    newObject.setPosition(cc.v2(NodeXPos + m_first, NodeYPos + m_second));
                }else if(this.node.children[last_object_index]._name == this.whiteSquare.data._name){
                    if(colorSquare == "greenSquare"){
                        this.node.children[squareIndex].color = new cc.Color(20,200,20);
                    }else if(colorSquare == "redSquare"){
                        this.node.children[squareIndex].color = new cc.Color(200,20,20);
                    }else{
                        this.node.children[squareIndex].error("unknown color : " + colorSquare);
                    }
                    this.node.children[squareIndex].setPosition(cc.v2(NodeXPos + m_first, NodeYPos + m_second));

                }else{
                    console.error("problem move object");
                }

                m_first += 15;
                m_second += 10;
                squareIndex++;
            }
            first += 15;
            second -= 10;
        }
        if(result_last != undefined){
            result = result_last;
        }
        return result;
    },

    destroy_last_child:function(total = 1){
        for(let i = 0;i < total;i++){
            this.node.children.pop();
        }
    },

    destroy_many_square:function(){
        for(let i = this.cols_and_rows_square[0] * this.cols_and_rows_square[1];i > 0;i--)
        {
            this.node.children.pop();
        }
        this.last_index_for_square = undefined;
    },

    changeGreenAndRedPosition: function(NodeXPos,NodeYPos){
        let first =  this.cols_and_rows_square[2];
        let second = this.cols_and_rows_square[3];

        let square = 1;
        for(let y = 0;y < this.cols_and_rows_square[1];y++){
            let m_first = first;
            let m_second = second;
            for(let x = 0;x < this.cols_and_rows_square[0]; x++){
                this.node.children[this.node.children.length - square].setPosition(NodeXPos + m_first,NodeYPos + m_second);
                m_first += 15;
                m_second += 10;
                square += 1;
            }
            first += 15;
            second -= 10;
        }
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
            case "fertilizer_spreader":
                return this.fertilizer_spreader_prefab;
            case "home_1":
                return this.home_1_prefab;
            case "whiteSquare":
                return this.whiteSquare;
            case "redSquare":
                return this.redSquare;
            case "order_board":
                return this.order_board_prefab;
            case "sales_desk":
                return this.sales_desk_prefab;
            case "dot_land":
                return this.dot_land;
            //additional
            case "grass_1":
                return this.grass_1;
            case "grass_2":
                return this.grass_2;
            case "grass_3":
                return this.grass_3;
            case "grass_4":
                return this.grass_4;
            //machine
            case "grinding_machine":
                return this.grinding_machine_prefab;
            //animal
            case "chicken_area":
                return this.chicken_area_prefab;
            default:
                console.error("unknown object: "+ name);
        }
    },


    spawn_many_object:function(){
        for(let i = 0;i < this.node.children.length; i++){
            this.node.children[i].destroy();
        }

        let last_index = 0;
        for(let i = 0;i < window.default_data.object.length;i++){
            window.default_data.object[i].ID = i;
            last_index = i;
            this.spawnNewObject(window.default_data.object[i]);
        }
        
        for(let i = 0;i < window.default_data.object.length;i++){
            last_index += 1;
            let stuff_identity
            for(let k = 0;k < window.stuff_identity.length;k++){
                if(window.stuff_identity[k].object_name == window.default_data.object[i].name){
                    stuff_identity = window.stuff_identity[k];
                    break;
                }
            }
            let newObject = cc.instantiate(this.t_o);
            newObject._components[1].stuff_identity = stuff_identity;
            newObject._components[1].object_data = window.default_data.object[i];
            newObject._components[1].t_o_id = last_index;
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
                        window.object_identity[j].t_o.x + window.default_data.object[i].coord.x,
                        window.object_identity[j].t_o.y + window.default_data.object[i].coord.y
                    ));
                }
            }
            this.node.addChild(newObject);
        }

        for(let i = 0;i < this.vacant_land.length;i++){

            for(let j = 0;j < this.land_object.json[this.vacant_land[i].index].object.length;j++){
                let index = this.vacant_land[i].index;
                let coord = this.vacant_land[i].coord;
                let m_object = this.get_object_by_macros(this.land_object.json[index].object[j].object_name);
                let newObject = cc.instantiate(m_object);
                newObject.setPosition(cc.v2(coord[0] + this.land_object.json[index].object[j].coord[0],coord[1] + this.land_object.json[index].object[j].coord[1]));
                this.node.addChild(newObject);
            }
            
            this.spawnNewObject_with_macros_and_pos("dot_land",this.vacant_land[i].coord[0],this.vacant_land[i].coord[1],{},object=>{
                let real_height = this.vacant_land[i].height/2;
                let fake_height = Math.sqrt((real_height * real_height) + (real_height * real_height));
                object.angle = 45;
                object.width = fake_height;
                object.height = fake_height;
                object.opacity = 1;

                object.on("touchend",event=>{
                    if(window.MeadowOnDrag || window.action_active)return;
                    window.action_active = true;
                    this.set_move_meadow(-this.vacant_land[i].coord[0] * this.node.scaleX,-this.vacant_land[i].coord[1] * this.node.scaleY)
                    land_identity_box = this.node.parent._components[2].land_identity_box;
                    for(let c_i = 0; c_i < this.node.children.length;c_i++){
                        if(this.node.children[c_i].name == this.redSquare.data.name){
                            this.node.children[c_i].destroy();
                            break;
                        }
                    }

                    this.spawnNewObject_with_macros_and_pos("redSquare",this.vacant_land[i].coord[0],this.vacant_land[i].coord[1],{},redSquare=>{
                        redSquare.width = this.vacant_land[i].width;
                        redSquare.height = this.vacant_land[i].height;
                    })

                    parent_height = this.node.parent.height;
                    this.node.parent._components[2].spawnNewObject("land_identity_box",0,(-parent_height/2) + (land_identity_box.data.height/2),undefined,object=>{
                        object._components[1].land_object_data = this.land_object.json[this.vacant_land[i].index];
                        object._components[1].redSquare_name = this.redSquare.data.name;
                        object._components[1].index_land = this.vacant_land[i].index;
                    });
                    
                },this)
            });

        }
    },

    sort_object_by_y_coord:function(){
        for(let i = 0;i < window.default_data.object.length;i++){
            let first = 0;
            let second = 0;
            let rows = 0;
            let cols = 0;
            for(let j = 0;j < window.object_identity.length;j++){
                if(window.object_identity[j].name == window.default_data.object[i].name){
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
                    vector_will_be_save.push([window.default_data.object[i].coord.x + m_first,window.default_data.object[i].coord.y + m_second]);
                    m_first += 15;
                    m_second += 10;
                }
                first += 15;
                second -= 10;
            }
            window.default_data.object[i].square_data = vector_will_be_save;
        }
        window.default_data.object.sort((a,b)=>{
            return b.coord.y - a.coord.y;
        });
    },
    auto_move_meadow:function(x,y){
        this.node.x = -x * 2;
        this.node.y = -y * 2;
    },
    land_coord:function(limit){
        let land_width = 30 * 16;
        let land_height = 20 * 16;
        let land = [[0,0],[0 + land_width/2, -land_height/2],[0 - land_width/2, -land_height/2]/*,[0, -land_height]*/];
        this.our_land = [];
        this.vacant_land = [];

        for(let i = 0; i < land.length;i++){
            let have_ = false;
            for(let j = 0;j < limit.length;j++){
                if(limit[j] == i){
                    have_ = true;
                    break;
                }
            }

            if(have_ == true){
                this.our_land.push(land[i]);
            }else{
                this.vacant_land.push({
                    index:i,
                    coord:land[i],
                    width:land_width,
                    height:land_height,
                });
            }
        }

        this.land_square_coord = [];
        for(let i = 0; i < this.our_land.length;i++){
            let first = -225;
            let second = 0;
            let rows = 16;
            let cols = 16;
            let land_square_coord = [];
            for(let y = 0;y < rows;y++){
                let m_first = first;
                let m_second = second;
                for(let x = 0;x < cols; x++){
                    land_square_coord.push([this.our_land[i][0] + m_first,this.our_land[i][1] + m_second]);
                    m_first += 15;
                    m_second += 10;
                }
                first += 15;
                second -= 10;
            }
            let land_each_x = [];
            for(let i = 0;i < land_square_coord.length;i++){
                let have_ = false;
                let index_x;
                /* 
                    land_each_x[index][0] = x position
                    land_each_x[index][1] = y biggest
                    land_each_x[index][2] = y smallest
                */
                for(let j = 0;j < land_each_x.length;j++){
                    if(land_square_coord[i][0] == land_each_x[j][0]){
                        have_ = true;
                        index_x = j;
                        break;
                    }
                }
                if(!have_){
                    land_each_x.push([
                        land_square_coord[i][0],
                        land_square_coord[i][1],
                        land_square_coord[i][1]
                    ])
                }else if(have_){
                    if(land_square_coord[i][1] > land_each_x[index_x][1]){
                        land_each_x[index_x][1] = land_square_coord[i][1];
                    }
                    if(land_square_coord[i][1] < land_each_x[index_x][2]){
                        land_each_x[index_x][2] = land_square_coord[i][1];
                    }
                }
            }
            this.land_square_coord.push(land_each_x);
        }
    },

    ObjectOnMove:function(mouseX,mouseY){

        let c_k_s_b = {
            x:(mouseX - mouseX%30),
            y:(mouseY - mouseY%20),
        }

        let all_coord_around = [
            [c_k_s_b.x,c_k_s_b.y],
            [c_k_s_b.x + 30,c_k_s_b.y],
            [c_k_s_b.x + 15,c_k_s_b.y + 10],
            [c_k_s_b.x + 15,c_k_s_b.y - 10],
            [c_k_s_b.x,c_k_s_b.y - 20],
            [c_k_s_b.x,c_k_s_b.y + 20],
            [c_k_s_b.x - 15,c_k_s_b.y - 10],
            [c_k_s_b.x - 15,c_k_s_b.y + 10],
            [c_k_s_b.x - 30,c_k_s_b.y],
        ]

        let coord;
        let terdekat;

        for(let i = 0; i < all_coord_around.length;i++){
            if(!coord && !terdekat){
                terdekat = cc.v2(mouseX,mouseY).sub(cc.v2(all_coord_around[i][0],all_coord_around[i][1])).mag();   
                coord = {
                    x:all_coord_around[i][0],
                    y:all_coord_around[i][1]
                }
            }else{
                jarak = cc.v2(mouseX,mouseY).sub(cc.v2(all_coord_around[i][0],all_coord_around[i][1])).mag();   
                if(jarak < terdekat){
                    terdekat = jarak;
                    coord = {
                        x:all_coord_around[i][0],
                        y:all_coord_around[i][1]
                    }
                }
            }
        }

        return coord;
    },


    set_move_meadow:function(x,y){
        this.meadow_auto_move = true;
        this.mn_pos = [x,y];
        this.m_pos = [this.node.x,this.node.y];
        this.m_mn_percent = 0;
    },
    move_meadow:function(){
        if(this.meadow_auto_move == true){
            this.node.x = this.m_pos[0] + ((this.mn_pos[0] - this.m_pos[0]) * this.m_mn_percent);
            this.node.y = this.m_pos[1] + ((this.mn_pos[1] - this.m_pos[1]) * this.m_mn_percent);
            this.m_mn_percent += 0.1;
            if(this.m_mn_percent >= 1){
                this.meadow_auto_move = false;
            }
        }
    },
});
