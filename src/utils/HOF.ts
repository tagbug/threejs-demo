type HOF = <T extends Function>(fun: T, time: number) => (...args: unknown[]) => any;


export const throttle: HOF = (fun, time) => {
    let timeEnd = 0;
    return (...args: unknown[]) => {
        let now = Date.now();
        if (timeEnd < now) {
            timeEnd = now + time;
            console.log('called', now, timeEnd, now - timeEnd);
            return fun.apply(this, args);
        }
    }
}