"use strict";
const rp = require("request-promise-native");
class Webmo {
    constructor(host) {
        this.base = 'http://' + (host || 'webmo.local');
        this.base += '/api';
        this._stepAngle = 1.8;
    }
    getStatus() {
        return rp(this.base + '/status');
    }
    /**
     * Webmoを回転させる．
     * 返却されるPromiseはWebリクエストのレスポンスとともに解決される．
     *
     * @param {number} [speed] - 回転速度を指定．(度/秒)
     * @returns {Promise}
     */
    rotate(speed) {
        return rp.post(this.base + '/rotate/forever').form({ speed: speed });
    }
    rotateTo(position, absRange, speed) {
        var args = {
            degree: position,
            absRange: absRange,
            speed: speed,
            absolute: true
        };
        return rp.post(this.base + '/rotate').form(args);
    }
    /**
     * Webmoを任意の角度回転させる．正確に回転することができるが，外部による誤差は検出できないので注意．
     * 例: 何かに引っかかって回転しきれなかった．
     * 例: 動かないように手で固定した．
     * 変換されるPromiseはWebリクエストのレスポンスとともに解決される．
     * 回転の終了によって解決されるわけではないので注意．
     *
     * @param {number} [degree] - 回転角度を指定(度)
     * @param {number} [speed] - 回転速度を指定．(度/秒)
     * @returns {Promise}
     */
    rotateBy(degree, speed) {
        var args = {
            degree: degree,
            speed: speed
        };
        return rp.post(this.base + '/rotate').form(args);
    }
    // XXX: Later
    rotateToHome() {
        return rp.post(this.base + '/rotate/home').form({});
    }
    /**
     * Webmoを停止させる．
     *
     * @param {boolean} [smooth] - なめらかに停止させる．
     * @param {boolean} [lock] - 停止後モーターを固定して動かないようにする．
     * @returns {Promise}
     */
    stop(smooth, lock) {
        smooth = smooth || false;
        lock = lock || false;
        return rp.post(this.base + '/stop').form({ smooth: smooth, lock: lock });
    }
    /**
     * Webmoを急停止させる．
     * 停止後モーターを固定しない．
     *
     * @returns {Promise}
     */
    stopHard() {
        return rp.post(this.base + '/stop').form({ smooth: false });
    }
    /**
     * Webmoをなめらかに停止させる．
     * 停止後モーターを固定しない．
     *
     * @returns {Promise}
     */
    stopSoft() {
        return rp.post(this.base + '/stop').form({ smooth: true });
    }
    // XXX: Later
    resetHome() {
        return rp.post(this.base + '/home/reset').form({});
    }
    /**
     * 度をステップ(ステッピングモーターが本来回転できる単位)に変換する
     *
     * @param {Number} [angle] - 度
     * @returns {Number} - ステップ
     */
    angleToStep(angle) {
        return angle / this._stepAngle;
    }
    /**
     * ステップを度に変換する．
     *
     * @param {Number} [step] - ステップ
     * @returns {Number} - 度
     */
    stepToAngle(step) {
        return step * this._stepAngle / 128; // XXX: microstep must be supplied
    }
    // XXX: Later
    getSpeedPerSecondByStep(step) {
        return Math.pow(2, 28) * step / Math.pow(10, 9) * 250;
    }
    // XXX: Later
    getSpeedPerSecondByAngle(angle) {
        return this.getSpeedPerSecondByStep(this.angleToStep(angle));
    }
}
exports.Webmo = Webmo;
//# sourceMappingURL=http.js.map