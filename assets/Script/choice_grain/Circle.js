cc.Class({
    extends: cc.Component,

    properties: {
        bags:{
            default:null,
            type:cc.Prefab
        },
        label_price:{
            default:null,
            type:cc.Prefab
        },
        rotate_left:{
            default:null,
            type:cc.Node
        },
        rotate_right:{
            default:null,
            type:cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {

        this.our_plant = [];

        this.get_plants_info();

        this.show_plant_seeds();

        window.action_active = true;

        this.node.parent.on("touchstart",event=>{
            let mouse_position_x = event.getLocation().x - (this.node.parent.width / 2);
            let mouse_position_y = event.getLocation().y - (this.node.parent.height / 2);
            if(
                (mouse_position_x > this.node.x + (35 * this.node.scaleX) + 15 || mouse_position_x < this.node.x - (35 * this.node.scaleX) - 15) ||
                (mouse_position_y > this.node.y + (35 * this.node.scaleY) + 15 || mouse_position_y < this.node.y - (35 * this.node.scaleY) - 15)
                ){
                window.action_active = false;
                this.node.destroy();
            }
        },this)
    },
    
    start () {
        
    },

    get_plants_info:function(){
        for(let i = 0;i < window.planting_data.length;i++)
        {
            this.our_plant.push(window.planting_data[i])
        }
    },

    show_plant_seeds:function(){
        for(let i = 0;i < this.our_plant.length;i++){
            let pos = this.rotation_transform_formula(0,32,i,this.our_plant.length);
            this.spawnNewObject(this.bags,cc.v2(pos.x,pos.y),i);
        }
    },
    
    spawnNewObject: function(a,position,index){
        let newObject = cc.instantiate(a);
        newObject._components[1].stuff_prefab = this.get_object_by_macros(this.our_plant[index].name);
        newObject._components[1].label_price = this.label_price;
        newObject._components[1].plant = this.our_plant[index];
        newObject._components[1].initial_x = position.x;
        newObject._components[1].initial_y = position.y;
        newObject._components[1].first_x = position.x;
        newObject._components[1].first_y = position.y;
        newObject._components[1].degree_by_index_per_length = ( index / this.our_plant.length) * 360;
        newObject.setPosition(position);
        this.node.addChild(newObject);
    },

    // update (dt) {},
    rotation_transform_formula(x,y,index,length){
        let times_PI_square = (Math.PI * 2) * (index/length);
        return {
            x:(Math.cos(times_PI_square) * x) + -(Math.sin(times_PI_square) * y),
            y:(Math.sin(times_PI_square) * x) + (Math.cos(times_PI_square) * y)
        }
    },

    get_object_by_macros:function(name){
        switch (name){
            case "wheat":
                return this.node.parent._components[3].wheat_prefab;
            case "tomato":
                return this.node.parent._components[3].tomato_prefab;
        }
    },
});
