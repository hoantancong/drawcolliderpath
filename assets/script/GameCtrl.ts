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
    // @property(cc.Prefab)
    // brushPrefab: cc.Prefab = null;
    pointList: cc.Vec2[] = [];
    @property(cc.Prefab)
    pathPrefab: cc.Prefab = null;
    path: cc.Node = null;

    tempBrushList: cc.Node[] = [];
    @property(cc.Node)
    tempLine:cc.Node = null;
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
        //
        this.path = cc.instantiate(this.pathPrefab);

        //
    }
    lastLoc: cc.Vec3 = null;
    private onTouchStart(event) {
        // while (this.brushList.length > 0) {
        //     this.brushList.pop().destroy();
        // }
        this.lastLoc = event.getLocation();

    }
    previousLoc: cc.Vec2 = null;
    previousPosition: cc.Vec2 = null;
    private onTouchMove(event) {

        //add collider
        let end = event.getLocation();

        if (this.previousLoc == null) {
            let newPos = cc.v3(end.x, end.y);
            let loc = this.onConvertToWorldPoint(newPos, cc.v2(360, 640));
            //do nothing
            if(this.previousPosition==null){
                this.previousPosition = loc;
            }
            this.pointList.push(loc);


        } else {
            //if too close old
            let delta = this.deltaDistance(end, this.previousLoc);
            if (delta < 12) {
                //not draw
                console.log('too close');
                //return;
            } else{
                let newPos = cc.v3(end.x, end.y);
                let loc = this.onConvertToWorldPoint(newPos, cc.v2(360, 640));
                //draw here
                this.drawLine(this.previousPosition,loc,this.tempLine);
                //do nothing
                this.pointList.push(loc);
                this.previousPosition = loc;
            }

        }
        this.previousLoc = end;
        console.log('length:'+this.tempBrushList.length);


    }
    private deltaDistance(vec1: cc.Vec2, vec2: cc.Vec2) {
        let mag = vec1.sub(vec2).mag()
        return mag;
    }
    count = 0;
    private onTouchEnd(event) {
        //
        while (this.tempBrushList.length > 0) {
            this.tempBrushList.pop().destroy();
        }
        //
        this.createLine();

    }
    private createLine() {
        var i = 0;
        let tempPos = null;
        this.pointList.forEach(element => {
            if(tempPos==null) {
                tempPos = element;
            }else{
                this.drawLine(tempPos,element,this.path);
                tempPos = element;
            }
            this.path.addComponent(cc.PhysicsCircleCollider).tag = i;
        });
 
        this.path.getComponents(cc.PhysicsCircleCollider).forEach(element => {
            element.tag = i;
            element.radius = 5;
            element.offset = this.pointList[i];
            i++;
        });
        this.path.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        this.node.addChild(this.path);
        //clear old path
        let drawing  = this.tempLine.getComponent(cc.Graphics);
        drawing.clear();
    }
    private onConvertToWorldPoint(point: cc.Vec3, centerPoint: cc.Vec2) {
        return cc.v2(point.x - centerPoint.x, point.y - centerPoint.y);
    }
    drawing:cc.Graphics = null;
    private drawLine(start:cc.Vec2,end:cc.Vec2,parent:cc.Node){
        this.drawing = parent.getComponent(cc.Graphics);
        this.drawing.lineWidth = 6;
        this.drawing.moveTo(start.x,start.y);
        this.drawing.lineTo(end.x,end.y);
        this.drawing.strokeColor = cc.Color.RED;
        this.drawing.stroke();
        this.drawing.fill();
    }
    // update (dt) {}
}