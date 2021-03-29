cc.Class({
    extends: cc.Component,

    properties: {
        close_box:{
            default:null,
            type:cc.Node
        },
        run_button:{
            default:null,
            type:cc.Prefab
        },
        volume:{
            default:null,
            type:cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.setPosition(cc.v2(0,-this.node.parent.height/2 + this.node.height));
        this.spawnButtonOrVolume();
        this.close_box.on("touchend",event=>{
            window.action_active = false;
            this.node.destroy();
        },this);
    },

    start () {

    },

    spawnButtonOrVolume:function(){
        if(window.default_data.fertilizer_data.x2 == 1){
            this.spawnNewObject(this.run_button,-100,-25,"x2");
        }else if(window.default_data.fertilizer_data.x2 < 1){
            let index_ = this.spawnNewObject(this.volume,-100,-25);
            this.node.children[index_].children[0].width = window.default_data.fertilizer_data.x2 * this.node.children[index_].width;
            this.node.children[index_].children[0].setPosition(cc.v2(-this.node.children[index_].width/2 + this.node.children[index_].children[0].width/2,0));
        }
        
        if(window.default_data.fertilizer_data.x4 == 1){
            this.spawnNewObject(this.run_button,0,-25,"x4");
        }else if(window.default_data.fertilizer_data.x4 < 1){
            let index_ = this.spawnNewObject(this.volume,0,-25);
            this.node.children[index_].children[0].width = window.default_data.fertilizer_data.x4 * this.node.children[index_].width;
            this.node.children[index_].children[0].setPosition(cc.v2(-this.node.children[index_].width/2 + this.node.children[index_].children[0].width/2,0));
        }

        if(window.default_data.fertilizer_data.x8 == 1){
            this.spawnNewObject(this.run_button,100,-25,"x8");
        }else if(window.default_data.fertilizer_data.x8 < 1){
            let index_ = this.spawnNewObject(this.volume,100,-25);
            this.node.children[index_].children[0].width = window.default_data.fertilizer_data.x8 * this.node.children[index_].width;
            this.node.children[index_].children[0].setPosition(cc.v2(-this.node.children[index_].width/2 + this.node.children[index_].children[0].width/2,0));
        }
    },

    spawnNewObject:function(object_name,x,y,times = false){
        let newObject = cc.instantiate(object_name);
        newObject.setPosition(cc.v2(x,y));
        this.node.addChild(newObject);
        let index_;
        for(let i = 0;i < this.node.children.length;i++){
            if(this.node.children[i].uuid == newObject.uuid){
                index_ = i;
                break;
            }
        }
        if(times){
            newObject.on("touchend",(event)=>{
                this.doAction(times);
            },this)
        }else{
            return index_;
        }
    },

    setAction(times){
        let d = new Date() 
        switch (times) {
            case "x2":
                window.default_data.fertilizer_data.x2 = 0;
                break;
            case "x4":
                window.default_data.fertilizer_data.x4 = 0;
                break;
            case "x8":
                window.default_data.fertilizer_data.x8 = 0;
                break;
            default:
                console.error("unknown : " + times)
                break;
        }
        window.default_data.fertilizer_data.now.type = times;
        window.default_data.fertilizer_data.now.times_start = d.getTime();
        window.default_data.fertilizer_data.now.times_end = window.default_data.fertilizer_data.now.times_start + (1000 * 30);
        window.action_active = false;
        this.node.destroy();
    },

    doAction:function(times){
        if(times == "x2"){
            this.setAction("x2");
        }else if(times == "x4"){
            this.setAction("x4");
        }else if(times == "x8"){
            this.setAction("x8");
        }else{
            console.error("unknown fertilizer");
        }
    }

    // update (dt) {},
});
