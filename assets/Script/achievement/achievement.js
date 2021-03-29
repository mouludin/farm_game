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
            type:cc.Prefab
        },
        border:{
            default:null,
            type:cc.Prefab
        },
        achievement_item:{
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
        this.node.width = this.node.parent.width;
        this.node.height = this.node.parent.height;
        this.spawn_achievement_item();
        this.spawn_border_and_close();
        this.onDrag();
    },

    start(){},

    spawn_achievement_item:function(){
        for(let i = 0; i < window.default_data.achievement.length;i++){
            this.spawnNewObject(this.achievement_item,{
                pos:{
                    x:i * ((this.achievement_item.data.width) + (this.achievement_item.data.width*0.15)),
                    y:0
                }
            },(object)=>{
                object.children[0]._components[0].string = window.default_data.achievement[i].name;
                let done =  window.default_data.achievement[i].done;
                let getAmount;
                for(let j = 0; j < window.default_data.achievement[i].count.length;j++){
                    if(done <= window.default_data.achievement[i].count[j].amount){
                        getAmount = window.default_data.achievement[i].count[j].amount;
                        break;
                    }else{
                        if(window.default_data.achievement[i].count[j].done == false){
                            let newObject = cc.instantiate(this.collect_button);
                            newObject.setPosition(cc.v2(object.children[1].x,object.children[1].y));
                            newObject.children[2]._components[0].string = window.default_data.achievement[i].count[j].gift.money;
                            object.addChild(newObject)
                            newObject.on("touchend",event=>{
                                window.default_data.achievement[i].count[j].done = true;
                                this.node.parent._components[2].addMoney(window.default_data.achievement[i].count[j].gift.money);
                                newObject.destroy();
                            },this)
                        }
                    };
                }

                object.children[1].children[0].width = object.children[1].width * (done/getAmount);
                object.children[1].children[0].x = (-object.children[1].width/2) + (object.children[1].children[0].width/2);
                object.children[1].children[1]._components[0].string = done + "/" + getAmount;

            });
        }
    },

    onDrag:function(){
        this.node.on("touchmove",event=>{
            let delta = event.getDelta();

            if(this.node.children[0].x + delta.x > 0)return;
            if(this.node.children[window.default_data.achievement.length - 1].x + delta.x < 0) return;

            for(let i = 0; i < window.default_data.achievement.length;i++) this.node.children[i].x += delta.x;
        },this)
    },

    spawn_border_and_close:function(){
        this.spawnNewObject(this.border,{
            width:this.node.width,
            height:this.node.height
        })
        this.spawnNewObject(this.close,{
            pos:{
                x:(-this.node.width/2) + (this.close.data.width/2),
                y:(this.node.height/2) - (this.close.data.height/2)
            }
        },(object)=>{
            object.on("touchend",event=>{
                window.action_active = false;
                this.node.destroy()
            },this)
        })
    },

    spawnNewObject:function(prefab,data = undefined,func = undefined){
        let newObject = cc.instantiate(prefab);

        if(data != undefined){
            if(data.width) newObject.width = data.width;
            if(data.height) newObject.height = data.height;
            if(data.scaleX) newObject.scaleX = data.scaleX;
            if(data.scaleY) newObject.scaleY = data.scaleY;
            if(data.pos) newObject.setPosition(cc.v2(data.pos.x,data.pos.y));
        }

        if(func !=  undefined){
            func(newObject)
        }

        this.node.addChild(newObject);
    }

    // update(dt){

    // },
});
