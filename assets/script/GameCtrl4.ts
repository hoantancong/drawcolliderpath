// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    fixedTime: number = 30;
    @property
    VELOCITY_ITERATIONS: number = 8;
    @property
    POSITION_ITERATIONS: number = 8;
    @property(cc.Node)
    parent:cc.Node = null;
    @property(cc.Node)
    child:cc.Node = null;
    onLoad(){

        this.parent.addComponent(cc.PhysicsBoxCollider);
        this.parent.addComponent(cc.PhysicsBoxCollider);
        this.parent.addComponent(cc.PhysicsBoxCollider);
        this.parent.addComponent(cc.PhysicsBoxCollider);
        this.parent.addComponent(cc.PhysicsBoxCollider);
        var i = 0;
        this.parent.getComponents(cc.PhysicsBoxCollider).forEach(element => {
            element.size = cc.size(5,5);
            element.tag = i;
            element.offset = cc.v2(50*i,10*i);
            i++;
        });
        this.parent.getComponents(cc.PhysicsBoxCollider).forEach(element => {
            console.log(element.tag);
        });
          var manager = cc.director.getPhysicsManager();
          cc.director.getCollisionManager().enabled = true;
          manager.enabled = true;
          //
          // Enable settings for physics timestep
          manager.enabledAccumulator = true;
          // Physics timestep, default FIXED_TIME_STEP is 1/60
          cc.PhysicsManager.FIXED_TIME_STEP = 1 / this.fixedTime;
          cc.PhysicsManager.VELOCITY_ITERATIONS = this.VELOCITY_ITERATIONS;
          cc.PhysicsManager.POSITION_ITERATIONS = this.POSITION_ITERATIONS;
          //
  
          cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
              cc.PhysicsManager.DrawBits.e_jointBit |
              cc.PhysicsManager.DrawBits.e_shapeBit
  
    }
    // update (dt) {}
}
