import * as t from "io-ts";
import { ok, ko, tap, fetch, optional, decodeToPromise, throwErr } from "./helpers";

(async () => {
    const People = t.interface({
        name: t.string,
        surname: optional(t.string)
    });

    type IPeople = t.TypeOf<typeof People>;

    try {
        let json = await fetch("http://localhost:3000/good/1");
        console.log("VALIDATE good/1", json);
        let val = People.decode(json);
        //People.decode(json).fold(ko, ok);
        val.isRight() ? ok("GOOD1", val.value) : throwErr(val);
    } catch (e) {
        ko(e);
    }

    fetch("http://localhost:3000/bad/1")
        .then(tap("BAD1>"))
        .then(json => decodeToPromise(People, json))
        .then(ok)
        .catch(ko);
})();
