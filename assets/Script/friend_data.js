// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        friend_name:cc.Label,
        visit_button:{
            default:null,
            type:cc.Node
        },
        profile_friend_box:{
            default:null,
            type:cc.Node
        },
        friendship_level:{
            default:null,
            type:cc.Node
        },
        next_friend:{
            default:null,
            type:cc.Node
        },
        prev_friend:{
            default:null,
            type:cc.Node
        },
        close_button:{
            default:null,
            type:cc.Node
        },
        face_sandika:{
            default:null,
            type:cc.Prefab
        },
        face_moeklis:{
            default:null,
            type:cc.Prefab
        },
        face_riza_isk:{
            default:null,
            type:cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.friend_show_index = 0;
        this.visit = true;
        this.friend_data();
        this.setFriend();
        this.Next_or_prev_on_touch();
        this.visit_button_onClick();
        this.close_onClick();
        this.onDrag();
    },

    Next_or_prev_on_touch:function(){
        this.next_friend.on("touchend",event=>{
            this.friend_show_index += 1;
            if(this.friend_show_index >= this.all_friends.length) this.friend_show_index = 0;
            this.setFriend();
        },this)
        this.prev_friend.on("touchend",event=>{
            this.friend_show_index -= 1;
            if(this.friend_show_index < 0) this.friend_show_index = this.all_friends.length-1;
            this.setFriend();
        },this)
    },

    setFriend:function(){
        let data;
        for(let i = 0;i < window.default_data.friend_data.length;i++){
            if(window.default_data.friend_data[i].farm_name == this.all_friends[this.friend_show_index].identity.farm_name){
                data = window.default_data.friend_data[i];
                this.all_friends[this.friend_show_index].index = i;
            }
        }
        this.friend_name.string = this.all_friends[this.friend_show_index].identity.farm_name;
        this.friendship_level.children[0]._components[0].string = Math.round(data.friendship_level * 100) + "%";
        if(data.friendship_level <= 0.25){
            this.friendship_level.children[1]._components[0].string = "Acquaintances";
            this.friendship_level.children[1].color = new cc.Color(0,0,0);
        }else if(data.friendship_level > 0.25 && data.friendship_level <= 0.75){
            this.friendship_level.children[1]._components[0].string = "Friend";
            this.friendship_level.children[1].color = new cc.Color(180,180,0);
        }else if(data.friendship_level > 0.75 && data.friendship_level <= 1){
            this.friendship_level.children[1]._components[0].string = "Best Friend";
            this.friendship_level.children[1].color = new cc.Color(0,200,0);
        }
        if(this.profile_friend_box.children.length >= 1){
            for(let i = this.profile_friend_box.children.length-1;i >= 0;i--)this.profile_friend_box.children[i].destroy();
        }
        if(data.available_level <= window.our_level){
            this.visit = true;
            this.visit_button.color = new cc.Color(255,255,255);
            this.visit_button.children[0]._components[0].string = "Visit";
        }else{
            this.visit = false;
            this.visit_button.color = new cc.Color(128,128,128);
            this.visit_button.children[0]._components[0].string = "Lv."+data.available_level;
        }
        let our_prefab = this.get_face_prefab(this.all_friends[this.friend_show_index].identity.farm_name);
        let newObject = cc.instantiate(our_prefab);
        this.profile_friend_box.addChild(newObject);
        newObject.setPosition(cc.v2(0,0));
    },

    get_face_prefab:function(name){
        switch (name) {
            case "sandika":
                return this.face_sandika;
            case "moeklis":
                return this.face_moeklis;
            case "riza_isk":
                return this.face_riza_isk;
            default:
                break;
        }
    },

    visit_button_onClick:function(){
        this.visit_button.on("touchend",event=>{
            if(!this.visit)return;
            window.friend_meadow_load = this.all_friends[this.friend_show_index];
            window.action_active = false;
            this.node.parent._components[2].achievement_request("visit a friends farm");
            cc.director.loadScene('Friend');
        },this)
    },

    close_onClick:function(){
        this.close_button.on("touchend",event=>{
            this.node.destroy();
            window.action_active = false;
        },this)
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

    friend_data:function(){
        this.all_friends = 
        [
            {
                identity:{
                    farm_name:"sandika",
                },
                object:[
                    {
                        name:"home_1",coord:{x:-218,y:1},ID:0,square_data:[]
                    },{
                        name:"lemon_tree",coord:{x:112,y:51},ID:1,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"apple_tree",coord:{x:52,y:51},ID:2,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"forest_tree",coord:{x:142,y:31},ID:3,square_data:[]
                    },{
                        name:"apple_tree",coord:{x:22,y:31},ID:4,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:82,y:31},ID:5,plant:"tomato",time_start:0,square_data:[]
                    },{
                        name:"barn",coord:{x:-83,y:21},ID:6,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:112,y:11},ID:7,plant:"none",time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:52,y:11},ID:8,plant:"wheat",time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:82,y:-9},ID:9,plant:"tomato",time_start:0,square_data:[]
                    },{
                        name:"chicken_area",coord:{x:22,y:-29},ID:10,already_fed:true,time_start:0,square_data:[]
                    },{
                        name:"order_board",coord:{x:22,y:-209},ID:11,square_data:[]
                    },{
                        name:"grinding_machine",coord:{x:142,y:-209},ID:12,process_data:{
                            start_time:0,queue:["flour","flour",null]
                        },square_data:[]
                    }
                ],
            },
            {
                identity:{
                    farm_name:"moeklis",
                },
                object:[
                    {
                        name:"home_1",coord:{x:-218,y:1},ID:0,square_data:[]
                    },{
                        name:"lemon_tree",coord:{x:112,y:51},ID:1,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"apple_tree",coord:{x:52,y:51},ID:2,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"forest_tree",coord:{x:142,y:31},ID:3,square_data:[]
                    },{
                        name:"apple_tree",coord:{x:22,y:31},ID:4,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:82,y:31},ID:5,plant:"tomato",time_start:0,square_data:[]
                    },{
                        name:"barn",coord:{x:-83,y:21},ID:6,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:112,y:11},ID:7,plant:"none",time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:52,y:11},ID:8,plant:"wheat",time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:82,y:-9},ID:9,plant:"tomato",time_start:0,square_data:[]
                    },{
                        name:"chicken_area",coord:{x:22,y:-29},ID:10,already_fed:true,time_start:0,square_data:[]
                    },{
                        name:"order_board",coord:{x:22,y:-209},ID:11,square_data:[]
                    },{
                        name:"grinding_machine",coord:{x:142,y:-209},ID:12,process_data:{
                            start_time:0,queue:["flour","flour",null]
                        },square_data:[]
                    }
                ],
            },
            {
                identity:{
                    farm_name:"riza_isk",
                },
                object:[
                    {
                        name:"home_1",coord:{x:-218,y:1},ID:0,square_data:[]
                    },{
                        name:"lemon_tree",coord:{x:112,y:51},ID:1,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"apple_tree",coord:{x:52,y:51},ID:2,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"forest_tree",coord:{x:142,y:31},ID:3,square_data:[]
                    },{
                        name:"apple_tree",coord:{x:22,y:31},ID:4,already_watered:true,time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:82,y:31},ID:5,plant:"tomato",time_start:0,square_data:[]
                    },{
                        name:"barn",coord:{x:-83,y:21},ID:6,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:112,y:11},ID:7,plant:"none",time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:52,y:11},ID:8,plant:"wheat",time_start:0,square_data:[]
                    },{
                        name:"planting_slot",coord:{x:82,y:-9},ID:9,plant:"tomato",time_start:0,square_data:[]
                    },{
                        name:"chicken_area",coord:{x:22,y:-29},ID:10,already_fed:true,time_start:0,square_data:[]
                    },{
                        name:"order_board",coord:{x:22,y:-209},ID:11,square_data:[]
                    },{
                        name:"grinding_machine",coord:{x:142,y:-209},ID:12,process_data:{
                            start_time:0,queue:["flour","flour",null]
                        },square_data:[]
                    }
                ],
            }
        ]
    },

    start () {

    },

    // update (dt) {},
});
