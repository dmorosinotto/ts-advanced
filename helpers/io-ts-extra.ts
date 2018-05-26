import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { ThrowReporter } from "io-ts/lib/ThrowReporter";

// Produces a validator that is a union of the given type with `undefined`
export function optional<RT extends t.Any>(
    type: RT,
    name: string = `${type.name} | undefined`
): t.UnionType<[RT, t.UndefinedType], t.TypeOf<RT> | undefined, t.OutputOf<RT> | undefined, t.InputOf<RT> | undefined> {
    return t.union<[RT, t.UndefinedType]>([type, t.undefined], name);
}

// Apply a validator and get the result in a `Promise`
export function decodeToPromise<T, O, I>(validator: t.Type<T, O, I>, input: I): Promise<T> {
    const result = validator.decode(input);
    return result.fold(
        errors => {
            //ThrowReporter.report(result);
            const messages = PathReporter.report(result);
            return Promise.reject(new Error(messages.join("\n")));
        },
        value => Promise.resolve(value)
    );
}

export function throwErr(notValid: any) {
    ThrowReporter.report(notValid);
}
