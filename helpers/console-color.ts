// More colors read https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

export function ok(...a: any[]) {
    console.log("\x1b[32m", ...a, "\x1b[0m");
}

export function ko(...a: any[]) {
    console.error("\x1b[31m", ...a, "\x1b[0m");
}

export function tap(msg: string = "") {
    if (!msg) msg = new Date().toISOString() + "> ";
    return (x: any) => console.log("\x1b[33m%s\x1b[0m", msg, x) || x;
}
