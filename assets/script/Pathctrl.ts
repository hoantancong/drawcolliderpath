// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    body:cc.RigidBody = null;
    onLoad(){
        this.body = this.node.getComponent(cc.RigidBody);
        this.scheduleOnce(this.onChangeToDynamic,3);
    }
    public onChangeToDynamic(){
        this.body.type =cc.RigidBodyType.Dynamic;
    }
    // update (dt) {}
}
