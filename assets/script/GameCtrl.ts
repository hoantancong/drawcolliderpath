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
    path: cc.Node[] = [];

    @property(cc.Node)
    tempLine: cc.Node = null;
    @property
    drawPhysic:boolean = false;
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
        if(this.drawPhysic){
            cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit

        }

        //register event
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true);
        //


        //
    }
    lastLoc: cc.Vec3 = null;
    pathCount = 0;
    previousLoc: cc.Vec2 = null;
    previousPosition: cc.Vec2 = null;
    private onTouchStart(event) {
        // while (this.brushList.length > 0) {
        //     this.brushList.pop().destroy();
        // }
        this.lastLoc = null;
        this.previousLoc = null;
        this.previousPosition = null;
        this.pointList = [];
        this.path[this.pathCount] = cc.instantiate(this.pathPrefab);
        this.lastLoc = event.getLocation();

    }

    private onTouchMove(event) {

        //add collider  
        let end = event.getLocation();

        if (this.previousLoc == null) {
            let loc = this.onConvertToWorldPoint(end, cc.v2(360, 640));
            //do nothing
            if (this.previousPosition == null) {
                this.previousPosition = loc;
            }
            this.pointList.push(loc);


        } else {
            //if too close old
            let distance = this.deltaDistance(end, this.previousLoc);
            if (distance < 10) {
                //not draw
                console.log('too close');
                return;
            } else if(distance>20){
                let step = distance / 10;
                for (var i = 0; i < step; i++) {
                    let dt = 1.0 * i / step;
                    let difX = end.x - this.previousLoc.x;
                    let difY = end.y - this.previousLoc.y;
                    let newPos = cc.v3(end.x + difX * dt, end.y + difY * dt);
                    let loc = this.onConvertToWorldPoint(newPos, cc.v2(360, 640));
                    //draw here
                    this.drawLine(this.previousPosition, loc, this.tempLine);
                    //do nothing
                    this.pointList.push(loc);
                    this.previousPosition = loc;
                }



            }else{
                //normal
                let newPos = cc.v3(end.x, end.y);
                let loc = this.onConvertToWorldPoint(newPos, cc.v2(360, 640));
                //draw here
                this.drawLine(this.previousPosition, loc, this.tempLine);
                //do nothing
                this.pointList.push(loc);
                this.previousPosition = loc;
            }

        }
        this.previousLoc = end;


    }
    private deltaDistance(vec1: cc.Vec2, vec2: cc.Vec2) {
        let mag = vec1.sub(vec2).mag()
        return mag;
    }
    count = 0;
    private onTouchEnd(event) {
        //
        //
        this.createRealLine();
        this.pathCount++;
        this.pointList = null;


    }
    private createRealLine() {
        var i = 0;
        let tempPos = null;
        this.pointList.forEach(element => {
            if (tempPos == null) {
                //first node
                tempPos = element;
            } else {
                this.drawLine(tempPos, element, this.path[this.pathCount]);
                tempPos = element;
            }
            this.path[this.pathCount].addComponent(cc.PhysicsBoxCollider).tag = i;
        });

        this.path[this.pathCount].getComponents(cc.PhysicsBoxCollider).forEach(element => {
            element.tag = i;
            element.size = cc.size(10, 10);
            element.offset = this.pointList[i];
            i++;
        });
        this.path[this.pathCount].getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        this.node.addChild(this.path[this.pathCount]);
        //clear old path
        let drawing = this.tempLine.getComponent(cc.Graphics);
        drawing.clear();
    }
    private onConvertToWorldPoint(point: cc.Vec3, centerPoint: cc.Vec2) {
        return cc.v2(point.x - centerPoint.x, point.y - centerPoint.y);
    }
    drawing: cc.Graphics = null;
    private drawLine(start: cc.Vec2, end: cc.Vec2, parent: cc.Node) {
        this.drawing = parent.getComponent(cc.Graphics);
        this.drawing.lineWidth = 12;
        this.drawing.moveTo(start.x, start.y);
        this.drawing.lineTo(end.x, end.y);
        this.drawing.strokeColor = cc.Color.RED;
        this.drawing.lineCap =cc.Graphics.LineCap.ROUND;
        this.drawing.stroke();
        this.drawing.fill();
    }
    // update (dt) {}
}
