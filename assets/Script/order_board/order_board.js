cc.Class({
    extends: cc.Component,

    properties: {
        close:{
            default:null,
            type:cc.Node
        },
        deliver:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.page_index = 0;
        this.our_order;
        this.show_all();
    },

    start () {

    },

    show_all(){
        for(let i = this.node.children.length - 1;i >= 0;i--){
            if(this.node.children[i]._name != this.close.name){
                this.node.children[i].destroy();
            }
        }
        this.show_order();
        this.onClose();
    },

    show_order(){

        this.our_order = this.array_to_matrix(this.array_to_matrix(window.default_data.order))

        let index = 0;
        for(let i = 0;i < this.our_order[this.page_index].length;i++){
            for(let j = 0; j < this.our_order[this.page_index][i].length;j++){
                let x = -180 + ((j/2) * 360);
                let y = 180 - ((i/2) * 320);
                this.spawnNewObject(this.deliver, x, y,this.our_order[this.page_index][i][j],index);
                index++;
            }
        }
    },

    spawnNewObject: function(a,x,y,data = undefined,data2 = undefined){
        let newObject = cc.instantiate(a);
        if(data){
            newObject._components[1].our_data = data;
            newObject._components[1].our_data2 = data2;
        }
        this.node.addChild(newObject);
        newObject.setPosition(cc.v2(x,y));
    },

    array_to_matrix: function(order){
        let matrix_order = [];
        let size_each_line = 3;
        let array_per_line = [];
        for(let i = 0;i < order.length;i++)
        {
            array_per_line.push(order[i]);
            size_each_line -= 1;

            if(size_each_line == 0){
                matrix_order.push(array_per_line);
                array_per_line = [];
                size_each_line = 3;
            }

            if(i == order.length - 1){
                matrix_order.push(array_per_line);
            }
        }
        return matrix_order;
    },


    onClose(){
        this.close.on("touchend",event=>{
            window.action_active = false;
            this.node.destroy();
        },this)
    }

    // update (dt) {},
});
