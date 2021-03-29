// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        close:{
            default:null,
            type:cc.Node
        },
        text:cc.Label,
        money_label:cc.Label,
        level_label:cc.Label,
        money_check_box:{
            default:null,
            type:cc.Node
        },
        level_check_box:{
            default:null,
            type:cc.Node
        },
        button:{
            default:null,
            type:cc.Node
        },
        yes:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.action_active = true;
        this.text.string = this.land_object_data.text;
        this.money_label.string = this.land_object_data.price;
        this.level_label.string = this.land_object_data.available_level;
        this.money_label.node.x = -180 + (this.money_label.node.width/2);
        this.level_label.node.x = -180 + (this.level_label.node.width/2);

        if(window.default_data.identity.money >= this.land_object_data.price) 
        {
            let newObject = cc.instantiate(this.yes);
            this.money_check_box.addChild(newObject)
        };
        if(window.our_level >= this.land_object_data.available_level){ 
            let newObject = cc.instantiate(this.yes);
            this.level_check_box.addChild(newObject)
        };

        this.close.on("touchend",event=>{
            for(let i = 0;i < this.node.parent.children[window.m_i].children.length;i++){
                if(this.node.parent.children[window.m_i].children[i].name == this.redSquare_name){
                    this.node.parent.children[window.m_i].children[i].destroy();
                    break;
                }
            };
            window.action_active = false;
            this.node.destroy();
        },this)

        this.button.on("touchstart",event=>{
            this.button.color = new cc.Color(100,100,100);
        },this)

        this.button.on("touchend",event=>{
            this.button.color = new cc.Color(255,255,255);
            if(window.default_data.identity.money >= this.land_object_data.price && window.our_level >= this.land_object_data.available_level){
                window.default_data.land.push(this.index_land);
                this.node.parent._components[2].addMoney(-this.land_object_data.price);
                this.node.parent.children[window.m_i]._components[1].show();
                window.action_active = false;
                this.node.destroy();
            }else{
                this.node.parent._components[2].show_alert("syarat tidak terpenuhi!",0,0,new cc.Color(200,50,50));
            }
        },this)
    },

    start () {

    },

    update (dt) {
        if(window.MeadowOnDrag){
            for(let i = 0;i < this.node.parent.children[window.m_i].children.length;i++){
                if(this.node.parent.children[window.m_i].children[i].name == this.redSquare_name){
                    this.node.parent.children[window.m_i].children[i].destroy();
                    break;
                }
            };
            window.action_active = false;
            this.node.destroy();
        };
    },
});
