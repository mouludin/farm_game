
cc.Class({
    extends: cc.Component,

    properties: {
        all_project:{
            default:null,
            type:cc.JsonAsset
        }
    },

    onLoad () {
    },

    organize_project:function(){
        if(4 - window.default_data.task_now.length > 0){
            for(let i = 0;i < this.all_project.json.length;i++){
                if(4 - window.default_data.task_now.length <= 0 || this.all_project.json[i].available_level > window.our_level){
                    break;
                }else{
                    if(this.all_project.json[i].done == false){
                        let nothing = true;
                        for(let j = 0;j < window.default_data.task_now.length;j++){
                            if(this.all_project.json[i].id == window.default_data.task_now[j].id){
                                nothing = false;
                            }
                        }
                        if(nothing){
                            window.default_data.task_now.push(this.all_project.json[i]);
                        }
                    }
                }
            }
        }
    },

    start () {

    },

    // update (dt) {},
});
