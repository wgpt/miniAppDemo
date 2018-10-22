/*
* 一些新功能补丁
* */


export default () => {
    /*
    * es6 功能补丁
    * */
    // 无论promise对象最后状态如何都会执行
    Promise.prototype.finally = function (callback) {
        let P = this.constructor;
        return this.then(
            value => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => {
                throw reason
            })
        );
    };


}