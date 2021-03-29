cc.Class({
    extends: cc.Component,

    properties: {
        apple_prefab:{
            default:null,
            type:cc.Prefab
        },
        lemon_prefab:{
            default:null,
            type:cc.Prefab
        },
        wheat_prefab:{
            default:null,
            type:cc.Prefab
        },
        tomato_prefab:{
            default:null,
            type:cc.Prefab
        },
        egg_prefab:{
            default:null,
            type:cc.Prefab
        },
        flour_prefab:{
            default:null,
            type:cc.Prefab
        },
        try_prefab_1:{
            default:null,
            type:cc.Prefab
        },


        measuring_tape:{
            default:null,
            type:cc.Prefab
        },
        hammer:{
            default:null,
            type:cc.Prefab
        },
        nail:{
            default:null,
            type:cc.Prefab
        },



        fertilizer_x2:{
            default:null,
            type:cc.Prefab
        },
        fertilizer_x4:{
            default:null,
            type:cc.Prefab
        },
        fertilizer_x8:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    get_prefab:function(name){
        switch (name){
            case "wheat":
                return this.wheat_prefab;
            case "lemon":
                return this.lemon_prefab;
            case "apple":
                return this.apple_prefab;
            case "tomato":
                return this.tomato_prefab;
            case "egg":
                return this.egg_prefab;
            case "flour":
                return this.flour_prefab;
            case "try_prefab_1":
                return this.try_prefab_1;

            case "measuring_tape":
                return this.measuring_tape;
            case "hammer":
                return this.hammer;
            case "nail":
                return this.nail;


            case "fertilizer_x2":
                return this.fertilizer_x2;
            case "fertilizer_x4":
                return this.fertilizer_x4;
            case "fertilizer_x8":
                return this.fertilizer_x8;
            default:
                console.error("unknown object \"" +name + "\"");
        }
    },
    // update (dt) {},
});
