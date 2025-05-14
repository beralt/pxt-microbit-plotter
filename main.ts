namespace plotter {

    let initialized = false
    let length = 70.0 // single arm length in [mm]
    let initial_angle_offset = 0.25 * Math.PI // initial offset of 45 degrees [rad]
    let initial_angle = 0.5 * Math.PI // initial relative angle in [rad]
    let gear_ratio = 5.0 // the ratio of gears in the robot

    function init() {
        if (initialized) {
            return
        }
        wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S0, initial_angle * 180.0 / Math.PI)
        wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S1, initial_angle * 180.0 / Math.PI)
    }

    /**
     * Move the plotter to the given x and y coordinate
     * @param x The x coordinate
     * @param y The y coordinate
     */
    //% blockId=goto block="goto %x, %y"
    //% weight=10
    export function goto(x: number, y: number): void {
        // calculate the desired polar coordinates
        let r = Math.sqrt(x*x + y*y)
        let theta = Math.atan2(y, x)
        // absolute arm angles
        let desired_right_arm_angle = right_arm_angle(theta, r)
        let desired_left_arm_angle = left_arm_angle(theta, r)
        // apply the gear ratio to obtain the absolute servo angles
        let right_arm_servo_angle = initial_angle + (desired_right_arm_angle - initial_angle) * gear_ratio
        let left_arm_servo_angle = initial_angle + (desired_left_arm_angle - initial_angle) * gear_ratio
        // and move the servos
        wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S0, right_arm_servo_angle * 180.0 / Math.PI)
        wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S1, left_arm_servo_angle * 180.0 / Math.PI)
    }

    function right_arm_angle(theta: number, r: number): number {
        return theta - Math.acos(0.5 * r * length) + initial_angle_offset
    }

    function left_arm_angle(theta: number, r: number): number {
        return theta - Math.acos(0.5 * r * length) + initial_angle_offset
    }

}
