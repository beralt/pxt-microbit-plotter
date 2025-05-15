namespace plotter {

    let length = 70.0 // single arm length in [mm]
    let gear_ratio = 1.0 // the ratio of gears in the robot
    let c = 0 // the offset of the pencil
    let center_x = -20.0
    let center_y = 78.8

    function init() {
        //
    }

    /**
     * Move the plotter to the given x and y coordinate
     * @param grid_x The x coordinate on the grid
     * @param grid_y The y coordinate on the grid
     */
    //% blockId=goto block="goto %x, %y"
    //% weight=10
    export function goto(grid_x: number, grid_y: number): void {
        if (grid_x > 40 || grid_x < 0 || grid_y > 40 || grid_y < 0) {
            return
        }
        // translate the coordinates to our 40 sized grid
        let x = center_x + grid_x
        let y = center_y + grid_y
        // calculate the desired polar coordinates
        let theta = Math.atan2(y, x)
        let px = x - Math.cos(theta) * c
        let py = y - Math.sin(theta) * c
        let r = Math.sqrt(px*px + py*py)
        let epsilon = Math.acos(r / (2 *length))
        // absolute arm angles
        let desired_right_arm_angle = theta - epsilon
        let desired_left_arm_angle = theta + epsilon
        // apply the gear ratio to obtain the absolute servo angles
        let right_arm_servo_angle = (0.75 * Math.PI - (desired_right_arm_angle - 0.25 * Math.PI) * gear_ratio) * 180.0 / Math.PI
        let left_arm_servo_angle = (0.25 * Math.PI - (desired_left_arm_angle - 0.75 * Math.PI) * gear_ratio) * 180.0 / Math.PI
        // and move the servos
        if (right_arm_servo_angle > 0.0 && right_arm_servo_angle < 180.0 && left_arm_servo_angle > 0.0 && left_arm_servo_angle < 180.0) {
            wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S0, right_arm_servo_angle)
            wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S1, left_arm_servo_angle)
        }
    }

}
