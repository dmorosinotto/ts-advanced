'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// TODO replace with fp-ts' Either once published
class HKT {
}
class Left extends HKT {
    constructor(value) {
        super();
        this.value = value;
    }
    map(f) {
        return this;
    }
    //ap<B>(fab: Either<L, (a: A) => B>): Either<L, B> {
    //  return this as any as Either<L, B>
    //}
    chain(f) {
        return this;
    }
    fold(l, r) {
        return l(this.value);
    }
    isLeft() {
        return true;
    }
    isRight() {
        return false;
    }
}
class Right extends HKT {
    constructor(value) {
        super();
        this.value = value;
    }
    map(f) {
        return new Right(f(this.value));
    }
    //ap<B>(fab: Either<L, (a: A) => B>): Either<L, B> {
    //  return fab.fold<Either<L, B>>(<any>identity, f => this.map(f))
    //}
    chain(f) {
        return f(this.value);
    }
    fold(l, r) {
        return r(this.value);
    }
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
}

class Type {
    constructor(
    /** a unique name for this runtime type */
    name, 
    /** a custom type guard */
    is, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate, 
    /** converts a value of type A to a value of type O */
    encode) {
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.encode = encode;
    }
    pipe(ab, name) {
        return new Type(name || `pipe(${this.name}, ${ab.name})`, ab.is, (i, c) => {
            const validation = this.validate(i, c);
            if (validation.isLeft()) {
                return validation;
            }
            else {
                return ab.validate(validation.value, c);
            }
        }, this.encode === identity$1 && ab.encode === identity$1 ? identity$1 : b => this.encode(ab.encode(b)));
    }
    asDecoder() {
        return this;
    }
    asEncoder() {
        return this;
    }
    /** a version of `validate` with a default context */
    decode(i) {
        return this.validate(i, getDefaultContext(this));
    }
}
const identity$1 = (a) => a;
const getFunctionName = (f) => f.displayName || f.name || `<function${f.length}>`;
const getValidationError = (value, context) => ({ value, context });
const getDefaultContext = (type) => [{ key: '', type }];
const appendContext = (c, key, type) => {
    const len = c.length;
    const r = Array(len + 1);
    for (let i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key, type };
    return r;
};
const failures = (errors) => new Left(errors);
const failure = (value, context) => failures([getValidationError(value, context)]);
const success = (value) => new Right(value);
const pushAll = (xs, ys) => {
    const l = ys.length;
    for (let i = 0; i < l; i++) {
        xs.push(ys[i]);
    }
};
//
// basic types
//
class NullType extends Type {
    constructor() {
        super('null', (m) => m === null, (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'NullType';
    }
}
/** @alias `null` */
const nullType = new NullType();
class UndefinedType extends Type {
    constructor() {
        super('undefined', (m) => m === void 0, (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'UndefinedType';
    }
}
const undefinedType = new UndefinedType();
class AnyType extends Type {
    constructor() {
        super('any', (_) => true, success, identity$1);
        this._tag = 'AnyType';
    }
}
const any = new AnyType();
class NeverType extends Type {
    constructor() {
        super('never', (_) => false, (m, c) => failure(m, c), () => {
            throw new Error('cannot serialize never');
        });
        this._tag = 'NeverType';
    }
}
const never = new NeverType();
class StringType extends Type {
    constructor() {
        super('string', (m) => typeof m === 'string', (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'StringType';
    }
}
const string = new StringType();
class NumberType extends Type {
    constructor() {
        super('number', (m) => typeof m === 'number', (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'NumberType';
    }
}
const number = new NumberType();
class BooleanType extends Type {
    constructor() {
        super('boolean', (m) => typeof m === 'boolean', (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'BooleanType';
    }
}
const boolean = new BooleanType();
class AnyArrayType extends Type {
    constructor() {
        super('Array', Array.isArray, (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'AnyArrayType';
    }
}
const arrayType = new AnyArrayType();
class AnyDictionaryType extends Type {
    constructor() {
        super('Dictionary', (m) => m !== null && typeof m === 'object', (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'AnyDictionaryType';
    }
}
const Dictionary = new AnyDictionaryType();
class ObjectType extends Type {
    constructor() {
        super('object', Dictionary.is, Dictionary.validate, identity$1);
        this._tag = 'ObjectType';
    }
}
const object = new ObjectType();
class FunctionType extends Type {
    constructor() {
        super('Function', 
        // tslint:disable-next-line:strict-type-predicates
        (m) => typeof m === 'function', (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity$1);
        this._tag = 'FunctionType';
    }
}
const Function = new FunctionType();
//
// refinements
//
class RefinementType extends Type {
    constructor(name, is, validate, serialize, type, predicate) {
        super(name, is, validate, serialize);
        this.type = type;
        this.predicate = predicate;
        this._tag = 'RefinementType';
    }
}
const refinement = (type, predicate, name = `(${type.name} | ${getFunctionName(predicate)})`) => new RefinementType(name, (m) => type.is(m) && predicate(m), (i, c) => {
    const validation = type.validate(i, c);
    if (validation.isLeft()) {
        return validation;
    }
    else {
        const a = validation.value;
        return predicate(a) ? success(a) : failure(a, c);
    }
}, type.encode, type, predicate);
const Integer = refinement(number, n => n % 1 === 0, 'Integer');
//
// literals
//
class LiteralType extends Type {
    constructor(name, is, validate, serialize, value) {
        super(name, is, validate, serialize);
        this.value = value;
        this._tag = 'LiteralType';
    }
}
const literal = (value, name = JSON.stringify(value)) => {
    const is = (m) => m === value;
    return new LiteralType(name, is, (m, c) => (is(m) ? success(value) : failure(m, c)), identity$1, value);
};
//
// arrays
//
class ArrayType extends Type {
    constructor(name, is, validate, serialize, type) {
        super(name, is, validate, serialize);
        this.type = type;
        this._tag = 'ArrayType';
    }
}
const array = (type, name = `Array<${type.name}>`) => new ArrayType(name, (m) => arrayType.is(m) && m.every(type.is), (m, c) => {
    const arrayValidation = arrayType.validate(m, c);
    if (arrayValidation.isLeft()) {
        return arrayValidation;
    }
    else {
        const xs = arrayValidation.value;
        const len = xs.length;
        let a = xs;
        const errors = [];
        for (let i = 0; i < len; i++) {
            const x = xs[i];
            const validation = type.validate(x, appendContext(c, String(i), type));
            if (validation.isLeft()) {
                pushAll(errors, validation.value);
            }
            else {
                const vx = validation.value;
                if (vx !== x) {
                    if (a === xs) {
                        a = xs.slice();
                    }
                    a[i] = vx;
                }
            }
        }
        return errors.length ? failures(errors) : success(a);
    }
}, type.encode === identity$1 ? identity$1 : a => a.map(type.encode), type);
//
// interfaces
//
class InterfaceType extends Type {
    constructor(name, is, validate, serialize, props) {
        super(name, is, validate, serialize);
        this.props = props;
        this._tag = 'InterfaceType';
    }
}
const getNameFromProps = (props) => `{ ${Object.keys(props)
    .map(k => `${k}: ${props[k].name}`)
    .join(', ')} }`;
const useIdentity = (types, len) => {
    for (let i = 0; i < len; i++) {
        if (types[i].encode !== identity$1) {
            return false;
        }
    }
    return true;
};
/** @alias `interface` */
const type = (props, name = getNameFromProps(props)) => {
    const keys = Object.keys(props);
    const types = keys.map(key => props[key]);
    const len = keys.length;
    return new InterfaceType(name, (m) => {
        if (!Dictionary.is(m)) {
            return false;
        }
        for (let i = 0; i < len; i++) {
            if (!types[i].is(m[keys[i]])) {
                return false;
            }
        }
        return true;
    }, (m, c) => {
        const dictionaryValidation = Dictionary.validate(m, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            const o = dictionaryValidation.value;
            let a = o;
            const errors = [];
            for (let i = 0; i < len; i++) {
                const k = keys[i];
                const ok = o[k];
                const type = types[i];
                const validation = type.validate(ok, appendContext(c, k, type));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    const vok = validation.value;
                    if (vok !== ok) {
                        if (a === o) {
                            a = { ...o };
                        }
                        a[k] = vok;
                    }
                }
            }
            return errors.length ? failures(errors) : success(a);
        }
    }, useIdentity(types, len)
        ? identity$1
        : a => {
            const s = { ...a };
            for (let i = 0; i < len; i++) {
                const k = keys[i];
                const encode = types[i].encode;
                if (encode !== identity$1) {
                    const v = encode(a[k]);
                    if (s[k] !== v) {
                        s[k] = v;
                    }
                }
            }
            return s;
        }, props);
};
//
// unions
//
class UnionType extends Type {
    constructor(name, is, validate, serialize, types) {
        super(name, is, validate, serialize);
        this.types = types;
        this._tag = 'UnionType';
    }
}
const union = (types, name = `(${types.map(type => type.name).join(' | ')})`) => {
    const len = types.length;
    return new UnionType(name, (m) => types.some(type => type.is(m)), (m, c) => {
        const errors = [];
        for (let i = 0; i < len; i++) {
            const type = types[i];
            const validation = type.validate(m, appendContext(c, String(i), type));
            if (validation.isRight()) {
                return validation;
            }
            else {
                pushAll(errors, validation.value);
            }
        }
        return failures(errors);
    }, types.every(type => type.encode === identity$1)
        ? identity$1
        : a => {
            let i = 0;
            for (; i < len - 1; i++) {
                const type = types[i];
                if (type.is(a)) {
                    return type.encode(a);
                }
            }
            return types[i].encode(a);
        }, types);
};
//
// intersections
//
class IntersectionType extends Type {
    constructor(name, is, validate, serialize, types) {
        super(name, is, validate, serialize);
        this.types = types;
        this._tag = 'IntersectionType';
    }
}
function intersection(types, name = `(${types.map(type => type.name).join(' & ')})`) {
    const len = types.length;
    return new IntersectionType(name, (m) => types.every(type => type.is(m)), (m, c) => {
        let a = m;
        const errors = [];
        for (let i = 0; i < len; i++) {
            const type = types[i];
            const validation = type.validate(a, c);
            if (validation.isLeft()) {
                pushAll(errors, validation.value);
            }
            else {
                a = validation.value;
            }
        }
        return errors.length ? failures(errors) : success(a);
    }, types.every(type => type.encode === identity$1)
        ? identity$1
        : a => {
            let s = a;
            for (let i = 0; i < len; i++) {
                const type = types[i];
                s = type.encode(s);
            }
            return s;
        }, types);
}
//
// strict interfaces
//
class StrictType extends Type {
    constructor(name, is, validate, serialize, props) {
        super(name, is, validate, serialize);
        this.props = props;
        this._tag = 'StrictType';
    }
}
const isTagged = (tag) => {
    const f = (type) => {
        if (type instanceof InterfaceType || type instanceof StrictType) {
            return type.props.hasOwnProperty(tag);
        }
        else if (type instanceof IntersectionType) {
            return type.types.some(f);
        }
        else if (type instanceof UnionType) {
            return type.types.every(f);
        }
        else if (type instanceof RefinementType) {
            return f(type.type);
        }
        else {
            return false;
        }
    };
    return f;
};
const findTagged = (tag, types) => {
    const len = types.length;
    const is = isTagged(tag);
    let i = 0;
    for (; i < len - 1; i++) {
        const type = types[i];
        if (is(type)) {
            return type;
        }
    }
    return types[i];
};
const getTagValue = (tag) => {
    const f = (type) => {
        switch (type._tag) {
            case 'InterfaceType':
            case 'StrictType':
                return type.props[tag].value;
            case 'IntersectionType':
                return f(findTagged(tag, type.types));
            case 'UnionType':
                return f(type.types[0]);
            case 'RefinementType':
                return f(type.type);
        }
    };
    return f;
};
const taggedUnion = (tag, types, name = `(${types.map(type => type.name).join(' | ')})`) => {
    const len = types.length;
    const values = new Array(len);
    const hash = {};
    let useHash = true;
    const get = getTagValue(tag);
    for (let i = 0; i < len; i++) {
        const value = get(types[i]);
        useHash = useHash && string.is(value);
        values[i] = value;
        hash[String(value)] = i;
    }
    const isTagValue = useHash
        ? (m) => string.is(m) && hash.hasOwnProperty(m)
        : (m) => values.indexOf(m) !== -1;
    const getIndex = useHash
        ? tag => hash[tag]
        : tag => {
            let i = 0;
            for (; i < len - 1; i++) {
                if (values[i] === tag) {
                    break;
                }
            }
            return i;
        };
    const TagValue = new Type(values.map(l => JSON.stringify(l)).join(' | '), isTagValue, (m, c) => (isTagValue(m) ? success(m) : failure(m, c)), identity$1);
    return new UnionType(name, (v) => {
        if (!Dictionary.is(v)) {
            return false;
        }
        const tagValue = v[tag];
        return TagValue.is(tagValue) && types[getIndex(tagValue)].is(v);
    }, (s, c) => {
        const dictionaryValidation = Dictionary.validate(s, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            const d = dictionaryValidation.value;
            const tagValueValidation = TagValue.validate(d[tag], appendContext(c, tag, TagValue));
            if (tagValueValidation.isLeft()) {
                return tagValueValidation;
            }
            else {
                const i = getIndex(tagValueValidation.value);
                const type = types[i];
                return type.validate(d, appendContext(c, String(i), type));
            }
        }
    }, types.every(type => type.encode === identity$1) ? identity$1 : a => types[getIndex(a[tag])].encode(a), types);
};

/*
 * This is a demonstration of type checking with TypeScript. This example is
 * a Hacker News client.
 *
 * This module may be imported as a library. If run directly it will use some
 * very simple code to print out recent story titles to the command line.
 *
 * Take a look at the accompanying blog post:
 * http://www.olioapps.com/blog/checking-types-against-the-real-world-in-typescript/
 */
/* types and validators */
// Type and validator for IDs. This is just an alias for the `number` type.
const ID_V = number;
// Type and validator for properties common to all Hacker News item types
const ItemCommonV = type({
    by: string,
    id: ID_V,
    time: number,
    dead: optional$1(boolean),
    deleted: optional$1(boolean),
    kids: optional$1(array(ID_V)) // IDs of comments on an item
}, "ItemCommon");
// Type and validator for properties common to stories, job postings, and polls
const TopLevelV = type({
    score: number,
    title: string
}, "TopLevel");
const StoryV = intersection([
    type({
        type: literal("story"),
        descendants: number,
        text: optional$1(string),
        url: optional$1(string) // URL of linked article if the story is not text post
    }),
    ItemCommonV,
    TopLevelV
], "Story");
const JobV = intersection([
    type({
        type: literal("job"),
        text: optional$1(string),
        url: optional$1(string) // URL of linked page if the job is not text post
    }),
    ItemCommonV,
    TopLevelV
], "Job");
const PollV = intersection([
    type({
        type: literal("poll"),
        descendants: number,
        parts: array(ID_V)
    }),
    ItemCommonV,
    TopLevelV
], "Poll");
const CommentV = intersection([
    type({
        type: literal("comment"),
        parent: ID_V,
        text: string // HTML content
    }),
    ItemCommonV
], "Comment");
const PollOptV = intersection([
    type({
        type: literal("pollopt"),
        poll: ID_V,
        score: number,
        text: string // HTML content
    })
], "PollOpt");
const ItemV = taggedUnion("type", // the name of the tag property
[CommentV, JobV, PollV, PollOptV, StoryV], "Item");
/* functions to fetch and display stories and other items */
async function fetchItem(id) {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const obj = await res.json();
    return decodeToPromise(ItemV, obj);
}
function formatItem(item) {
    console.log(item.type, ' -> ');
    switch (item.type) {
        case "story":
            return `"${item.title}" submitted by ${item.by}`;
        case "job":
            return `job posting: ${item.title}`;
        case "poll":
            const numOpts = item.parts.length;
            return `poll: "${item.title}" - choose one of ${numOpts} options`;
        case "pollopt":
            return `poll option: ${item.text}`;
        case "comment":
            const excerpt = item.text.length > 60 ? item.text.slice(0, 60) + "..." : item.text;
            return `${item.by} commented: ${excerpt}`;
    }
}
// Fetch up to 500 of the top stories, jobs, or polls
async function fetchTopStories(count) {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids = await decodeToPromise(array(ID_V), await res.json());
    return Promise.all(ids.slice(0, count).map(id => fetchItem(id)));
}
/* a very basic client */
async function main() {
    try {
        const stories = await fetchTopStories(15);
        for (const story of stories) {
            console.log(formatItem(story) + "\n");
        }
    }
    catch (err) {
        console.error(err.message);
    }
}
main().then(() => console.log("THE END"));
/* utility functions */
// Produces a validator that is a union of the given type with `undefined`
function optional$1(type$$1, name = `${type$$1.name} | undefined`) {
    return union([type$$1, undefinedType], name);
}
// Apply a validator and get the result in a `Promise`
function decodeToPromise(validator, input) {
    const result = validator.decode(input);
    const jsToString = function (value) { return (value === undefined ? 'undefined' : JSON.stringify(value)); };
    const formatValidationError = function (error) {
        var path = error.context
            .map(function (c) { return c.key; })
            .filter(function (key) { return key.length > 0; })
            .join('.');
        // The actual error is last in context
        var errorContext = error.context[error.context.length - 1];
        var expectedType = errorContext.type.name;
        // https://github.com/elm-lang/core/blob/18c9e84e975ed22649888bfad15d1efdb0128ab2/src/Native/Json.js#L199
        // tslint:disable-next-line:prefer-template
        return "Expecting " + expectedType
            + (path === '' ? '' : " at " + path)
            + (" but instead got: " + jsToString(error.value) + ".");
    };
    return result.fold(errors => {
        //const messages = reporter(result);
        const messages = errors.map(formatValidationError);
        return Promise.reject(new Error(messages.join("\n")));
    }, value => Promise.resolve(value));
}
//* MINIMAL IMPLEMENTATION OF fetch IN NODE.js *//
function fetch(url) {
    return new Promise((resolve, reject) => {
        var req = require(url.split("://")[0]); //"http" or "https"
        req.get(encodeURI(url), (res) => {
            var body = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => { body += chunk; });
            res.on("end", () => resolve({
                json: function () {
                    var v;
                    try {
                        v = JSON.parse(body);
                    }
                    catch (e) {
                        v = body;
                    }
                    return Promise.resolve(v);
                }
            }));
        }).on("error", (err) => { reject(err); });
    });
}

exports.ID_V = ID_V;
exports.fetchItem = fetchItem;
exports.fetchTopStories = fetchTopStories;
exports.main = main;
