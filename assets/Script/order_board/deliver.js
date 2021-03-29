cc.Class({
    extends: cc.Component,

    properties: {
        count_label:{
            default:null,
            type:cc.Prefab
        },
        deliver:{
            default:null,
            type:cc.Prefab
        },
        delete:{
            default:null,
            type:cc.Prefab
        },
        price:{
            default:null,
            type:cc.Prefab
        },
        time_clock:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sufficient = true;
        if(this.our_data.time_start > 0){
            this.show_time();
        }else{
            this.show_all();
        }
    },

    start () {

    },

    show_all(){
        this.show_item();
        this.show_delete();
        this.show_deliver();
        this.show_price(this.our_data.price);
    },

    show_time(){
        let d = new Date();
        let getTimeLeft = ((this.our_data.time_start + (1000)) - this.our_data.time_start) - (d.getTime() - this.our_data.time_start);

        let get_minutes = (getTimeLeft - (getTimeLeft % 60000)) / 60000 ;
        let get_second = Math.floor((getTimeLeft % 60000) / 1000); // 60000 == 60 second;

        this.spawnNewObject(this.time_clock,0,this.node.height/4);
        this.spawnNewObject(this.count_label,0,-this.node.height/4,{
                color: new cc.Color(255,255,255),
                string: "" + get_minutes + ":" + get_second
            });
        this.waiting_time = true;
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i]._name == this.count_label.name){
                    this.time_child_index = i;
                break;
            }
        }
    },

    show_item:function(){
        for(let i = 0;i < this.our_data.needed.length;i++){
            let color;
            let total = this.get_total_we_have(this.our_data.needed[i].name);
            if(total >= this.our_data.needed[i].total){
                color =  new cc.Color(20,200,20);
            }else{
                color = new cc.Color(200,20,20);
                this.sufficient = false;
            }
            let our_prefab = this.node.parent.parent._components[3].get_prefab(this.our_data.needed[i].name);
            this.spawnNewObject(our_prefab,-this.node.width / 4,(this.node.height / 3) - this.node.height * (i/4));
            this.spawnNewObject(this.count_label,this.node.width / 4,(this.node.height / 3) - this.node.height * (i/4),{
                color: color,
                string: total + "/" + this.our_data.needed[i].total
            });
        }
    },

    get_total_we_have:function(name){
        let result = 0;
        for(let i = 0;i < window.default_data.storage.length;i++){
            if(window.default_data.storage[i].name == name){
                result = window.default_data.storage[i].total
                break;
            }
        }
        return result;
    },

    spawnNewObject: function(a,x,y,data = undefined){
        let newObject = cc.instantiate(a);
        this.node.addChild(newObject);
        if(data != undefined){
            if(data.color != undefined){
                newObject.color = data.color;
            }
            if(data.string){
                newObject._components[0].string = data.string;
            }
        }
        newObject.setPosition(cc.v2(x,y));
        this.node.children[this.node.children.length - 1].width = (30/this.node.children[this.node.children.length - 1].height) * this.node.children[this.node.children.length - 1].width;
        this.node.children[this.node.children.length - 1].height = 30;
    },
    spawnNewNode: function(a,x,y,width = undefined,height = undefined){
        let newObject = cc.instantiate(a);
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(x,y));
        if(width && height){
            this.node.children[this.node.children.length - 1].width = width;
            this.node.children[this.node.children.length - 1].height = height;
        }
    },

    show_delete(){        
        this.spawnNewNode(this.delete,-this.node.width/2 - (30/2),this.node.height/2 - (30/2),30,30);
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i]._name == this.delete.name){
                this.node.children[i].on("touchend",event => {
                    window.default_data.order[this.our_data2] = this.newOrder(false);
                    this.node.parent._components[1].show_all();
                },this)
                break;
            }
        }
    },

    show_deliver(){
        this.spawnNewNode(this.deliver, this.node.width / 4,(this.node.height / 3) - this.node.height * (3/4),40,26);
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i]._name == this.deliver.name){
                this.node.children[i].on("touchend",event => {
                    if(this.sufficient != false){
                        for(let j = 0;j < this.our_data.needed.length;j++){
                            for(let k = 0;k < window.default_data.storage.length;k++){
                                if(this.our_data.needed[j].name == window.default_data.storage[k].name){
                                    window.default_data.storage[k].total -= this.our_data.needed[j].total;
                                    break;
                                }
                            }
                        }
                        this.node.parent.parent._components[2].addMoneyWithAction(this.our_data.price,this.node.x + this.node.children[i].x,this.node.y + this.node.children[i].y);
                        window.default_data.order[this.our_data2] = this.newOrder(true);
                        this.node.parent._components[1].show_all();
                    }
                },this)
                break;
            }
        }

    },

    show_price(price){
        this.spawnNewNode(this.price,-this.node.width / 3,(this.node.height / 3) - this.node.height * (3/4));
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i]._name == "price"){
                this.node.children[i]._components[0].string = "$"+this.our_data.price;
                break;
            }
        }
    },
    update (dt) {

        if(this.waiting_time == true){
            let d = new Date();
            let getTimeLeft = ((this.our_data.time_start + (1000)) - this.our_data.time_start) - (d.getTime() - this.our_data.time_start);
            if(getTimeLeft <= 0){
                this.change_to_show_item();
                return;
            }
            let get_minutes = (getTimeLeft - (getTimeLeft % 60000)) / 60000 ;
            let get_second = Math.floor((getTimeLeft % 60000) / 1000); // 60000 == 60 second;
            this.node.children[this.time_child_index]._components[0].string = "" + get_minutes + ":" + get_second;
        }
    },

    change_to_show_item:function(){
        window.default_data.order[this.our_data2].time_start = 0;
        this.node.parent._components[1].show_all();
    },

    newOrder:function(is_deliver){
        let d = new Date();
        let number_of_items = Math.round(1 + Math.random() * 2);
        let newData = [];
        let price = 0;
        let our_time_start;
        if(is_deliver){
            our_time_start = 0;
        }else{
            our_time_start = d.getTime();
        }

        for(let i = 0;i < number_of_items;i++){
            let toAddData = {};
            let randomIndex = Math.round(Math.random() * (window.item_selling_price.length - 1));
            let _item = window.item_selling_price[randomIndex];
            let loop = true;
            while(loop){
                loop = false;

                if(_item.gold){
                    console.log(_item.name);
                    loop = true;
                };

                for(let j = 0;j < newData.length;j++){
                    if(newData[j].name == _item.name){loop = true;break;}
                }

                if(loop){
                    randomIndex = Math.round(Math.random() * (window.item_selling_price.length - 1));
                    _item = window.item_selling_price[randomIndex];
                }
            }

            toAddData.name = _item.name;
            toAddData.total = Math.round(Math.random() * 9) + 1;
            price += _item.price * toAddData.total;
            newData.push(toAddData);
        };
        let result = {
            price:0,
            time_start:0,
            needed:[]
        };
        result.price = price + (Math.round(Math.random() * (price / 2)));
        result.time_start = our_time_start;
        result.needed = newData;

        return result;
    }
});
