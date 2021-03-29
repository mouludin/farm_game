cc.Class({
    extends: cc.Component,

    properties: {
        yes_move:{
            default:null,
            type:cc.Prefab
        },
        no_move:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.object_data;
        this.object_identity;
        this.index_object;

        this.time_hold = 20;
        this.mouseX = this.node.parent.children[this.object_data.ID].x;
        this.mouseY = this.node.parent.children[this.object_data.ID].y;
        this.num_of_square = {cols:this.object_identity.plot_of_move_system.cols,rows:this.object_identity.plot_of_move_system.rows};
        this.mouseDown = false;
        this.moveObject = false;

        this.onMove();
        this.get_index_of_object();

        this.mouseDownLocation = {x:0,y:0}
    },
    
    start () {

    },
    
    update (dt) {
        this.onHold();
    },

    get_index_of_object:function(){
        for(let i = 0;i < this.node.parent.children.length;i++){
            if(this.node.parent.children[i]._components[1] != undefined){
                if(this.node.parent.children[i]._components[1].ownData != undefined){
                    if(this.node.parent.children[i]._components[1].ownData.ID == this.object_data.ID){
                        this.index_object = i;
                    }
                }
            }
        }
    },

    onMove:function(){
        this.node.on("touchstart",(event)=>{
            if(window.action_active)return;
            window.MeadowMouseDown = false;
            this.mouseDown = true;
            this.mouseX = this.node.parent.children[this.object_data.ID].x;
            this.mouseY = this.node.parent.children[this.object_data.ID].y;
            this.mouseDownLocation.x = event.getLocation().x;
            this.mouseDownLocation.y = event.getLocation().y;
        },this)

        this.node.on("touchend",(event)=>{
            if(this.time_hold > 0){
                try {
                    if(window.MeadowOnDrag)return;
                    this.node.parent.children[this.object_data.ID]._components[1].onTouch();
                } catch (error) {}
                this.mouseDown = false;
                this.time_hold = 20;
                this.mouseX = 0;
                this.mouseY = 0;
                this.mouseDownLocation.x = 0;
                this.mouseDownLocation.y = 0;
                return;
            }
        },this)

        this.node.on("touchmove",(event)=>{
            if(!this.mouseDown) return;
            if(this.time_hold > 0){
                this.mouseDown = false;
                this.time_hold = 20;
                return;
            }
            
            this.time_hold = -1;
            this.mouseDownLocation.x = event.getLocation().x;
            this.mouseDownLocation.y = event.getLocation().y;
            this.mouseX += event.getDelta().x / this.node.parent.scaleX;
            this.mouseY += event.getDelta().y / this.node.parent.scaleY;

            this.node.parent.children[this.object_data.ID].x = this.node.parent._components[1].ObjectOnMove(this.mouseX,this.mouseY).x;
            this.node.parent.children[this.object_data.ID].y = this.node.parent._components[1].ObjectOnMove(this.mouseX,this.mouseY).y;
            
            this.node.x = this.node.parent.children[this.object_data.ID].x + this.object_identity.t_o.x;
            this.node.y = this.node.parent.children[this.object_data.ID].y + this.object_identity.t_o.y;

            this.node.parent.children[this.node.parent.children.length - (this.num_of_square.cols * this.num_of_square.rows + 1)].setPosition(cc.v2(this.node.parent.children[this.object_data.ID].x,this.node.parent.children[this.object_data.ID].y));
            
            this.resultSquareBox = this.node.parent._components[1].spawn_many_square(
                this.node.parent.children[this.object_data.ID].x,
                this.node.parent.children[this.object_data.ID].y,
                this.object_identity.plot_of_move_system.start_x,
                this.object_identity.plot_of_move_system.start_y,
                this.num_of_square.cols,
                this.num_of_square.rows,
                this.object_data.ID
                );
        },this)
    },

    onHold:function(){
        if(this.mouseDown){
            this.time_hold -= 1;
            if(this.time_hold <= 0){
                if(this.time_hold < 0){
                    this.time_hold = -1;
                }
                if(this.time_hold == 0)
                {
                    let uuid = this.node.parent._components[1].spawnNewObject(this.object_data);
                    let index_;
                    for(let i = 0;i < this.node.parent.children.length;i++){
                        if(this.node.parent.children[i].uuid == uuid){
                            index_ = i;
                            break;
                        }
                    }
                    this.resultSquareBox = this.node.parent._components[1].spawn_many_square(
                        this.object_data.coord.x,
                        this.object_data.coord.y,
                        this.object_identity.plot_of_move_system.start_x,
                        this.object_identity.plot_of_move_system.start_y,
                        this.num_of_square.cols,
                        this.num_of_square.rows,
                        this.object_data.ID);
                    this.spawn_yes_and_no(this.object_data.coord.x,this.object_data.coord.y);

                    if(index_){
                        this.node.parent.children[index_].on("touchmove",(event)=>{
                            if(!this.mouseDown) return;
                            if(this.time_hold > 0){
                                this.mouseDown = false;
                                this.time_hold = 20;
                                return;
                            }
                            
                            this.time_hold = -1;
                            this.mouseDownLocation.x = event.getLocation().x;
                            this.mouseDownLocation.y = event.getLocation().y;
                            this.mouseX += event.getDelta().x / this.node.parent.scaleX;
                            this.mouseY += event.getDelta().y / this.node.parent.scaleY;
                
                            this.node.parent.children[this.object_data.ID].x = this.node.parent._components[1].ObjectOnMove(this.mouseX,this.mouseY).x;
                            this.node.parent.children[this.object_data.ID].y = this.node.parent._components[1].ObjectOnMove(this.mouseX,this.mouseY).y;
                            
                            this.node.x = this.node.parent.children[this.object_data.ID].x + this.object_identity.t_o.x;
                            this.node.y = this.node.parent.children[this.object_data.ID].y + this.object_identity.t_o.y;
                
                            this.node.parent.children[index_].setPosition(cc.v2(this.node.parent.children[this.object_data.ID].x,this.node.parent.children[this.object_data.ID].y));
                            
                            this.resultSquareBox = this.node.parent._components[1].spawn_many_square(
                                this.node.parent.children[this.object_data.ID].x,
                                this.node.parent.children[this.object_data.ID].y,
                                this.object_identity.plot_of_move_system.start_x,
                                this.object_identity.plot_of_move_system.start_y,
                                this.num_of_square.cols,
                                this.num_of_square.rows,
                                this.object_data.ID
                                );
                        },this)
                    }

                    window.action_active = true;
                }
                this.autoMove();
            }
        }
    },

    autoMove(){
        let moveX = 0;
        let moveY = 0;
        let move_active = false;
        if(this.mouseDownLocation.x > this.node.parent.parent.width * (7/8)){
            moveX = 5;
            move_active = true;
        } else if(this.mouseDownLocation.x < this.node.parent.parent.width * (1/8)){
            moveX = -5;
            move_active = true;
        }
        
        if(this.mouseDownLocation.y > this.node.parent.parent.height * (7/8)){
            moveY = 5;
            move_active = true;
        } else if(this.mouseDownLocation.y < this.node.parent.parent.height * (1/8)){
            moveY = -5;
            move_active = true;
        }

        if(move_active){

            let moveX_Y = this.node.parent._components[1].MoveMeadow(-moveX,-moveY)
            
            if(moveX_Y.x == false) moveX = 0;
            if(moveX_Y.y == false) moveY = 0;
            this.mouseX += moveX / this.node.parent.scaleX;
            this.mouseY += moveY / this.node.parent.scaleY;
            
            this.node.parent.children[this.object_data.ID].x = this.node.parent._components[1].ObjectOnMove(this.mouseX,this.mouseY).x;
            this.node.parent.children[this.object_data.ID].y = this.node.parent._components[1].ObjectOnMove(this.mouseX,this.mouseY).y;
            
            this.node.x = this.node.parent.children[this.object_data.ID].x + this.object_identity.t_o.x;
            this.node.y = this.node.parent.children[this.object_data.ID].y + this.object_identity.t_o.y;

            this.node.parent.children[this.node.parent.children.length - (this.num_of_square.cols * this.num_of_square.rows + 1)].setPosition(cc.v2(this.node.parent.children[this.object_data.ID].x,this.node.parent.children[this.object_data.ID].y));
            
            this.resultSquareBox = this.node.parent._components[1].spawn_many_square(
                this.node.parent.children[this.object_data.ID].x,
                this.node.parent.children[this.object_data.ID].y,
                this.object_identity.plot_of_move_system.start_x,
                this.object_identity.plot_of_move_system.start_y,
                this.num_of_square.cols,
                this.num_of_square.rows,
                this.object_data.ID
                );
        }


        let add_y = -this.node.parent.children[this.object_data.ID].height/2;

        let x_yes = (this.node.parent.x + (this.node.parent.children[this.object_data.ID].x + this.yes_move.data.width) * this.node.parent.scaleX);
        let y_yes = (this.node.parent.y + (this.node.parent.children[this.object_data.ID].y + add_y) * this.node.parent.scaleY);
        let x_no = (this.node.parent.x + (this.node.parent.children[this.object_data.ID].x - this.yes_move.data.width) * this.node.parent.scaleX);
        let y_no = (this.node.parent.y + (this.node.parent.children[this.object_data.ID].y + add_y) * this.node.parent.scaleY);
        this.node.parent.parent.children[this.getGameChildrenIndexByUuid(this.YesMoveUuid)].setPosition(cc.v2(x_yes,y_yes));
        this.node.parent.parent.children[this.getGameChildrenIndexByUuid(this.NoMoveUuid)].setPosition(cc.v2(x_no,y_no));
    },

    spawn_yes_and_no(x,y){
        let add_y = -this.node.parent.children[this.object_data.ID].height/2;
        let YesMove = cc.instantiate(this.yes_move);
        YesMove.scaleX = this.node.parent.scaleX;
        YesMove.scaleY = this.node.parent.scaleY;
        this.node.parent.parent.addChild(YesMove);

        let x_yes = (this.node.parent.x + ((x + YesMove.width) * this.node.parent.scaleX));
        let y_yes = (this.node.parent.y + ((y + add_y) * this.node.parent.scaleX));
        YesMove.setPosition(cc.v2(x_yes,y_yes));
        this.YesMoveUuid = YesMove.uuid;
        
        let NoMove = cc.instantiate(this.no_move);
        NoMove.scaleX = this.node.parent.scaleX;
        NoMove.scaleY = this.node.parent.scaleY;
        this.node.parent.parent.addChild(NoMove);

        let x_no = (this.node.parent.x + ((x - YesMove.width) * this.node.parent.scaleX));
        let y_no = (this.node.parent.y + ((y + add_y)  * this.node.parent.scaleY));
        NoMove.setPosition(cc.v2(x_no,y_no));
        this.NoMoveUuid = NoMove.uuid;

        NoMove.on("touchend",(event)=>{
            window.action_active = false;

            NoMove.destroy();
            YesMove.destroy();
            this.node.parent._components[1].spawn_many_object();
        },this)
        
        YesMove.on("touchend",(event)=>{
            if(this.resultSquareBox == true){
                for(let i = 0;i < window.default_data.object.length;i++){
                    if(window.default_data.object[i].ID == this.object_data.ID){
                        window.default_data.object[i].coord.x = this.node.x - this.object_identity.t_o.x;
                        window.default_data.object[i].coord.y = this.node.y - this.object_identity.t_o.y;
                        window.default_data.object[i].square_data = [];
                        window.action_active = false;
    
                        let first = this.object_identity.plot_of_move_system.start_x;
                        let second = this.object_identity.plot_of_move_system.start_y;
                        for(let y = 0;y < this.num_of_square.rows;y++){
                            let m_first = first;
                            let m_second = second;
                            for(let x = 0;x < this.num_of_square.cols; x++){
                                window.default_data.object[i].square_data.push([window.default_data.object[i].coord.x + m_first,window.default_data.object[i].coord.y + m_second]);
                                m_first += 15;
                                m_second += 10;
                            }
                            first += 15;
                            second -= 10;
                        }

                        NoMove.destroy();
                        YesMove.destroy();
                        this.node.parent._components[1].sort_object_by_y_coord();
                        this.node.parent._components[1].spawn_many_object();
                        break;
                    }
                }
            }else{
                this.node.parent.parent._components[2].show_alert("tempatkan di tempat yang kosong",0,0,new cc.Color(200,0,0));
            }
        },this)
    },
    getGameChildrenIndexByUuid(uuid){
        let result;
        for(let i = 0;i < this.node.parent.children.length;i++){
            if(this.node.parent.parent.children[i].uuid == uuid){
                result = i;
                break;
            }
        }
        return result;
    }
});