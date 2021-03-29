cc.Class({
    extends: cc.Component,

    properties: {
        back_button:{
            default:null,
            type:cc.Node
        },
        level:{
            default:null,
            type:cc.Node
        },
        energy:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.organize_data();
        this.back_onClick();
        this.setLevel();
    },

    start () {

    },

    organize_data:function(){
        this.back_button.setPosition(cc.v2(-(this.node.width / 2) + (this.back_button.width), (this.node.height / 2) - (this.back_button.height) ));
        this.energy.setPosition(cc.v2(-(this.node.width / 2) + (this.back_button.width),-(this.node.height / 2) + (this.back_button.height * 1.5) ))
        this.energy.children[0]._components[0].string = window.default_data.friend_data[window.friend_meadow_load.index].rest_of_helping;
    },

    back_onClick:function(){
        this.back_button.on("touchend",event=>{
            window.friend_meadow_load = false;
            cc.director.loadScene('Game');
        },this);
    },

    setLevel:function(){
        window.our_level;
        for(let i = 1;i <= window.level_weight.length;i++){
            if(window.default_data.point_level >= window.level_weight[i - 1]){
                window.our_level = i;
            }else if(window.default_data.point_level < window.level_weight[i - 1]){
                break;
            }
        }
        this.level.children[0].width = this.level.width * ((window.default_data.point_level - window.level_weight[window.our_level - 1]) / (window.level_weight[window.our_level] - window.level_weight[window.our_level - 1]));
        this.level.children[0].x = -(this.level.width / 2) + (this.level.children[0].width/2);
        this.level.children[1].children[0]._components[0].string = window.our_level;
    },

    addLevelPoint:function(a){
        let level_before = window.our_level;
        window.default_data.point_level += a;
        this.setLevel();
        if(window.our_level > level_before){
            console.log("congratulation: new lavel");
        }
    },

    doActivity:function(object_index){
        let result = true;
        if(window.default_data.friend_data[window.friend_meadow_load.index].rest_of_helping > 0){
            if(window.default_data.friend_data[window.friend_meadow_load.index].rest_of_helping == 5){
                let d =  new Date();
                window.default_data.friend_data[window.friend_meadow_load.index].last_helping_time = d.getTime() + (1000 * 60 * 60 * 24);
            }else if(window.default_data.friend_data[window.friend_meadow_load.index].rest_of_helping == 1){
                window.default_data.friend_data[window.friend_meadow_load.index].friendship_level += 0.05;
                if(window.default_data.friend_data[window.friend_meadow_load.index].friendship_level > 1){
                    window.default_data.friend_data[window.friend_meadow_load.index].friendship_level = 1
                }
            }
            window.friend_meadow_load.object[object_index].index = object_index;
            window.default_data.friend_data[window.friend_meadow_load.index].history.push(window.friend_meadow_load.object[object_index]);
            window.default_data.friend_data[window.friend_meadow_load.index].rest_of_helping -= 1;
            this.energy.children[0]._components[0].string = window.default_data.friend_data[window.friend_meadow_load.index].rest_of_helping;
        }else{
            result = false;
        }
        return result;
    },

    achievement_request:function(achievement_name,total = undefined){
        for(let i = 0; i < window.default_data.achievement.length;i++){
            if(window.default_data.achievement[i].name == achievement_name){
                if(total != undefined){
                    window.default_data.achievement[i].done += total;
                }else{
                    window.default_data.achievement[i].done += 1;
                }

                let count_length = window.default_data.achievement[i].count.length;
                if(window.default_data.achievement[i].done > window.default_data.achievement[i].count[count_length - 1].amount){
                    window.default_data.achievement[i].done = window.default_data.achievement[i].count[count_length - 1].amount;
                }
                break;
            }
        }
    },

    // update (dt) {},
});
