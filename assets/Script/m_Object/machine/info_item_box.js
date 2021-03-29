cc.Class({
    extends: cc.Component,

    properties: {
        item_name_label:{
            default:null,
            type:cc.Label
        },
        production_time:{
            default:null,
            type:cc.Label
        },
        count:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.item_name_label.string = this.item_data_info.name;
        let get_minutes = (this.item_data_info.time_production - (this.item_data_info.time_production % 60)) / 60 ;
        let get_second = Math.floor((this.item_data_info.time_production % 60)); // 60000 == 60 second;
        this.production_time.string = "" + get_minutes + "m " + get_second + "s";
        this.show_item_needed();
    },

    start () {

    },

    show_item_needed:function(){
        let different = (this.node.width * 0.6)/2;
        let long = different * (this.item_data_info.needed.length - 1);
        let start_x = -(long / 2);
        for(let i = 0;i < this.item_data_info.needed.length;i++){
            let y = 21;
            let x = start_x + (i * different);
            this.spawnNewObject(this.node.parent._components[3].get_prefab(this.item_data_info.needed[i].name),x,y);
            let color = new cc.Color(20,200,20);
            let nothing = true;
            let string = "";
            for(let j = 0;j < window.default_data.storage.length;j++){
                if(window.default_data.storage[j].name == this.item_data_info.needed[i].name){
                        if(window.default_data.storage[j].total >= this.item_data_info.needed[i].total){
                            color = new cc.Color(20,200,20);
                        }else{
                            color = new cc.Color(200,20,20);
                        }
                        nothing = false;
                        string = window.default_data.storage[j].total + "/" + this.item_data_info.needed[i].total;
                    break;
                }
            }

            if(nothing == true){
                string = 0 + "/" + this.item_data_info.needed[i].total;
                color = new cc.Color(200,20,20);
            }

            this.spawnNewObject(this.count,x,y - 36 ,{
                color: color,
                string: string,
                fontSize: 18
            });
        }
    },

    spawnNewObject:function(getPrefab,x,y, data = undefined){
        let newObject = cc.instantiate(getPrefab);
        this.node.addChild(newObject);
        if(data != undefined){
            if(data.string){
                newObject._components[0].string = data.string;
            }
            if(data.color){
                newObject.color = data.color;
            }
            if(data.fontSize){
                newObject._components[0].fontSize = data.fontSize;
            }
        }

        newObject.height = 42;
        newObject.width = 42;
        newObject.setPosition(cc.v2(x,y));
    }

    // update (dt) {},
});
