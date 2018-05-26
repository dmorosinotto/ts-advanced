import * as t from "io-ts";
import { ok, ko, tap, fetch, optional, decodeToPromise, throwErr } from "./helpers";

(async () => {
    const People = t.interface({
        name: t.string,
        surname: optional(t.string),
        sex: optional(t.union([t.literal("M"), t.literal("F")])),
        // sex: optional(t.keyof({ M: null, F: null })) //modo alternativo
        dob: optional(t.string), //LE DATE IN JSON SONO STRINGHE ISOFormat
        programming: optional(t.array(t.string)),
        address: optional(
            t.interface({
                via: t.string,
                num: t.string,
                cap: t.number
            })
        )
    });

    type IPeople = t.TypeOf<typeof People>;

    await ValidateAsync("good/1", People);
    await ValidateAsync("good/2", People);
    await ValidateAsync("good/3", People);
    await Validate("good/4", People);
    await Validate("good/5", People);
    await ValidateAsync("bad/1", People);
    await ValidateAsync("bad/2", People);
    await ValidateAsync("bad/-1", People);
    await ValidateAsync("bad/-2", People);
    await ValidateAsync("bad/3", People);
    await Validate("bad/4", People);
    await Validate("bad/5", People);
})();

/* HELPER LOCALI PER ESEGUIRE VALIDAZIONE SYNC O ASYNC */
async function ValidateAsync<T>(uri: string, valid: t.Type<T>) {
    try {
        let json = await fetch("http://localhost:3000/" + uri);
        console.log("VALIDATE", uri, "> ", json);
        let res = valid.decode(json);
        //People.decode(json).fold(ko, ok);
        res.isRight() ? ok(res.value) : throwErr(res);
    } catch (e) {
        ko(e);
    }
}

function Validate<T>(uri: string, valid: t.Type<T>) {
    return fetch("http://localhost:3000/" + uri)
        .then(tap(`VALIDATE ${uri}> `))
        .then(json => decodeToPromise(valid, json))
        .then(ok)
        .catch(ko);
}
