type HOF = <T extends Function>(fun: T, time: number) => (...args: unknown[]) => any;


/**
 * 让一个函数最少间隔指定时间执行一次
 * @param fun 源函数
 * @param time 间隔执行的时间（ms）
 * @returns 代理函数
 */
export const throttle: HOF = (fun, time) => {
    let timeEnd = 0;
    return (...args: unknown[]) => {
        let now = Date.now();
        if (timeEnd < now) {
            timeEnd = now + time;
            return fun.apply(this, args);
        }
    }
}