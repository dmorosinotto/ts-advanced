import * as http from "http";
import * as https from "https";

export function fetch(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = url.startsWith("https") ? https.get : http.get;
        req(encodeURI(url), res => {
            var body = "";
            res.setEncoding("utf8");
            res.on("data", chunk => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        }).on("error", err => reject(err));
    });
}
