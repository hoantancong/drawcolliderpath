// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    fixedTime: number = 30;
    @property
    VELOCITY_ITERATIONS: number = 8;
    @property
    POSITION_ITERATIONS: number = 8;
    @property(cc.Prefab)
    brushPrefab:cc.Prefab = null;
    brushList:cc.Node[]=[];
    @property(cc.Prefab)
    pathPrefab:cc.Prefab = null;
    path:cc.Node = null;
    onLoad() {
        //physic environtment
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

        //register event
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true);
    }
    private onTouchStart(event){
      
    }
    private onTouchMove(event){
        let loc = this.onConvertToWorldPoint(event.getPreviousLocation(),cc.v2(360,640));
        //create draw point

    }
    count = 0;
    private onTouchEnd(event){
        //create weld join
        //CREATE POINT HERE
        let loc = this.onConvertToWorldPoint(event.getPreviousLocation(),cc.v2(360,640));
        //create draw point
        let point = cc.instantiate(this.brushPrefab);
        point.position = loc;
        this.node.addChild(point);
        this.brushList.push(point);
        this.count++;
        if(this.count>7){
            this.createPath();
        }
    }
    private createPath(){
        this.path = cc.instantiate(this.pathPrefab);
        this.brushList.forEach(element => {
            let pos = cc.v2(element.x, element.y);
            this.path.getComponent(cc.PhysicsPolygonCollider).points.push(pos);
        });
        this.brushList.reverse();
        this.brushList.forEach(element => {
            let pos = cc.v2(element.x, element.y+100);
            this.path.getComponent(cc.PhysicsPolygonCollider).points.push(pos);
        });
       // this.path.getComponent(cc.PhysicsPolygonCollider).points.push(cc.v2(0,900));
        //push the first element to end the loop
        //this.test();
        this.node.addChild(this.path);
        console.log(this.brushList.length);
    }
    private onConvertToWorldPoint(point:cc.Vec3,centerPoint:cc.Vec2){
        return cc.v3(point.x-centerPoint.x,point.y-centerPoint.y);
    }
    // update (dt) {}
}
