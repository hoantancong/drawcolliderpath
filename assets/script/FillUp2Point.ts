// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    p1: cc.Node = null;
    @property(cc.Node)
    p2: cc.Node = null;
    point1: cc.Vec3 = null;
    point2: cc.Vec3 = null;
    // update (dt) {}
    @property(cc.Prefab)
    middlePrefab:cc.Prefab = null;
    onLoad(){
        this.point1 = this.p1.position;
        this.point2 = this.p2.position;
        let distance = this.point1.sub(this.point2).mag();
        let step = distance/30;
        for(var i = 0;i<step;i++){
            let delta = 1.0*i/step;
            let difX = this.point2.x-this.point1.x;
            let difY = this.point2.y - this.point1.y;
            console.log(delta*difX);
            let middle = cc.instantiate(this.middlePrefab);
            middle.setPosition(this.point1.x+delta*difX,this.point1.y+delta*difY);
            this.node.addChild(middle);
        }
    }
}
