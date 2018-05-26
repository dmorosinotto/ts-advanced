/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ sync recursive":
/*!**************!*\
  !*** . sync ***!
  \**************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./ sync recursive";

/***/ }),

/***/ "./main.ts":
/*!*****************!*\
  !*** ./main.ts ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//import * as t from "io-ts";
//import { reporter } from "io-ts-reporters";
const t = __importStar(__webpack_require__(/*! ./src */ "./src/index.ts"));
/* types and validators */
// Type and validator for IDs. This is just an alias for the `number` type.
exports.ID_V = t.number;
// Type and validator for properties common to all Hacker News item types
const ItemCommonV = t.type({
    by: t.string,
    id: exports.ID_V,
    time: t.number,
    dead: optional(t.boolean),
    deleted: optional(t.boolean),
    kids: optional(t.array(exports.ID_V)) // IDs of comments on an item
}, "ItemCommon");
// Type and validator for properties common to stories, job postings, and polls
const TopLevelV = t.type({
    score: t.number,
    title: t.string
}, "TopLevel");
const StoryV = t.intersection([
    t.type({
        type: t.literal("story"),
        descendants: t.number,
        text: optional(t.string),
        url: optional(t.string) // URL of linked article if the story is not text post
    }),
    ItemCommonV,
    TopLevelV
], "Story");
const JobV = t.intersection([
    t.type({
        type: t.literal("job"),
        text: optional(t.string),
        url: optional(t.string) // URL of linked page if the job is not text post
    }),
    ItemCommonV,
    TopLevelV
], "Job");
const PollV = t.intersection([
    t.type({
        type: t.literal("poll"),
        descendants: t.number,
        parts: t.array(exports.ID_V)
    }),
    ItemCommonV,
    TopLevelV
], "Poll");
const CommentV = t.intersection([
    t.type({
        type: t.literal("comment"),
        parent: exports.ID_V,
        text: t.string // HTML content
    }),
    ItemCommonV
], "Comment");
const PollOptV = t.intersection([
    t.type({
        type: t.literal("pollopt"),
        poll: exports.ID_V,
        score: t.number,
        text: t.string // HTML content
    })
], "PollOpt");
const ItemV = t.taggedUnion("type", // the name of the tag property
[CommentV, JobV, PollV, PollOptV, StoryV], "Item");
/* functions to fetch and display stories and other items */
async function fetchItem(id) {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const obj = await res.json();
    return decodeToPromise(ItemV, obj);
}
exports.fetchItem = fetchItem;
// If you know the type of the item to be fetched use this function with
// a validator for that specific type.
async function fetchItemType(validator, id) {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const obj = await res.json();
    return decodeToPromise(validator, obj);
}
function getTitle(item) {
    if (item.type === "story") {
        // This works because this line is only reachable if the type of
        // `item.type` is `'story'`, which means that `item` can be expected to
        // have a `title` property.
        return item.title;
    }
}
function formatStory(story) {
    return `"${story.title}" submitted by ${story.by}`;
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
    const ids = await decodeToPromise(t.array(exports.ID_V), await res.json());
    return Promise.all(ids.slice(0, count).map(id => fetchItem(id)));
}
exports.fetchTopStories = fetchTopStories;
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
exports.main = main;
main().then(() => console.log("THE END"));
/* utility functions */
// Produces a validator that is a union of the given type with `undefined`
function optional(type, name = `${type.name} | undefined`) {
    return t.union([type, t.undefined], name);
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
async function fetchTitle(storyId) {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    const data = await res.json();
    // If the data that is fetched does not match the `StoryV` validator then this
    // line will result in a rejected promise.
    const story = await decodeToPromise(StoryV, data);
    // This line does not type-check because TypeScript can infer from the
    // definition of `StoryV` that `story` does not have a property called
    // `descendents`.
    // const ds = story.descendents;
    // TypeScript infers that `story` does have a `title` property with a value of
    // type `string`, so this passes type-checking.
    return story.title;
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


/***/ }),

/***/ "./src/Either.ts":
/*!***********************!*\
  !*** ./src/Either.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO replace with fp-ts' Either once published
Object.defineProperty(exports, "__esModule", { value: true });
class HKT {
}
exports.HKT = HKT;
function identity(a) {
    return a;
}
exports.identity = identity;
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
exports.Left = Left;
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
exports.Right = Right;
function of(a) {
    return new Right(a);
}
exports.of = of;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = __webpack_require__(/*! ./Either */ "./src/Either.ts");
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
        }, this.encode === exports.identity && ab.encode === exports.identity ? exports.identity : b => this.encode(ab.encode(b)));
    }
    asDecoder() {
        return this;
    }
    asEncoder() {
        return this;
    }
    /** a version of `validate` with a default context */
    decode(i) {
        return this.validate(i, exports.getDefaultContext(this));
    }
}
exports.Type = Type;
exports.identity = (a) => a;
exports.getFunctionName = (f) => f.displayName || f.name || `<function${f.length}>`;
exports.getContextEntry = (key, type) => ({ key, type });
exports.getValidationError = (value, context) => ({ value, context });
exports.getDefaultContext = (type) => [{ key: '', type }];
exports.appendContext = (c, key, type) => {
    const len = c.length;
    const r = Array(len + 1);
    for (let i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key, type };
    return r;
};
exports.failures = (errors) => new Either_1.Left(errors);
exports.failure = (value, context) => exports.failures([exports.getValidationError(value, context)]);
exports.success = (value) => new Either_1.Right(value);
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
        super('null', (m) => m === null, (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'NullType';
    }
}
exports.NullType = NullType;
/** @alias `null` */
exports.nullType = new NullType();
exports.null = exports.nullType;
class UndefinedType extends Type {
    constructor() {
        super('undefined', (m) => m === void 0, (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'UndefinedType';
    }
}
exports.UndefinedType = UndefinedType;
const undefinedType = new UndefinedType();
exports.undefined = undefinedType;
class AnyType extends Type {
    constructor() {
        super('any', (_) => true, exports.success, exports.identity);
        this._tag = 'AnyType';
    }
}
exports.AnyType = AnyType;
exports.any = new AnyType();
class NeverType extends Type {
    constructor() {
        super('never', (_) => false, (m, c) => exports.failure(m, c), () => {
            throw new Error('cannot serialize never');
        });
        this._tag = 'NeverType';
    }
}
exports.NeverType = NeverType;
exports.never = new NeverType();
class StringType extends Type {
    constructor() {
        super('string', (m) => typeof m === 'string', (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'StringType';
    }
}
exports.StringType = StringType;
exports.string = new StringType();
class NumberType extends Type {
    constructor() {
        super('number', (m) => typeof m === 'number', (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'NumberType';
    }
}
exports.NumberType = NumberType;
exports.number = new NumberType();
class BooleanType extends Type {
    constructor() {
        super('boolean', (m) => typeof m === 'boolean', (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'BooleanType';
    }
}
exports.BooleanType = BooleanType;
exports.boolean = new BooleanType();
class AnyArrayType extends Type {
    constructor() {
        super('Array', Array.isArray, (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'AnyArrayType';
    }
}
exports.AnyArrayType = AnyArrayType;
const arrayType = new AnyArrayType();
exports.Array = arrayType;
class AnyDictionaryType extends Type {
    constructor() {
        super('Dictionary', (m) => m !== null && typeof m === 'object', (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'AnyDictionaryType';
    }
}
exports.AnyDictionaryType = AnyDictionaryType;
exports.Dictionary = new AnyDictionaryType();
class ObjectType extends Type {
    constructor() {
        super('object', exports.Dictionary.is, exports.Dictionary.validate, exports.identity);
        this._tag = 'ObjectType';
    }
}
exports.ObjectType = ObjectType;
exports.object = new ObjectType();
class FunctionType extends Type {
    constructor() {
        super('Function', 
        // tslint:disable-next-line:strict-type-predicates
        (m) => typeof m === 'function', (m, c) => (this.is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
        this._tag = 'FunctionType';
    }
}
exports.FunctionType = FunctionType;
exports.Function = new FunctionType();
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
exports.RefinementType = RefinementType;
exports.refinement = (type, predicate, name = `(${type.name} | ${exports.getFunctionName(predicate)})`) => new RefinementType(name, (m) => type.is(m) && predicate(m), (i, c) => {
    const validation = type.validate(i, c);
    if (validation.isLeft()) {
        return validation;
    }
    else {
        const a = validation.value;
        return predicate(a) ? exports.success(a) : exports.failure(a, c);
    }
}, type.encode, type, predicate);
exports.Integer = exports.refinement(exports.number, n => n % 1 === 0, 'Integer');
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
exports.LiteralType = LiteralType;
exports.literal = (value, name = JSON.stringify(value)) => {
    const is = (m) => m === value;
    return new LiteralType(name, is, (m, c) => (is(m) ? exports.success(value) : exports.failure(m, c)), exports.identity, value);
};
//
// keyof
//
class KeyofType extends Type {
    constructor(name, is, validate, serialize, keys) {
        super(name, is, validate, serialize);
        this.keys = keys;
        this._tag = 'KeyofType';
    }
}
exports.KeyofType = KeyofType;
exports.keyof = (keys, name = `(keyof ${JSON.stringify(Object.keys(keys))})`) => {
    const is = (m) => exports.string.is(m) && keys.hasOwnProperty(m);
    return new KeyofType(name, is, (m, c) => (is(m) ? exports.success(m) : exports.failure(m, c)), exports.identity, keys);
};
//
// recursive types
//
class RecursiveType extends Type {
    constructor(name, is, validate, serialize, runDefinition) {
        super(name, is, validate, serialize);
        this.runDefinition = runDefinition;
        this._tag = 'RecursiveType';
    }
    get type() {
        return this.runDefinition();
    }
}
exports.RecursiveType = RecursiveType;
exports.recursion = (name, definition) => {
    let cache;
    const runDefinition = () => {
        if (!cache) {
            cache = definition(Self);
        }
        return cache;
    };
    const Self = new RecursiveType(name, (m) => runDefinition().is(m), (m, c) => runDefinition().validate(m, c), a => runDefinition().encode(a), runDefinition);
    return Self;
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
exports.ArrayType = ArrayType;
exports.array = (type, name = `Array<${type.name}>`) => new ArrayType(name, (m) => arrayType.is(m) && m.every(type.is), (m, c) => {
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
            const validation = type.validate(x, exports.appendContext(c, String(i), type));
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
        return errors.length ? exports.failures(errors) : exports.success(a);
    }
}, type.encode === exports.identity ? exports.identity : a => a.map(type.encode), type);
//
// optionals
//
class OptionalType extends Type {
    constructor(name, is, validate, serialize, type) {
        super(name, is, validate, serialize);
        this.type = type;
        this._tag = 'OptionalType';
    }
}
exports.OptionalType = OptionalType;
exports.optional = (type, name = `${type.name}?`) => new OptionalType(name, (m) => undefinedType.is(m) || type.is(m), (i, c) => {
    if (undefinedType.is(i)) {
        return exports.success(i);
    }
    else {
        return type.validate(i, c);
    }
}, type.encode === exports.identity ? exports.identity : a => (undefinedType.is(a) ? a : type.encode(a)), type);
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
exports.InterfaceType = InterfaceType;
const getNameFromProps = (props) => `{ ${Object.keys(props)
    .map(k => `${k}: ${props[k].name}`)
    .join(', ')} }`;
const useIdentity = (types, len) => {
    for (let i = 0; i < len; i++) {
        if (types[i].encode !== exports.identity) {
            return false;
        }
    }
    return true;
};
/** @alias `interface` */
exports.type = (props, name = getNameFromProps(props)) => {
    const keys = Object.keys(props);
    const types = keys.map(key => props[key]);
    const len = keys.length;
    return new InterfaceType(name, (m) => {
        if (!exports.Dictionary.is(m)) {
            return false;
        }
        for (let i = 0; i < len; i++) {
            if (!types[i].is(m[keys[i]])) {
                return false;
            }
        }
        return true;
    }, (m, c) => {
        const dictionaryValidation = exports.Dictionary.validate(m, c);
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
                const validation = type.validate(ok, exports.appendContext(c, k, type));
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
            return errors.length ? exports.failures(errors) : exports.success(a);
        }
    }, useIdentity(types, len)
        ? exports.identity
        : a => {
            const s = { ...a };
            for (let i = 0; i < len; i++) {
                const k = keys[i];
                const encode = types[i].encode;
                if (encode !== exports.identity) {
                    const v = encode(a[k]);
                    if (s[k] !== v) {
                        s[k] = v;
                    }
                }
            }
            return s;
        }, props);
};
exports.interface = exports.type;
//
// partials
//
class PartialType extends Type {
    constructor(name, is, validate, serialize, props) {
        super(name, is, validate, serialize);
        this.props = props;
        this._tag = 'PartialType';
    }
}
exports.PartialType = PartialType;
exports.partial = (props, name = `PartialType<${getNameFromProps(props)}>`) => {
    const keys = Object.keys(props);
    const types = keys.map(key => props[key]);
    const len = keys.length;
    const partials = {};
    for (let i = 0; i < len; i++) {
        partials[keys[i]] = exports.union([types[i], undefinedType]);
    }
    const partial = exports.type(partials);
    return new PartialType(name, partial.is, partial.validate, useIdentity(types, len)
        ? exports.identity
        : a => {
            const s = {};
            for (let i = 0; i < len; i++) {
                const k = keys[i];
                const ak = a[k];
                if (ak !== undefined) {
                    s[k] = types[i].encode(ak);
                }
            }
            return s;
        }, props);
};
//
// dictionaries
//
class DictionaryType extends Type {
    constructor(name, is, validate, serialize, domain, codomain) {
        super(name, is, validate, serialize);
        this.domain = domain;
        this.codomain = codomain;
        this._tag = 'DictionaryType';
    }
}
exports.DictionaryType = DictionaryType;
exports.dictionary = (domain, codomain, name = `{ [K in ${domain.name}]: ${codomain.name} }`) => new DictionaryType(name, (m) => exports.Dictionary.is(m) && Object.keys(m).every(k => domain.is(k) && codomain.is(m[k])), (m, c) => {
    const dictionaryValidation = exports.Dictionary.validate(m, c);
    if (dictionaryValidation.isLeft()) {
        return dictionaryValidation;
    }
    else {
        const o = dictionaryValidation.value;
        const a = {};
        const errors = [];
        const keys = Object.keys(o);
        const len = keys.length;
        let changed = false;
        for (let i = 0; i < len; i++) {
            let k = keys[i];
            const ok = o[k];
            const domainValidation = domain.validate(k, exports.appendContext(c, k, domain));
            const codomainValidation = codomain.validate(ok, exports.appendContext(c, k, codomain));
            if (domainValidation.isLeft()) {
                pushAll(errors, domainValidation.value);
            }
            else {
                const vk = domainValidation.value;
                changed = changed || vk !== k;
                k = vk;
            }
            if (codomainValidation.isLeft()) {
                pushAll(errors, codomainValidation.value);
            }
            else {
                const vok = codomainValidation.value;
                changed = changed || vok !== ok;
                a[k] = vok;
            }
        }
        return errors.length ? exports.failures(errors) : exports.success((changed ? a : o));
    }
}, domain.encode === exports.identity && codomain.encode === exports.identity
    ? exports.identity
    : a => {
        const s = {};
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
            const k = keys[i];
            s[String(domain.encode(k))] = codomain.encode(a[k]);
        }
        return s;
    }, domain, codomain);
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
exports.UnionType = UnionType;
exports.union = (types, name = `(${types.map(type => type.name).join(' | ')})`) => {
    const len = types.length;
    return new UnionType(name, (m) => types.some(type => type.is(m)), (m, c) => {
        const errors = [];
        for (let i = 0; i < len; i++) {
            const type = types[i];
            const validation = type.validate(m, exports.appendContext(c, String(i), type));
            if (validation.isRight()) {
                return validation;
            }
            else {
                pushAll(errors, validation.value);
            }
        }
        return exports.failures(errors);
    }, types.every(type => type.encode === exports.identity)
        ? exports.identity
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
exports.IntersectionType = IntersectionType;
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
        return errors.length ? exports.failures(errors) : exports.success(a);
    }, types.every(type => type.encode === exports.identity)
        ? exports.identity
        : a => {
            let s = a;
            for (let i = 0; i < len; i++) {
                const type = types[i];
                s = type.encode(s);
            }
            return s;
        }, types);
}
exports.intersection = intersection;
//
// tuples
//
class TupleType extends Type {
    constructor(name, is, validate, serialize, types) {
        super(name, is, validate, serialize);
        this.types = types;
        this._tag = 'TupleType';
    }
}
exports.TupleType = TupleType;
function tuple(types, name = `[${types.map(type => type.name).join(', ')}]`) {
    const len = types.length;
    return new TupleType(name, (m) => arrayType.is(m) && m.length === len && types.every((type, i) => type.is(m[i])), (m, c) => {
        const arrayValidation = arrayType.validate(m, c);
        if (arrayValidation.isLeft()) {
            return arrayValidation;
        }
        else {
            const as = arrayValidation.value;
            let t = as;
            const errors = [];
            for (let i = 0; i < len; i++) {
                const a = as[i];
                const type = types[i];
                const validation = type.validate(a, exports.appendContext(c, String(i), type));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    const va = validation.value;
                    if (va !== a) {
                        if (t === as) {
                            t = as.slice();
                        }
                        t[i] = va;
                    }
                }
            }
            if (as.length > len) {
                errors.push(exports.getValidationError(as[len], exports.appendContext(c, String(len), exports.never)));
            }
            return errors.length ? exports.failures(errors) : exports.success(t);
        }
    }, types.every(type => type.encode === exports.identity) ? exports.identity : a => types.map((type, i) => type.encode(a[i])), types);
}
exports.tuple = tuple;
//
// readonly objects
//
class ReadonlyType extends Type {
    constructor(name, is, validate, serialize, type) {
        super(name, is, validate, serialize);
        this.type = type;
        this._tag = 'ReadonlyType';
    }
}
exports.ReadonlyType = ReadonlyType;
exports.readonly = (type, name = `Readonly<${type.name}>`) => new ReadonlyType(name, type.is, (m, c) => type.validate(m, c).map(x => {
    if (true) {
        return Object.freeze(x);
    }
    return x;
}), type.encode === exports.identity ? exports.identity : type.encode, type);
//
// readonly arrays
//
class ReadonlyArrayType extends Type {
    constructor(name, is, validate, serialize, type) {
        super(name, is, validate, serialize);
        this.type = type;
        this._tag = 'ReadonlyArrayType';
    }
}
exports.ReadonlyArrayType = ReadonlyArrayType;
exports.readonlyArray = (type, name = `ReadonlyArray<${type.name}>`) => {
    const arrayType = exports.array(type);
    return new ReadonlyArrayType(name, arrayType.is, (m, c) => arrayType.validate(m, c).map(x => {
        if (true) {
            return Object.freeze(x);
        }
        else {}
    }), arrayType.encode, type);
};
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
exports.StrictType = StrictType;
/** Specifies that only the given interface properties are allowed */
exports.strict = (props, name = `StrictType<${getNameFromProps(props)}>`) => {
    const loose = exports.type(props);
    return new StrictType(name, (m) => loose.is(m) && Object.getOwnPropertyNames(m).every(k => props.hasOwnProperty(k)), (m, c) => {
        const looseValidation = loose.validate(m, c);
        if (looseValidation.isLeft()) {
            return looseValidation;
        }
        else {
            const o = looseValidation.value;
            const keys = Object.getOwnPropertyNames(o);
            const len = keys.length;
            const errors = [];
            for (let i = 0; i < len; i++) {
                const key = keys[i];
                if (!props.hasOwnProperty(key)) {
                    errors.push(exports.getValidationError(o[key], exports.appendContext(c, key, exports.never)));
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(o);
        }
    }, loose.encode, props);
};
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
exports.taggedUnion = (tag, types, name = `(${types.map(type => type.name).join(' | ')})`) => {
    const len = types.length;
    const values = new Array(len);
    const hash = {};
    let useHash = true;
    const get = getTagValue(tag);
    for (let i = 0; i < len; i++) {
        const value = get(types[i]);
        useHash = useHash && exports.string.is(value);
        values[i] = value;
        hash[String(value)] = i;
    }
    const isTagValue = useHash
        ? (m) => exports.string.is(m) && hash.hasOwnProperty(m)
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
    const TagValue = new Type(values.map(l => JSON.stringify(l)).join(' | '), isTagValue, (m, c) => (isTagValue(m) ? exports.success(m) : exports.failure(m, c)), exports.identity);
    return new UnionType(name, (v) => {
        if (!exports.Dictionary.is(v)) {
            return false;
        }
        const tagValue = v[tag];
        return TagValue.is(tagValue) && types[getIndex(tagValue)].is(v);
    }, (s, c) => {
        const dictionaryValidation = exports.Dictionary.validate(s, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            const d = dictionaryValidation.value;
            const tagValueValidation = TagValue.validate(d[tag], exports.appendContext(c, tag, TagValue));
            if (tagValueValidation.isLeft()) {
                return tagValueValidation;
            }
            else {
                const i = getIndex(tagValueValidation.value);
                const type = types[i];
                return type.validate(d, exports.appendContext(c, String(i), type));
            }
        }
    }, types.every(type => type.encode === exports.identity) ? exports.identity : a => types[getIndex(a[tag])].encode(a), types);
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4gc3luYyIsIndlYnBhY2s6Ly8vLi9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9FaXRoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxXQUFXO0FBQ2xEO0FBQ0E7QUFDQSw2Qzs7Ozs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFdBQVc7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtB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LHdDQUF3QyxnQkFBZ0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUI7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFVBQVUsS0FBSyxtQ0FBbUM7QUFDcEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBLDhDQUE4Qyx3QkFBd0I7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixTQUFTO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxhQUFhO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMseUNBQXlDO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsYUFBYTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9tYWluLnRzXCIpO1xuIiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIG1vZHVsZSBcIicgKyByZXEgKyAnXCIuJyk7XG5cdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0dGhyb3cgZTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gW107IH07XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IFwiLi8gc3luYyByZWN1cnNpdmVcIjsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XG4gICAgcmVzdWx0W1wiZGVmYXVsdFwiXSA9IG1vZDtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qXG4gKiBUaGlzIGlzIGEgZGVtb25zdHJhdGlvbiBvZiB0eXBlIGNoZWNraW5nIHdpdGggVHlwZVNjcmlwdC4gVGhpcyBleGFtcGxlIGlzXG4gKiBhIEhhY2tlciBOZXdzIGNsaWVudC5cbiAqXG4gKiBUaGlzIG1vZHVsZSBtYXkgYmUgaW1wb3J0ZWQgYXMgYSBsaWJyYXJ5LiBJZiBydW4gZGlyZWN0bHkgaXQgd2lsbCB1c2Ugc29tZVxuICogdmVyeSBzaW1wbGUgY29kZSB0byBwcmludCBvdXQgcmVjZW50IHN0b3J5IHRpdGxlcyB0byB0aGUgY29tbWFuZCBsaW5lLlxuICpcbiAqIFRha2UgYSBsb29rIGF0IHRoZSBhY2NvbXBhbnlpbmcgYmxvZyBwb3N0OlxuICogaHR0cDovL3d3dy5vbGlvYXBwcy5jb20vYmxvZy9jaGVja2luZy10eXBlcy1hZ2FpbnN0LXRoZS1yZWFsLXdvcmxkLWluLXR5cGVzY3JpcHQvXG4gKi9cbi8vaW1wb3J0ICogYXMgdCBmcm9tIFwiaW8tdHNcIjtcbi8vaW1wb3J0IHsgcmVwb3J0ZXIgfSBmcm9tIFwiaW8tdHMtcmVwb3J0ZXJzXCI7XG5jb25zdCB0ID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyY1wiKSk7XG4vKiB0eXBlcyBhbmQgdmFsaWRhdG9ycyAqL1xuLy8gVHlwZSBhbmQgdmFsaWRhdG9yIGZvciBJRHMuIFRoaXMgaXMganVzdCBhbiBhbGlhcyBmb3IgdGhlIGBudW1iZXJgIHR5cGUuXG5leHBvcnRzLklEX1YgPSB0Lm51bWJlcjtcbi8vIFR5cGUgYW5kIHZhbGlkYXRvciBmb3IgcHJvcGVydGllcyBjb21tb24gdG8gYWxsIEhhY2tlciBOZXdzIGl0ZW0gdHlwZXNcbmNvbnN0IEl0ZW1Db21tb25WID0gdC50eXBlKHtcbiAgICBieTogdC5zdHJpbmcsXG4gICAgaWQ6IGV4cG9ydHMuSURfVixcbiAgICB0aW1lOiB0Lm51bWJlcixcbiAgICBkZWFkOiBvcHRpb25hbCh0LmJvb2xlYW4pLFxuICAgIGRlbGV0ZWQ6IG9wdGlvbmFsKHQuYm9vbGVhbiksXG4gICAga2lkczogb3B0aW9uYWwodC5hcnJheShleHBvcnRzLklEX1YpKSAvLyBJRHMgb2YgY29tbWVudHMgb24gYW4gaXRlbVxufSwgXCJJdGVtQ29tbW9uXCIpO1xuLy8gVHlwZSBhbmQgdmFsaWRhdG9yIGZvciBwcm9wZXJ0aWVzIGNvbW1vbiB0byBzdG9yaWVzLCBqb2IgcG9zdGluZ3MsIGFuZCBwb2xsc1xuY29uc3QgVG9wTGV2ZWxWID0gdC50eXBlKHtcbiAgICBzY29yZTogdC5udW1iZXIsXG4gICAgdGl0bGU6IHQuc3RyaW5nXG59LCBcIlRvcExldmVsXCIpO1xuY29uc3QgU3RvcnlWID0gdC5pbnRlcnNlY3Rpb24oW1xuICAgIHQudHlwZSh7XG4gICAgICAgIHR5cGU6IHQubGl0ZXJhbChcInN0b3J5XCIpLFxuICAgICAgICBkZXNjZW5kYW50czogdC5udW1iZXIsXG4gICAgICAgIHRleHQ6IG9wdGlvbmFsKHQuc3RyaW5nKSxcbiAgICAgICAgdXJsOiBvcHRpb25hbCh0LnN0cmluZykgLy8gVVJMIG9mIGxpbmtlZCBhcnRpY2xlIGlmIHRoZSBzdG9yeSBpcyBub3QgdGV4dCBwb3N0XG4gICAgfSksXG4gICAgSXRlbUNvbW1vblYsXG4gICAgVG9wTGV2ZWxWXG5dLCBcIlN0b3J5XCIpO1xuY29uc3QgSm9iViA9IHQuaW50ZXJzZWN0aW9uKFtcbiAgICB0LnR5cGUoe1xuICAgICAgICB0eXBlOiB0LmxpdGVyYWwoXCJqb2JcIiksXG4gICAgICAgIHRleHQ6IG9wdGlvbmFsKHQuc3RyaW5nKSxcbiAgICAgICAgdXJsOiBvcHRpb25hbCh0LnN0cmluZykgLy8gVVJMIG9mIGxpbmtlZCBwYWdlIGlmIHRoZSBqb2IgaXMgbm90IHRleHQgcG9zdFxuICAgIH0pLFxuICAgIEl0ZW1Db21tb25WLFxuICAgIFRvcExldmVsVlxuXSwgXCJKb2JcIik7XG5jb25zdCBQb2xsViA9IHQuaW50ZXJzZWN0aW9uKFtcbiAgICB0LnR5cGUoe1xuICAgICAgICB0eXBlOiB0LmxpdGVyYWwoXCJwb2xsXCIpLFxuICAgICAgICBkZXNjZW5kYW50czogdC5udW1iZXIsXG4gICAgICAgIHBhcnRzOiB0LmFycmF5KGV4cG9ydHMuSURfVilcbiAgICB9KSxcbiAgICBJdGVtQ29tbW9uVixcbiAgICBUb3BMZXZlbFZcbl0sIFwiUG9sbFwiKTtcbmNvbnN0IENvbW1lbnRWID0gdC5pbnRlcnNlY3Rpb24oW1xuICAgIHQudHlwZSh7XG4gICAgICAgIHR5cGU6IHQubGl0ZXJhbChcImNvbW1lbnRcIiksXG4gICAgICAgIHBhcmVudDogZXhwb3J0cy5JRF9WLFxuICAgICAgICB0ZXh0OiB0LnN0cmluZyAvLyBIVE1MIGNvbnRlbnRcbiAgICB9KSxcbiAgICBJdGVtQ29tbW9uVlxuXSwgXCJDb21tZW50XCIpO1xuY29uc3QgUG9sbE9wdFYgPSB0LmludGVyc2VjdGlvbihbXG4gICAgdC50eXBlKHtcbiAgICAgICAgdHlwZTogdC5saXRlcmFsKFwicG9sbG9wdFwiKSxcbiAgICAgICAgcG9sbDogZXhwb3J0cy5JRF9WLFxuICAgICAgICBzY29yZTogdC5udW1iZXIsXG4gICAgICAgIHRleHQ6IHQuc3RyaW5nIC8vIEhUTUwgY29udGVudFxuICAgIH0pXG5dLCBcIlBvbGxPcHRcIik7XG5jb25zdCBJdGVtViA9IHQudGFnZ2VkVW5pb24oXCJ0eXBlXCIsIC8vIHRoZSBuYW1lIG9mIHRoZSB0YWcgcHJvcGVydHlcbltDb21tZW50ViwgSm9iViwgUG9sbFYsIFBvbGxPcHRWLCBTdG9yeVZdLCBcIkl0ZW1cIik7XG4vKiBmdW5jdGlvbnMgdG8gZmV0Y2ggYW5kIGRpc3BsYXkgc3RvcmllcyBhbmQgb3RoZXIgaXRlbXMgKi9cbmFzeW5jIGZ1bmN0aW9uIGZldGNoSXRlbShpZCkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGBodHRwczovL2hhY2tlci1uZXdzLmZpcmViYXNlaW8uY29tL3YwL2l0ZW0vJHtpZH0uanNvbmApO1xuICAgIGNvbnN0IG9iaiA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgcmV0dXJuIGRlY29kZVRvUHJvbWlzZShJdGVtViwgb2JqKTtcbn1cbmV4cG9ydHMuZmV0Y2hJdGVtID0gZmV0Y2hJdGVtO1xuLy8gSWYgeW91IGtub3cgdGhlIHR5cGUgb2YgdGhlIGl0ZW0gdG8gYmUgZmV0Y2hlZCB1c2UgdGhpcyBmdW5jdGlvbiB3aXRoXG4vLyBhIHZhbGlkYXRvciBmb3IgdGhhdCBzcGVjaWZpYyB0eXBlLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hJdGVtVHlwZSh2YWxpZGF0b3IsIGlkKSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vaGFja2VyLW5ld3MuZmlyZWJhc2Vpby5jb20vdjAvaXRlbS8ke2lkfS5qc29uYCk7XG4gICAgY29uc3Qgb2JqID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICByZXR1cm4gZGVjb2RlVG9Qcm9taXNlKHZhbGlkYXRvciwgb2JqKTtcbn1cbmZ1bmN0aW9uIGdldFRpdGxlKGl0ZW0pIHtcbiAgICBpZiAoaXRlbS50eXBlID09PSBcInN0b3J5XCIpIHtcbiAgICAgICAgLy8gVGhpcyB3b3JrcyBiZWNhdXNlIHRoaXMgbGluZSBpcyBvbmx5IHJlYWNoYWJsZSBpZiB0aGUgdHlwZSBvZlxuICAgICAgICAvLyBgaXRlbS50eXBlYCBpcyBgJ3N0b3J5J2AsIHdoaWNoIG1lYW5zIHRoYXQgYGl0ZW1gIGNhbiBiZSBleHBlY3RlZCB0b1xuICAgICAgICAvLyBoYXZlIGEgYHRpdGxlYCBwcm9wZXJ0eS5cbiAgICAgICAgcmV0dXJuIGl0ZW0udGl0bGU7XG4gICAgfVxufVxuZnVuY3Rpb24gZm9ybWF0U3Rvcnkoc3RvcnkpIHtcbiAgICByZXR1cm4gYFwiJHtzdG9yeS50aXRsZX1cIiBzdWJtaXR0ZWQgYnkgJHtzdG9yeS5ieX1gO1xufVxuZnVuY3Rpb24gZm9ybWF0SXRlbShpdGVtKSB7XG4gICAgY29uc29sZS5sb2coaXRlbS50eXBlLCAnIC0+ICcpO1xuICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzdG9yeVwiOlxuICAgICAgICAgICAgcmV0dXJuIGBcIiR7aXRlbS50aXRsZX1cIiBzdWJtaXR0ZWQgYnkgJHtpdGVtLmJ5fWA7XG4gICAgICAgIGNhc2UgXCJqb2JcIjpcbiAgICAgICAgICAgIHJldHVybiBgam9iIHBvc3Rpbmc6ICR7aXRlbS50aXRsZX1gO1xuICAgICAgICBjYXNlIFwicG9sbFwiOlxuICAgICAgICAgICAgY29uc3QgbnVtT3B0cyA9IGl0ZW0ucGFydHMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGBwb2xsOiBcIiR7aXRlbS50aXRsZX1cIiAtIGNob29zZSBvbmUgb2YgJHtudW1PcHRzfSBvcHRpb25zYDtcbiAgICAgICAgY2FzZSBcInBvbGxvcHRcIjpcbiAgICAgICAgICAgIHJldHVybiBgcG9sbCBvcHRpb246ICR7aXRlbS50ZXh0fWA7XG4gICAgICAgIGNhc2UgXCJjb21tZW50XCI6XG4gICAgICAgICAgICBjb25zdCBleGNlcnB0ID0gaXRlbS50ZXh0Lmxlbmd0aCA+IDYwID8gaXRlbS50ZXh0LnNsaWNlKDAsIDYwKSArIFwiLi4uXCIgOiBpdGVtLnRleHQ7XG4gICAgICAgICAgICByZXR1cm4gYCR7aXRlbS5ieX0gY29tbWVudGVkOiAke2V4Y2VycHR9YDtcbiAgICB9XG59XG4vLyBGZXRjaCB1cCB0byA1MDAgb2YgdGhlIHRvcCBzdG9yaWVzLCBqb2JzLCBvciBwb2xsc1xuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb3BTdG9yaWVzKGNvdW50KSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2hhY2tlci1uZXdzLmZpcmViYXNlaW8uY29tL3YwL3RvcHN0b3JpZXMuanNvblwiKTtcbiAgICBjb25zdCBpZHMgPSBhd2FpdCBkZWNvZGVUb1Byb21pc2UodC5hcnJheShleHBvcnRzLklEX1YpLCBhd2FpdCByZXMuanNvbigpKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoaWRzLnNsaWNlKDAsIGNvdW50KS5tYXAoaWQgPT4gZmV0Y2hJdGVtKGlkKSkpO1xufVxuZXhwb3J0cy5mZXRjaFRvcFN0b3JpZXMgPSBmZXRjaFRvcFN0b3JpZXM7XG4vKiBhIHZlcnkgYmFzaWMgY2xpZW50ICovXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHN0b3JpZXMgPSBhd2FpdCBmZXRjaFRvcFN0b3JpZXMoMTUpO1xuICAgICAgICBmb3IgKGNvbnN0IHN0b3J5IG9mIHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZvcm1hdEl0ZW0oc3RvcnkpICsgXCJcXG5cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9XG59XG5leHBvcnRzLm1haW4gPSBtYWluO1xubWFpbigpLnRoZW4oKCkgPT4gY29uc29sZS5sb2coXCJUSEUgRU5EXCIpKTtcbi8qIHV0aWxpdHkgZnVuY3Rpb25zICovXG4vLyBQcm9kdWNlcyBhIHZhbGlkYXRvciB0aGF0IGlzIGEgdW5pb24gb2YgdGhlIGdpdmVuIHR5cGUgd2l0aCBgdW5kZWZpbmVkYFxuZnVuY3Rpb24gb3B0aW9uYWwodHlwZSwgbmFtZSA9IGAke3R5cGUubmFtZX0gfCB1bmRlZmluZWRgKSB7XG4gICAgcmV0dXJuIHQudW5pb24oW3R5cGUsIHQudW5kZWZpbmVkXSwgbmFtZSk7XG59XG4vLyBBcHBseSBhIHZhbGlkYXRvciBhbmQgZ2V0IHRoZSByZXN1bHQgaW4gYSBgUHJvbWlzZWBcbmZ1bmN0aW9uIGRlY29kZVRvUHJvbWlzZSh2YWxpZGF0b3IsIGlucHV0KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdG9yLmRlY29kZShpbnB1dCk7XG4gICAgY29uc3QganNUb1N0cmluZyA9IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gKHZhbHVlID09PSB1bmRlZmluZWQgPyAndW5kZWZpbmVkJyA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7IH07XG4gICAgY29uc3QgZm9ybWF0VmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHZhciBwYXRoID0gZXJyb3IuY29udGV4dFxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5rZXk7IH0pXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGtleS5sZW5ndGggPiAwOyB9KVxuICAgICAgICAgICAgLmpvaW4oJy4nKTtcbiAgICAgICAgLy8gVGhlIGFjdHVhbCBlcnJvciBpcyBsYXN0IGluIGNvbnRleHRcbiAgICAgICAgdmFyIGVycm9yQ29udGV4dCA9IGVycm9yLmNvbnRleHRbZXJyb3IuY29udGV4dC5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIGV4cGVjdGVkVHlwZSA9IGVycm9yQ29udGV4dC50eXBlLm5hbWU7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lbG0tbGFuZy9jb3JlL2Jsb2IvMThjOWU4NGU5NzVlZDIyNjQ5ODg4YmZhZDE1ZDFlZmRiMDEyOGFiMi9zcmMvTmF0aXZlL0pzb24uanMjTDE5OVxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLXRlbXBsYXRlXG4gICAgICAgIHJldHVybiBcIkV4cGVjdGluZyBcIiArIGV4cGVjdGVkVHlwZVxuICAgICAgICAgICAgKyAocGF0aCA9PT0gJycgPyAnJyA6IFwiIGF0IFwiICsgcGF0aClcbiAgICAgICAgICAgICsgKFwiIGJ1dCBpbnN0ZWFkIGdvdDogXCIgKyBqc1RvU3RyaW5nKGVycm9yLnZhbHVlKSArIFwiLlwiKTtcbiAgICB9O1xuICAgIHJldHVybiByZXN1bHQuZm9sZChlcnJvcnMgPT4ge1xuICAgICAgICAvL2NvbnN0IG1lc3NhZ2VzID0gcmVwb3J0ZXIocmVzdWx0KTtcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBlcnJvcnMubWFwKGZvcm1hdFZhbGlkYXRpb25FcnJvcik7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IobWVzc2FnZXMuam9pbihcIlxcblwiKSkpO1xuICAgIH0sIHZhbHVlID0+IFByb21pc2UucmVzb2x2ZSh2YWx1ZSkpO1xufVxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUaXRsZShzdG9yeUlkKSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vaGFja2VyLW5ld3MuZmlyZWJhc2Vpby5jb20vdjAvaXRlbS8ke3N0b3J5SWR9Lmpzb25gKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAvLyBJZiB0aGUgZGF0YSB0aGF0IGlzIGZldGNoZWQgZG9lcyBub3QgbWF0Y2ggdGhlIGBTdG9yeVZgIHZhbGlkYXRvciB0aGVuIHRoaXNcbiAgICAvLyBsaW5lIHdpbGwgcmVzdWx0IGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICBjb25zdCBzdG9yeSA9IGF3YWl0IGRlY29kZVRvUHJvbWlzZShTdG9yeVYsIGRhdGEpO1xuICAgIC8vIFRoaXMgbGluZSBkb2VzIG5vdCB0eXBlLWNoZWNrIGJlY2F1c2UgVHlwZVNjcmlwdCBjYW4gaW5mZXIgZnJvbSB0aGVcbiAgICAvLyBkZWZpbml0aW9uIG9mIGBTdG9yeVZgIHRoYXQgYHN0b3J5YCBkb2VzIG5vdCBoYXZlIGEgcHJvcGVydHkgY2FsbGVkXG4gICAgLy8gYGRlc2NlbmRlbnRzYC5cbiAgICAvLyBjb25zdCBkcyA9IHN0b3J5LmRlc2NlbmRlbnRzO1xuICAgIC8vIFR5cGVTY3JpcHQgaW5mZXJzIHRoYXQgYHN0b3J5YCBkb2VzIGhhdmUgYSBgdGl0bGVgIHByb3BlcnR5IHdpdGggYSB2YWx1ZSBvZlxuICAgIC8vIHR5cGUgYHN0cmluZ2AsIHNvIHRoaXMgcGFzc2VzIHR5cGUtY2hlY2tpbmcuXG4gICAgcmV0dXJuIHN0b3J5LnRpdGxlO1xufVxuLy8qIE1JTklNQUwgSU1QTEVNRU5UQVRJT04gT0YgZmV0Y2ggSU4gTk9ERS5qcyAqLy9cbmZ1bmN0aW9uIGZldGNoKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciByZXEgPSByZXF1aXJlKHVybC5zcGxpdChcIjovL1wiKVswXSk7IC8vXCJodHRwXCIgb3IgXCJodHRwc1wiXG4gICAgICAgIHJlcS5nZXQoZW5jb2RlVVJJKHVybCksIChyZXMpID0+IHtcbiAgICAgICAgICAgIHZhciBib2R5ID0gXCJcIjtcbiAgICAgICAgICAgIHJlcy5zZXRFbmNvZGluZyhcInV0ZjhcIik7XG4gICAgICAgICAgICByZXMub24oXCJkYXRhXCIsIChjaHVuaykgPT4geyBib2R5ICs9IGNodW5rOyB9KTtcbiAgICAgICAgICAgIHJlcy5vbihcImVuZFwiLCAoKSA9PiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBqc29uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBib2R5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KS5vbihcImVycm9yXCIsIChlcnIpID0+IHsgcmVqZWN0KGVycik7IH0pO1xuICAgIH0pO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBUT0RPIHJlcGxhY2Ugd2l0aCBmcC10cycgRWl0aGVyIG9uY2UgcHVibGlzaGVkXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBIS1Qge1xufVxuZXhwb3J0cy5IS1QgPSBIS1Q7XG5mdW5jdGlvbiBpZGVudGl0eShhKSB7XG4gICAgcmV0dXJuIGE7XG59XG5leHBvcnRzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG5jbGFzcyBMZWZ0IGV4dGVuZHMgSEtUIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIG1hcChmKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvL2FwPEI+KGZhYjogRWl0aGVyPEwsIChhOiBBKSA9PiBCPik6IEVpdGhlcjxMLCBCPiB7XG4gICAgLy8gIHJldHVybiB0aGlzIGFzIGFueSBhcyBFaXRoZXI8TCwgQj5cbiAgICAvL31cbiAgICBjaGFpbihmKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBmb2xkKGwsIHIpIHtcbiAgICAgICAgcmV0dXJuIGwodGhpcy52YWx1ZSk7XG4gICAgfVxuICAgIGlzTGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlzUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLkxlZnQgPSBMZWZ0O1xuY2xhc3MgUmlnaHQgZXh0ZW5kcyBIS1Qge1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgbWFwKGYpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSaWdodChmKHRoaXMudmFsdWUpKTtcbiAgICB9XG4gICAgLy9hcDxCPihmYWI6IEVpdGhlcjxMLCAoYTogQSkgPT4gQj4pOiBFaXRoZXI8TCwgQj4ge1xuICAgIC8vICByZXR1cm4gZmFiLmZvbGQ8RWl0aGVyPEwsIEI+Pig8YW55PmlkZW50aXR5LCBmID0+IHRoaXMubWFwKGYpKVxuICAgIC8vfVxuICAgIGNoYWluKGYpIHtcbiAgICAgICAgcmV0dXJuIGYodGhpcy52YWx1ZSk7XG4gICAgfVxuICAgIGZvbGQobCwgcikge1xuICAgICAgICByZXR1cm4gcih0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgaXNMZWZ0KCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlzUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydHMuUmlnaHQgPSBSaWdodDtcbmZ1bmN0aW9uIG9mKGEpIHtcbiAgICByZXR1cm4gbmV3IFJpZ2h0KGEpO1xufVxuZXhwb3J0cy5vZiA9IG9mO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBFaXRoZXJfMSA9IHJlcXVpcmUoXCIuL0VpdGhlclwiKTtcbmNsYXNzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBhIHVuaXF1ZSBuYW1lIGZvciB0aGlzIHJ1bnRpbWUgdHlwZSAqL1xuICAgIG5hbWUsIFxuICAgIC8qKiBhIGN1c3RvbSB0eXBlIGd1YXJkICovXG4gICAgaXMsIFxuICAgIC8qKiBzdWNjZWVkcyBpZiBhIHZhbHVlIG9mIHR5cGUgSSBjYW4gYmUgZGVjb2RlZCB0byBhIHZhbHVlIG9mIHR5cGUgQSAqL1xuICAgIHZhbGlkYXRlLCBcbiAgICAvKiogY29udmVydHMgYSB2YWx1ZSBvZiB0eXBlIEEgdG8gYSB2YWx1ZSBvZiB0eXBlIE8gKi9cbiAgICBlbmNvZGUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pcyA9IGlzO1xuICAgICAgICB0aGlzLnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICAgIHRoaXMuZW5jb2RlID0gZW5jb2RlO1xuICAgIH1cbiAgICBwaXBlKGFiLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHlwZShuYW1lIHx8IGBwaXBlKCR7dGhpcy5uYW1lfSwgJHthYi5uYW1lfSlgLCBhYi5pcywgKGksIGMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0aGlzLnZhbGlkYXRlKGksIGMpO1xuICAgICAgICAgICAgaWYgKHZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWRhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhYi52YWxpZGF0ZSh2YWxpZGF0aW9uLnZhbHVlLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5lbmNvZGUgPT09IGV4cG9ydHMuaWRlbnRpdHkgJiYgYWIuZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5ID8gZXhwb3J0cy5pZGVudGl0eSA6IGIgPT4gdGhpcy5lbmNvZGUoYWIuZW5jb2RlKGIpKSk7XG4gICAgfVxuICAgIGFzRGVjb2RlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGFzRW5jb2RlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKiBhIHZlcnNpb24gb2YgYHZhbGlkYXRlYCB3aXRoIGEgZGVmYXVsdCBjb250ZXh0ICovXG4gICAgZGVjb2RlKGkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoaSwgZXhwb3J0cy5nZXREZWZhdWx0Q29udGV4dCh0aGlzKSk7XG4gICAgfVxufVxuZXhwb3J0cy5UeXBlID0gVHlwZTtcbmV4cG9ydHMuaWRlbnRpdHkgPSAoYSkgPT4gYTtcbmV4cG9ydHMuZ2V0RnVuY3Rpb25OYW1lID0gKGYpID0+IGYuZGlzcGxheU5hbWUgfHwgZi5uYW1lIHx8IGA8ZnVuY3Rpb24ke2YubGVuZ3RofT5gO1xuZXhwb3J0cy5nZXRDb250ZXh0RW50cnkgPSAoa2V5LCB0eXBlKSA9PiAoeyBrZXksIHR5cGUgfSk7XG5leHBvcnRzLmdldFZhbGlkYXRpb25FcnJvciA9ICh2YWx1ZSwgY29udGV4dCkgPT4gKHsgdmFsdWUsIGNvbnRleHQgfSk7XG5leHBvcnRzLmdldERlZmF1bHRDb250ZXh0ID0gKHR5cGUpID0+IFt7IGtleTogJycsIHR5cGUgfV07XG5leHBvcnRzLmFwcGVuZENvbnRleHQgPSAoYywga2V5LCB0eXBlKSA9PiB7XG4gICAgY29uc3QgbGVuID0gYy5sZW5ndGg7XG4gICAgY29uc3QgciA9IEFycmF5KGxlbiArIDEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcltpXSA9IGNbaV07XG4gICAgfVxuICAgIHJbbGVuXSA9IHsga2V5LCB0eXBlIH07XG4gICAgcmV0dXJuIHI7XG59O1xuZXhwb3J0cy5mYWlsdXJlcyA9IChlcnJvcnMpID0+IG5ldyBFaXRoZXJfMS5MZWZ0KGVycm9ycyk7XG5leHBvcnRzLmZhaWx1cmUgPSAodmFsdWUsIGNvbnRleHQpID0+IGV4cG9ydHMuZmFpbHVyZXMoW2V4cG9ydHMuZ2V0VmFsaWRhdGlvbkVycm9yKHZhbHVlLCBjb250ZXh0KV0pO1xuZXhwb3J0cy5zdWNjZXNzID0gKHZhbHVlKSA9PiBuZXcgRWl0aGVyXzEuUmlnaHQodmFsdWUpO1xuY29uc3QgcHVzaEFsbCA9ICh4cywgeXMpID0+IHtcbiAgICBjb25zdCBsID0geXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHhzLnB1c2goeXNbaV0pO1xuICAgIH1cbn07XG4vL1xuLy8gYmFzaWMgdHlwZXNcbi8vXG5jbGFzcyBOdWxsVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignbnVsbCcsIChtKSA9PiBtID09PSBudWxsLCAobSwgYykgPT4gKHRoaXMuaXMobSkgPyBleHBvcnRzLnN1Y2Nlc3MobSkgOiBleHBvcnRzLmZhaWx1cmUobSwgYykpLCBleHBvcnRzLmlkZW50aXR5KTtcbiAgICAgICAgdGhpcy5fdGFnID0gJ051bGxUeXBlJztcbiAgICB9XG59XG5leHBvcnRzLk51bGxUeXBlID0gTnVsbFR5cGU7XG4vKiogQGFsaWFzIGBudWxsYCAqL1xuZXhwb3J0cy5udWxsVHlwZSA9IG5ldyBOdWxsVHlwZSgpO1xuZXhwb3J0cy5udWxsID0gZXhwb3J0cy5udWxsVHlwZTtcbmNsYXNzIFVuZGVmaW5lZFR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ3VuZGVmaW5lZCcsIChtKSA9PiBtID09PSB2b2lkIDAsIChtLCBjKSA9PiAodGhpcy5pcyhtKSA/IGV4cG9ydHMuc3VjY2VzcyhtKSA6IGV4cG9ydHMuZmFpbHVyZShtLCBjKSksIGV4cG9ydHMuaWRlbnRpdHkpO1xuICAgICAgICB0aGlzLl90YWcgPSAnVW5kZWZpbmVkVHlwZSc7XG4gICAgfVxufVxuZXhwb3J0cy5VbmRlZmluZWRUeXBlID0gVW5kZWZpbmVkVHlwZTtcbmNvbnN0IHVuZGVmaW5lZFR5cGUgPSBuZXcgVW5kZWZpbmVkVHlwZSgpO1xuZXhwb3J0cy51bmRlZmluZWQgPSB1bmRlZmluZWRUeXBlO1xuY2xhc3MgQW55VHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignYW55JywgKF8pID0+IHRydWUsIGV4cG9ydHMuc3VjY2VzcywgZXhwb3J0cy5pZGVudGl0eSk7XG4gICAgICAgIHRoaXMuX3RhZyA9ICdBbnlUeXBlJztcbiAgICB9XG59XG5leHBvcnRzLkFueVR5cGUgPSBBbnlUeXBlO1xuZXhwb3J0cy5hbnkgPSBuZXcgQW55VHlwZSgpO1xuY2xhc3MgTmV2ZXJUeXBlIGV4dGVuZHMgVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCduZXZlcicsIChfKSA9PiBmYWxzZSwgKG0sIGMpID0+IGV4cG9ydHMuZmFpbHVyZShtLCBjKSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3Qgc2VyaWFsaXplIG5ldmVyJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl90YWcgPSAnTmV2ZXJUeXBlJztcbiAgICB9XG59XG5leHBvcnRzLk5ldmVyVHlwZSA9IE5ldmVyVHlwZTtcbmV4cG9ydHMubmV2ZXIgPSBuZXcgTmV2ZXJUeXBlKCk7XG5jbGFzcyBTdHJpbmdUeXBlIGV4dGVuZHMgVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdzdHJpbmcnLCAobSkgPT4gdHlwZW9mIG0gPT09ICdzdHJpbmcnLCAobSwgYykgPT4gKHRoaXMuaXMobSkgPyBleHBvcnRzLnN1Y2Nlc3MobSkgOiBleHBvcnRzLmZhaWx1cmUobSwgYykpLCBleHBvcnRzLmlkZW50aXR5KTtcbiAgICAgICAgdGhpcy5fdGFnID0gJ1N0cmluZ1R5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuU3RyaW5nVHlwZSA9IFN0cmluZ1R5cGU7XG5leHBvcnRzLnN0cmluZyA9IG5ldyBTdHJpbmdUeXBlKCk7XG5jbGFzcyBOdW1iZXJUeXBlIGV4dGVuZHMgVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdudW1iZXInLCAobSkgPT4gdHlwZW9mIG0gPT09ICdudW1iZXInLCAobSwgYykgPT4gKHRoaXMuaXMobSkgPyBleHBvcnRzLnN1Y2Nlc3MobSkgOiBleHBvcnRzLmZhaWx1cmUobSwgYykpLCBleHBvcnRzLmlkZW50aXR5KTtcbiAgICAgICAgdGhpcy5fdGFnID0gJ051bWJlclR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuTnVtYmVyVHlwZSA9IE51bWJlclR5cGU7XG5leHBvcnRzLm51bWJlciA9IG5ldyBOdW1iZXJUeXBlKCk7XG5jbGFzcyBCb29sZWFuVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignYm9vbGVhbicsIChtKSA9PiB0eXBlb2YgbSA9PT0gJ2Jvb2xlYW4nLCAobSwgYykgPT4gKHRoaXMuaXMobSkgPyBleHBvcnRzLnN1Y2Nlc3MobSkgOiBleHBvcnRzLmZhaWx1cmUobSwgYykpLCBleHBvcnRzLmlkZW50aXR5KTtcbiAgICAgICAgdGhpcy5fdGFnID0gJ0Jvb2xlYW5UeXBlJztcbiAgICB9XG59XG5leHBvcnRzLkJvb2xlYW5UeXBlID0gQm9vbGVhblR5cGU7XG5leHBvcnRzLmJvb2xlYW4gPSBuZXcgQm9vbGVhblR5cGUoKTtcbmNsYXNzIEFueUFycmF5VHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignQXJyYXknLCBBcnJheS5pc0FycmF5LCAobSwgYykgPT4gKHRoaXMuaXMobSkgPyBleHBvcnRzLnN1Y2Nlc3MobSkgOiBleHBvcnRzLmZhaWx1cmUobSwgYykpLCBleHBvcnRzLmlkZW50aXR5KTtcbiAgICAgICAgdGhpcy5fdGFnID0gJ0FueUFycmF5VHlwZSc7XG4gICAgfVxufVxuZXhwb3J0cy5BbnlBcnJheVR5cGUgPSBBbnlBcnJheVR5cGU7XG5jb25zdCBhcnJheVR5cGUgPSBuZXcgQW55QXJyYXlUeXBlKCk7XG5leHBvcnRzLkFycmF5ID0gYXJyYXlUeXBlO1xuY2xhc3MgQW55RGljdGlvbmFyeVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ0RpY3Rpb25hcnknLCAobSkgPT4gbSAhPT0gbnVsbCAmJiB0eXBlb2YgbSA9PT0gJ29iamVjdCcsIChtLCBjKSA9PiAodGhpcy5pcyhtKSA/IGV4cG9ydHMuc3VjY2VzcyhtKSA6IGV4cG9ydHMuZmFpbHVyZShtLCBjKSksIGV4cG9ydHMuaWRlbnRpdHkpO1xuICAgICAgICB0aGlzLl90YWcgPSAnQW55RGljdGlvbmFyeVR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuQW55RGljdGlvbmFyeVR5cGUgPSBBbnlEaWN0aW9uYXJ5VHlwZTtcbmV4cG9ydHMuRGljdGlvbmFyeSA9IG5ldyBBbnlEaWN0aW9uYXJ5VHlwZSgpO1xuY2xhc3MgT2JqZWN0VHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignb2JqZWN0JywgZXhwb3J0cy5EaWN0aW9uYXJ5LmlzLCBleHBvcnRzLkRpY3Rpb25hcnkudmFsaWRhdGUsIGV4cG9ydHMuaWRlbnRpdHkpO1xuICAgICAgICB0aGlzLl90YWcgPSAnT2JqZWN0VHlwZSc7XG4gICAgfVxufVxuZXhwb3J0cy5PYmplY3RUeXBlID0gT2JqZWN0VHlwZTtcbmV4cG9ydHMub2JqZWN0ID0gbmV3IE9iamVjdFR5cGUoKTtcbmNsYXNzIEZ1bmN0aW9uVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignRnVuY3Rpb24nLCBcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnN0cmljdC10eXBlLXByZWRpY2F0ZXNcbiAgICAgICAgKG0pID0+IHR5cGVvZiBtID09PSAnZnVuY3Rpb24nLCAobSwgYykgPT4gKHRoaXMuaXMobSkgPyBleHBvcnRzLnN1Y2Nlc3MobSkgOiBleHBvcnRzLmZhaWx1cmUobSwgYykpLCBleHBvcnRzLmlkZW50aXR5KTtcbiAgICAgICAgdGhpcy5fdGFnID0gJ0Z1bmN0aW9uVHlwZSc7XG4gICAgfVxufVxuZXhwb3J0cy5GdW5jdGlvblR5cGUgPSBGdW5jdGlvblR5cGU7XG5leHBvcnRzLkZ1bmN0aW9uID0gbmV3IEZ1bmN0aW9uVHlwZSgpO1xuLy9cbi8vIHJlZmluZW1lbnRzXG4vL1xuY2xhc3MgUmVmaW5lbWVudFR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSwgdHlwZSwgcHJlZGljYXRlKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplKTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wcmVkaWNhdGUgPSBwcmVkaWNhdGU7XG4gICAgICAgIHRoaXMuX3RhZyA9ICdSZWZpbmVtZW50VHlwZSc7XG4gICAgfVxufVxuZXhwb3J0cy5SZWZpbmVtZW50VHlwZSA9IFJlZmluZW1lbnRUeXBlO1xuZXhwb3J0cy5yZWZpbmVtZW50ID0gKHR5cGUsIHByZWRpY2F0ZSwgbmFtZSA9IGAoJHt0eXBlLm5hbWV9IHwgJHtleHBvcnRzLmdldEZ1bmN0aW9uTmFtZShwcmVkaWNhdGUpfSlgKSA9PiBuZXcgUmVmaW5lbWVudFR5cGUobmFtZSwgKG0pID0+IHR5cGUuaXMobSkgJiYgcHJlZGljYXRlKG0pLCAoaSwgYykgPT4ge1xuICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0eXBlLnZhbGlkYXRlKGksIGMpO1xuICAgIGlmICh2YWxpZGF0aW9uLmlzTGVmdCgpKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0aW9uO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgYSA9IHZhbGlkYXRpb24udmFsdWU7XG4gICAgICAgIHJldHVybiBwcmVkaWNhdGUoYSkgPyBleHBvcnRzLnN1Y2Nlc3MoYSkgOiBleHBvcnRzLmZhaWx1cmUoYSwgYyk7XG4gICAgfVxufSwgdHlwZS5lbmNvZGUsIHR5cGUsIHByZWRpY2F0ZSk7XG5leHBvcnRzLkludGVnZXIgPSBleHBvcnRzLnJlZmluZW1lbnQoZXhwb3J0cy5udW1iZXIsIG4gPT4gbiAlIDEgPT09IDAsICdJbnRlZ2VyJyk7XG4vL1xuLy8gbGl0ZXJhbHNcbi8vXG5jbGFzcyBMaXRlcmFsVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCB2YWx1ZSkge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fdGFnID0gJ0xpdGVyYWxUeXBlJztcbiAgICB9XG59XG5leHBvcnRzLkxpdGVyYWxUeXBlID0gTGl0ZXJhbFR5cGU7XG5leHBvcnRzLmxpdGVyYWwgPSAodmFsdWUsIG5hbWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpID0+IHtcbiAgICBjb25zdCBpcyA9IChtKSA9PiBtID09PSB2YWx1ZTtcbiAgICByZXR1cm4gbmV3IExpdGVyYWxUeXBlKG5hbWUsIGlzLCAobSwgYykgPT4gKGlzKG0pID8gZXhwb3J0cy5zdWNjZXNzKHZhbHVlKSA6IGV4cG9ydHMuZmFpbHVyZShtLCBjKSksIGV4cG9ydHMuaWRlbnRpdHksIHZhbHVlKTtcbn07XG4vL1xuLy8ga2V5b2Zcbi8vXG5jbGFzcyBLZXlvZlR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSwga2V5cykge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMua2V5cyA9IGtleXM7XG4gICAgICAgIHRoaXMuX3RhZyA9ICdLZXlvZlR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuS2V5b2ZUeXBlID0gS2V5b2ZUeXBlO1xuZXhwb3J0cy5rZXlvZiA9IChrZXlzLCBuYW1lID0gYChrZXlvZiAke0pTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKGtleXMpKX0pYCkgPT4ge1xuICAgIGNvbnN0IGlzID0gKG0pID0+IGV4cG9ydHMuc3RyaW5nLmlzKG0pICYmIGtleXMuaGFzT3duUHJvcGVydHkobSk7XG4gICAgcmV0dXJuIG5ldyBLZXlvZlR5cGUobmFtZSwgaXMsIChtLCBjKSA9PiAoaXMobSkgPyBleHBvcnRzLnN1Y2Nlc3MobSkgOiBleHBvcnRzLmZhaWx1cmUobSwgYykpLCBleHBvcnRzLmlkZW50aXR5LCBrZXlzKTtcbn07XG4vL1xuLy8gcmVjdXJzaXZlIHR5cGVzXG4vL1xuY2xhc3MgUmVjdXJzaXZlVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCBydW5EZWZpbml0aW9uKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplKTtcbiAgICAgICAgdGhpcy5ydW5EZWZpbml0aW9uID0gcnVuRGVmaW5pdGlvbjtcbiAgICAgICAgdGhpcy5fdGFnID0gJ1JlY3Vyc2l2ZVR5cGUnO1xuICAgIH1cbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRGVmaW5pdGlvbigpO1xuICAgIH1cbn1cbmV4cG9ydHMuUmVjdXJzaXZlVHlwZSA9IFJlY3Vyc2l2ZVR5cGU7XG5leHBvcnRzLnJlY3Vyc2lvbiA9IChuYW1lLCBkZWZpbml0aW9uKSA9PiB7XG4gICAgbGV0IGNhY2hlO1xuICAgIGNvbnN0IHJ1bkRlZmluaXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGlmICghY2FjaGUpIHtcbiAgICAgICAgICAgIGNhY2hlID0gZGVmaW5pdGlvbihTZWxmKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfTtcbiAgICBjb25zdCBTZWxmID0gbmV3IFJlY3Vyc2l2ZVR5cGUobmFtZSwgKG0pID0+IHJ1bkRlZmluaXRpb24oKS5pcyhtKSwgKG0sIGMpID0+IHJ1bkRlZmluaXRpb24oKS52YWxpZGF0ZShtLCBjKSwgYSA9PiBydW5EZWZpbml0aW9uKCkuZW5jb2RlKGEpLCBydW5EZWZpbml0aW9uKTtcbiAgICByZXR1cm4gU2VsZjtcbn07XG4vL1xuLy8gYXJyYXlzXG4vL1xuY2xhc3MgQXJyYXlUeXBlIGV4dGVuZHMgVHlwZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgaXMsIHZhbGlkYXRlLCBzZXJpYWxpemUsIHR5cGUpIHtcbiAgICAgICAgc3VwZXIobmFtZSwgaXMsIHZhbGlkYXRlLCBzZXJpYWxpemUpO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLl90YWcgPSAnQXJyYXlUeXBlJztcbiAgICB9XG59XG5leHBvcnRzLkFycmF5VHlwZSA9IEFycmF5VHlwZTtcbmV4cG9ydHMuYXJyYXkgPSAodHlwZSwgbmFtZSA9IGBBcnJheTwke3R5cGUubmFtZX0+YCkgPT4gbmV3IEFycmF5VHlwZShuYW1lLCAobSkgPT4gYXJyYXlUeXBlLmlzKG0pICYmIG0uZXZlcnkodHlwZS5pcyksIChtLCBjKSA9PiB7XG4gICAgY29uc3QgYXJyYXlWYWxpZGF0aW9uID0gYXJyYXlUeXBlLnZhbGlkYXRlKG0sIGMpO1xuICAgIGlmIChhcnJheVZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5VmFsaWRhdGlvbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHhzID0gYXJyYXlWYWxpZGF0aW9uLnZhbHVlO1xuICAgICAgICBjb25zdCBsZW4gPSB4cy5sZW5ndGg7XG4gICAgICAgIGxldCBhID0geHM7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0geHNbaV07XG4gICAgICAgICAgICBjb25zdCB2YWxpZGF0aW9uID0gdHlwZS52YWxpZGF0ZSh4LCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgU3RyaW5nKGkpLCB0eXBlKSk7XG4gICAgICAgICAgICBpZiAodmFsaWRhdGlvbi5pc0xlZnQoKSkge1xuICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCB2YWxpZGF0aW9uLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZ4ID0gdmFsaWRhdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodnggIT09IHgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPT09IHhzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0geHMuc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhW2ldID0gdng7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGEpO1xuICAgIH1cbn0sIHR5cGUuZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5ID8gZXhwb3J0cy5pZGVudGl0eSA6IGEgPT4gYS5tYXAodHlwZS5lbmNvZGUpLCB0eXBlKTtcbi8vXG4vLyBvcHRpb25hbHNcbi8vXG5jbGFzcyBPcHRpb25hbFR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSwgdHlwZSkge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuX3RhZyA9ICdPcHRpb25hbFR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuT3B0aW9uYWxUeXBlID0gT3B0aW9uYWxUeXBlO1xuZXhwb3J0cy5vcHRpb25hbCA9ICh0eXBlLCBuYW1lID0gYCR7dHlwZS5uYW1lfT9gKSA9PiBuZXcgT3B0aW9uYWxUeXBlKG5hbWUsIChtKSA9PiB1bmRlZmluZWRUeXBlLmlzKG0pIHx8IHR5cGUuaXMobSksIChpLCBjKSA9PiB7XG4gICAgaWYgKHVuZGVmaW5lZFR5cGUuaXMoaSkpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuc3VjY2VzcyhpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0eXBlLnZhbGlkYXRlKGksIGMpO1xuICAgIH1cbn0sIHR5cGUuZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5ID8gZXhwb3J0cy5pZGVudGl0eSA6IGEgPT4gKHVuZGVmaW5lZFR5cGUuaXMoYSkgPyBhIDogdHlwZS5lbmNvZGUoYSkpLCB0eXBlKTtcbi8vXG4vLyBpbnRlcmZhY2VzXG4vL1xuY2xhc3MgSW50ZXJmYWNlVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCBwcm9wcykge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5fdGFnID0gJ0ludGVyZmFjZVR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuSW50ZXJmYWNlVHlwZSA9IEludGVyZmFjZVR5cGU7XG5jb25zdCBnZXROYW1lRnJvbVByb3BzID0gKHByb3BzKSA9PiBgeyAke09iamVjdC5rZXlzKHByb3BzKVxuICAgIC5tYXAoayA9PiBgJHtrfTogJHtwcm9wc1trXS5uYW1lfWApXG4gICAgLmpvaW4oJywgJyl9IH1gO1xuY29uc3QgdXNlSWRlbnRpdHkgPSAodHlwZXMsIGxlbikgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKHR5cGVzW2ldLmVuY29kZSAhPT0gZXhwb3J0cy5pZGVudGl0eSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcbi8qKiBAYWxpYXMgYGludGVyZmFjZWAgKi9cbmV4cG9ydHMudHlwZSA9IChwcm9wcywgbmFtZSA9IGdldE5hbWVGcm9tUHJvcHMocHJvcHMpKSA9PiB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICBjb25zdCB0eXBlcyA9IGtleXMubWFwKGtleSA9PiBwcm9wc1trZXldKTtcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IEludGVyZmFjZVR5cGUobmFtZSwgKG0pID0+IHtcbiAgICAgICAgaWYgKCFleHBvcnRzLkRpY3Rpb25hcnkuaXMobSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXR5cGVzW2ldLmlzKG1ba2V5c1tpXV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sIChtLCBjKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpY3Rpb25hcnlWYWxpZGF0aW9uID0gZXhwb3J0cy5EaWN0aW9uYXJ5LnZhbGlkYXRlKG0sIGMpO1xuICAgICAgICBpZiAoZGljdGlvbmFyeVZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBkaWN0aW9uYXJ5VmFsaWRhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG8gPSBkaWN0aW9uYXJ5VmFsaWRhdGlvbi52YWx1ZTtcbiAgICAgICAgICAgIGxldCBhID0gbztcbiAgICAgICAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9rID0gb1trXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IHR5cGUudmFsaWRhdGUob2ssIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBrLCB0eXBlKSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHZhbGlkYXRpb24udmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm9rID0gdmFsaWRhdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZvayAhPT0gb2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhID09PSBvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHsgLi4ubyB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYVtrXSA9IHZvaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGEpO1xuICAgICAgICB9XG4gICAgfSwgdXNlSWRlbnRpdHkodHlwZXMsIGxlbilcbiAgICAgICAgPyBleHBvcnRzLmlkZW50aXR5XG4gICAgICAgIDogYSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzID0geyAuLi5hIH07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgayA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgZW5jb2RlID0gdHlwZXNbaV0uZW5jb2RlO1xuICAgICAgICAgICAgICAgIGlmIChlbmNvZGUgIT09IGV4cG9ydHMuaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGVuY29kZShhW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNba10gIT09IHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIHByb3BzKTtcbn07XG5leHBvcnRzLmludGVyZmFjZSA9IGV4cG9ydHMudHlwZTtcbi8vXG4vLyBwYXJ0aWFsc1xuLy9cbmNsYXNzIFBhcnRpYWxUeXBlIGV4dGVuZHMgVHlwZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgaXMsIHZhbGlkYXRlLCBzZXJpYWxpemUsIHByb3BzKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplKTtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLl90YWcgPSAnUGFydGlhbFR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuUGFydGlhbFR5cGUgPSBQYXJ0aWFsVHlwZTtcbmV4cG9ydHMucGFydGlhbCA9IChwcm9wcywgbmFtZSA9IGBQYXJ0aWFsVHlwZTwke2dldE5hbWVGcm9tUHJvcHMocHJvcHMpfT5gKSA9PiB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICBjb25zdCB0eXBlcyA9IGtleXMubWFwKGtleSA9PiBwcm9wc1trZXldKTtcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBjb25zdCBwYXJ0aWFscyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcGFydGlhbHNba2V5c1tpXV0gPSBleHBvcnRzLnVuaW9uKFt0eXBlc1tpXSwgdW5kZWZpbmVkVHlwZV0pO1xuICAgIH1cbiAgICBjb25zdCBwYXJ0aWFsID0gZXhwb3J0cy50eXBlKHBhcnRpYWxzKTtcbiAgICByZXR1cm4gbmV3IFBhcnRpYWxUeXBlKG5hbWUsIHBhcnRpYWwuaXMsIHBhcnRpYWwudmFsaWRhdGUsIHVzZUlkZW50aXR5KHR5cGVzLCBsZW4pXG4gICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICA6IGEgPT4ge1xuICAgICAgICAgICAgY29uc3QgcyA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFrID0gYVtrXTtcbiAgICAgICAgICAgICAgICBpZiAoYWsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzW2tdID0gdHlwZXNbaV0uZW5jb2RlKGFrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSwgcHJvcHMpO1xufTtcbi8vXG4vLyBkaWN0aW9uYXJpZXNcbi8vXG5jbGFzcyBEaWN0aW9uYXJ5VHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCBkb21haW4sIGNvZG9tYWluKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplKTtcbiAgICAgICAgdGhpcy5kb21haW4gPSBkb21haW47XG4gICAgICAgIHRoaXMuY29kb21haW4gPSBjb2RvbWFpbjtcbiAgICAgICAgdGhpcy5fdGFnID0gJ0RpY3Rpb25hcnlUeXBlJztcbiAgICB9XG59XG5leHBvcnRzLkRpY3Rpb25hcnlUeXBlID0gRGljdGlvbmFyeVR5cGU7XG5leHBvcnRzLmRpY3Rpb25hcnkgPSAoZG9tYWluLCBjb2RvbWFpbiwgbmFtZSA9IGB7IFtLIGluICR7ZG9tYWluLm5hbWV9XTogJHtjb2RvbWFpbi5uYW1lfSB9YCkgPT4gbmV3IERpY3Rpb25hcnlUeXBlKG5hbWUsIChtKSA9PiBleHBvcnRzLkRpY3Rpb25hcnkuaXMobSkgJiYgT2JqZWN0LmtleXMobSkuZXZlcnkoayA9PiBkb21haW4uaXMoaykgJiYgY29kb21haW4uaXMobVtrXSkpLCAobSwgYykgPT4ge1xuICAgIGNvbnN0IGRpY3Rpb25hcnlWYWxpZGF0aW9uID0gZXhwb3J0cy5EaWN0aW9uYXJ5LnZhbGlkYXRlKG0sIGMpO1xuICAgIGlmIChkaWN0aW9uYXJ5VmFsaWRhdGlvbi5pc0xlZnQoKSkge1xuICAgICAgICByZXR1cm4gZGljdGlvbmFyeVZhbGlkYXRpb247XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBvID0gZGljdGlvbmFyeVZhbGlkYXRpb24udmFsdWU7XG4gICAgICAgIGNvbnN0IGEgPSB7fTtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvKTtcbiAgICAgICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgIGNvbnN0IG9rID0gb1trXTtcbiAgICAgICAgICAgIGNvbnN0IGRvbWFpblZhbGlkYXRpb24gPSBkb21haW4udmFsaWRhdGUoaywgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIGssIGRvbWFpbikpO1xuICAgICAgICAgICAgY29uc3QgY29kb21haW5WYWxpZGF0aW9uID0gY29kb21haW4udmFsaWRhdGUob2ssIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBrLCBjb2RvbWFpbikpO1xuICAgICAgICAgICAgaWYgKGRvbWFpblZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgZG9tYWluVmFsaWRhdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ayA9IGRvbWFpblZhbGlkYXRpb24udmFsdWU7XG4gICAgICAgICAgICAgICAgY2hhbmdlZCA9IGNoYW5nZWQgfHwgdmsgIT09IGs7XG4gICAgICAgICAgICAgICAgayA9IHZrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvZG9tYWluVmFsaWRhdGlvbi5pc0xlZnQoKSkge1xuICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCBjb2RvbWFpblZhbGlkYXRpb24udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgdm9rID0gY29kb21haW5WYWxpZGF0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgIGNoYW5nZWQgPSBjaGFuZ2VkIHx8IHZvayAhPT0gb2s7XG4gICAgICAgICAgICAgICAgYVtrXSA9IHZvaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3JzLmxlbmd0aCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2VzcygoY2hhbmdlZCA/IGEgOiBvKSk7XG4gICAgfVxufSwgZG9tYWluLmVuY29kZSA9PT0gZXhwb3J0cy5pZGVudGl0eSAmJiBjb2RvbWFpbi5lbmNvZGUgPT09IGV4cG9ydHMuaWRlbnRpdHlcbiAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICA6IGEgPT4ge1xuICAgICAgICBjb25zdCBzID0ge307XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgICAgICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgc1tTdHJpbmcoZG9tYWluLmVuY29kZShrKSldID0gY29kb21haW4uZW5jb2RlKGFba10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH0sIGRvbWFpbiwgY29kb21haW4pO1xuLy9cbi8vIHVuaW9uc1xuLy9cbmNsYXNzIFVuaW9uVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCB0eXBlcykge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgdGhpcy5fdGFnID0gJ1VuaW9uVHlwZSc7XG4gICAgfVxufVxuZXhwb3J0cy5VbmlvblR5cGUgPSBVbmlvblR5cGU7XG5leHBvcnRzLnVuaW9uID0gKHR5cGVzLCBuYW1lID0gYCgke3R5cGVzLm1hcCh0eXBlID0+IHR5cGUubmFtZSkuam9pbignIHwgJyl9KWApID0+IHtcbiAgICBjb25zdCBsZW4gPSB0eXBlcy5sZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBVbmlvblR5cGUobmFtZSwgKG0pID0+IHR5cGVzLnNvbWUodHlwZSA9PiB0eXBlLmlzKG0pKSwgKG0sIGMpID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0eXBlLnZhbGlkYXRlKG0sIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcoaSksIHR5cGUpKTtcbiAgICAgICAgICAgIGlmICh2YWxpZGF0aW9uLmlzUmlnaHQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZGF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHZhbGlkYXRpb24udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHBvcnRzLmZhaWx1cmVzKGVycm9ycyk7XG4gICAgfSwgdHlwZXMuZXZlcnkodHlwZSA9PiB0eXBlLmVuY29kZSA9PT0gZXhwb3J0cy5pZGVudGl0eSlcbiAgICAgICAgPyBleHBvcnRzLmlkZW50aXR5XG4gICAgICAgIDogYSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGxlbiAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZS5pcyhhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZS5lbmNvZGUoYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHR5cGVzW2ldLmVuY29kZShhKTtcbiAgICAgICAgfSwgdHlwZXMpO1xufTtcbi8vXG4vLyBpbnRlcnNlY3Rpb25zXG4vL1xuY2xhc3MgSW50ZXJzZWN0aW9uVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCB0eXBlcykge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgdGhpcy5fdGFnID0gJ0ludGVyc2VjdGlvblR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuSW50ZXJzZWN0aW9uVHlwZSA9IEludGVyc2VjdGlvblR5cGU7XG5mdW5jdGlvbiBpbnRlcnNlY3Rpb24odHlwZXMsIG5hbWUgPSBgKCR7dHlwZXMubWFwKHR5cGUgPT4gdHlwZS5uYW1lKS5qb2luKCcgJiAnKX0pYCkge1xuICAgIGNvbnN0IGxlbiA9IHR5cGVzLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdGlvblR5cGUobmFtZSwgKG0pID0+IHR5cGVzLmV2ZXJ5KHR5cGUgPT4gdHlwZS5pcyhtKSksIChtLCBjKSA9PiB7XG4gICAgICAgIGxldCBhID0gbTtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB0eXBlLnZhbGlkYXRlKGEsIGMpO1xuICAgICAgICAgICAgaWYgKHZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgdmFsaWRhdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhID0gdmFsaWRhdGlvbi52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3JzLmxlbmd0aCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2VzcyhhKTtcbiAgICB9LCB0eXBlcy5ldmVyeSh0eXBlID0+IHR5cGUuZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5KVxuICAgICAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICAgICAgOiBhID0+IHtcbiAgICAgICAgICAgIGxldCBzID0gYTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNbaV07XG4gICAgICAgICAgICAgICAgcyA9IHR5cGUuZW5jb2RlKHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIHR5cGVzKTtcbn1cbmV4cG9ydHMuaW50ZXJzZWN0aW9uID0gaW50ZXJzZWN0aW9uO1xuLy9cbi8vIHR1cGxlc1xuLy9cbmNsYXNzIFR1cGxlVHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCB0eXBlcykge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgdGhpcy5fdGFnID0gJ1R1cGxlVHlwZSc7XG4gICAgfVxufVxuZXhwb3J0cy5UdXBsZVR5cGUgPSBUdXBsZVR5cGU7XG5mdW5jdGlvbiB0dXBsZSh0eXBlcywgbmFtZSA9IGBbJHt0eXBlcy5tYXAodHlwZSA9PiB0eXBlLm5hbWUpLmpvaW4oJywgJyl9XWApIHtcbiAgICBjb25zdCBsZW4gPSB0eXBlcy5sZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBUdXBsZVR5cGUobmFtZSwgKG0pID0+IGFycmF5VHlwZS5pcyhtKSAmJiBtLmxlbmd0aCA9PT0gbGVuICYmIHR5cGVzLmV2ZXJ5KCh0eXBlLCBpKSA9PiB0eXBlLmlzKG1baV0pKSwgKG0sIGMpID0+IHtcbiAgICAgICAgY29uc3QgYXJyYXlWYWxpZGF0aW9uID0gYXJyYXlUeXBlLnZhbGlkYXRlKG0sIGMpO1xuICAgICAgICBpZiAoYXJyYXlWYWxpZGF0aW9uLmlzTGVmdCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlWYWxpZGF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYXMgPSBhcnJheVZhbGlkYXRpb24udmFsdWU7XG4gICAgICAgICAgICBsZXQgdCA9IGFzO1xuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IGFzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZGF0aW9uID0gdHlwZS52YWxpZGF0ZShhLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgU3RyaW5nKGkpLCB0eXBlKSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRpb24uaXNMZWZ0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHZhbGlkYXRpb24udmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmEgPSB2YWxpZGF0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmEgIT09IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID09PSBhcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBhcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdFtpXSA9IHZhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFzLmxlbmd0aCA+IGxlbikge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGV4cG9ydHMuZ2V0VmFsaWRhdGlvbkVycm9yKGFzW2xlbl0sIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcobGVuKSwgZXhwb3J0cy5uZXZlcikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKHQpO1xuICAgICAgICB9XG4gICAgfSwgdHlwZXMuZXZlcnkodHlwZSA9PiB0eXBlLmVuY29kZSA9PT0gZXhwb3J0cy5pZGVudGl0eSkgPyBleHBvcnRzLmlkZW50aXR5IDogYSA9PiB0eXBlcy5tYXAoKHR5cGUsIGkpID0+IHR5cGUuZW5jb2RlKGFbaV0pKSwgdHlwZXMpO1xufVxuZXhwb3J0cy50dXBsZSA9IHR1cGxlO1xuLy9cbi8vIHJlYWRvbmx5IG9iamVjdHNcbi8vXG5jbGFzcyBSZWFkb25seVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSwgdHlwZSkge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuX3RhZyA9ICdSZWFkb25seVR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuUmVhZG9ubHlUeXBlID0gUmVhZG9ubHlUeXBlO1xuZXhwb3J0cy5yZWFkb25seSA9ICh0eXBlLCBuYW1lID0gYFJlYWRvbmx5PCR7dHlwZS5uYW1lfT5gKSA9PiBuZXcgUmVhZG9ubHlUeXBlKG5hbWUsIHR5cGUuaXMsIChtLCBjKSA9PiB0eXBlLnZhbGlkYXRlKG0sIGMpLm1hcCh4ID0+IHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh4KTtcbiAgICB9XG4gICAgcmV0dXJuIHg7XG59KSwgdHlwZS5lbmNvZGUgPT09IGV4cG9ydHMuaWRlbnRpdHkgPyBleHBvcnRzLmlkZW50aXR5IDogdHlwZS5lbmNvZGUsIHR5cGUpO1xuLy9cbi8vIHJlYWRvbmx5IGFycmF5c1xuLy9cbmNsYXNzIFJlYWRvbmx5QXJyYXlUeXBlIGV4dGVuZHMgVHlwZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgaXMsIHZhbGlkYXRlLCBzZXJpYWxpemUsIHR5cGUpIHtcbiAgICAgICAgc3VwZXIobmFtZSwgaXMsIHZhbGlkYXRlLCBzZXJpYWxpemUpO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLl90YWcgPSAnUmVhZG9ubHlBcnJheVR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuUmVhZG9ubHlBcnJheVR5cGUgPSBSZWFkb25seUFycmF5VHlwZTtcbmV4cG9ydHMucmVhZG9ubHlBcnJheSA9ICh0eXBlLCBuYW1lID0gYFJlYWRvbmx5QXJyYXk8JHt0eXBlLm5hbWV9PmApID0+IHtcbiAgICBjb25zdCBhcnJheVR5cGUgPSBleHBvcnRzLmFycmF5KHR5cGUpO1xuICAgIHJldHVybiBuZXcgUmVhZG9ubHlBcnJheVR5cGUobmFtZSwgYXJyYXlUeXBlLmlzLCAobSwgYykgPT4gYXJyYXlUeXBlLnZhbGlkYXRlKG0sIGMpLm1hcCh4ID0+IHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKHgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICB9KSwgYXJyYXlUeXBlLmVuY29kZSwgdHlwZSk7XG59O1xuLy9cbi8vIHN0cmljdCBpbnRlcmZhY2VzXG4vL1xuY2xhc3MgU3RyaWN0VHlwZSBleHRlbmRzIFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGlzLCB2YWxpZGF0ZSwgc2VyaWFsaXplLCBwcm9wcykge1xuICAgICAgICBzdXBlcihuYW1lLCBpcywgdmFsaWRhdGUsIHNlcmlhbGl6ZSk7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5fdGFnID0gJ1N0cmljdFR5cGUnO1xuICAgIH1cbn1cbmV4cG9ydHMuU3RyaWN0VHlwZSA9IFN0cmljdFR5cGU7XG4vKiogU3BlY2lmaWVzIHRoYXQgb25seSB0aGUgZ2l2ZW4gaW50ZXJmYWNlIHByb3BlcnRpZXMgYXJlIGFsbG93ZWQgKi9cbmV4cG9ydHMuc3RyaWN0ID0gKHByb3BzLCBuYW1lID0gYFN0cmljdFR5cGU8JHtnZXROYW1lRnJvbVByb3BzKHByb3BzKX0+YCkgPT4ge1xuICAgIGNvbnN0IGxvb3NlID0gZXhwb3J0cy50eXBlKHByb3BzKTtcbiAgICByZXR1cm4gbmV3IFN0cmljdFR5cGUobmFtZSwgKG0pID0+IGxvb3NlLmlzKG0pICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG0pLmV2ZXJ5KGsgPT4gcHJvcHMuaGFzT3duUHJvcGVydHkoaykpLCAobSwgYykgPT4ge1xuICAgICAgICBjb25zdCBsb29zZVZhbGlkYXRpb24gPSBsb29zZS52YWxpZGF0ZShtLCBjKTtcbiAgICAgICAgaWYgKGxvb3NlVmFsaWRhdGlvbi5pc0xlZnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGxvb3NlVmFsaWRhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG8gPSBsb29zZVZhbGlkYXRpb24udmFsdWU7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobyk7XG4gICAgICAgICAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGV4cG9ydHMuZ2V0VmFsaWRhdGlvbkVycm9yKG9ba2V5XSwgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIGtleSwgZXhwb3J0cy5uZXZlcikpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLmxlbmd0aCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2VzcyhvKTtcbiAgICAgICAgfVxuICAgIH0sIGxvb3NlLmVuY29kZSwgcHJvcHMpO1xufTtcbmNvbnN0IGlzVGFnZ2VkID0gKHRhZykgPT4ge1xuICAgIGNvbnN0IGYgPSAodHlwZSkgPT4ge1xuICAgICAgICBpZiAodHlwZSBpbnN0YW5jZW9mIEludGVyZmFjZVR5cGUgfHwgdHlwZSBpbnN0YW5jZW9mIFN0cmljdFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlLnByb3BzLmhhc093blByb3BlcnR5KHRhZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIEludGVyc2VjdGlvblR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlLnR5cGVzLnNvbWUoZik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFVuaW9uVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGUudHlwZXMuZXZlcnkoZik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFJlZmluZW1lbnRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gZih0eXBlLnR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gZjtcbn07XG5jb25zdCBmaW5kVGFnZ2VkID0gKHRhZywgdHlwZXMpID0+IHtcbiAgICBjb25zdCBsZW4gPSB0eXBlcy5sZW5ndGg7XG4gICAgY29uc3QgaXMgPSBpc1RhZ2dlZCh0YWcpO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKDsgaSA8IGxlbiAtIDE7IGkrKykge1xuICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNbaV07XG4gICAgICAgIGlmIChpcyh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGVzW2ldO1xufTtcbmNvbnN0IGdldFRhZ1ZhbHVlID0gKHRhZykgPT4ge1xuICAgIGNvbnN0IGYgPSAodHlwZSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHR5cGUuX3RhZykge1xuICAgICAgICAgICAgY2FzZSAnSW50ZXJmYWNlVHlwZSc6XG4gICAgICAgICAgICBjYXNlICdTdHJpY3RUeXBlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZS5wcm9wc1t0YWddLnZhbHVlO1xuICAgICAgICAgICAgY2FzZSAnSW50ZXJzZWN0aW9uVHlwZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYoZmluZFRhZ2dlZCh0YWcsIHR5cGUudHlwZXMpKTtcbiAgICAgICAgICAgIGNhc2UgJ1VuaW9uVHlwZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYodHlwZS50eXBlc1swXSk7XG4gICAgICAgICAgICBjYXNlICdSZWZpbmVtZW50VHlwZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYodHlwZS50eXBlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGY7XG59O1xuZXhwb3J0cy50YWdnZWRVbmlvbiA9ICh0YWcsIHR5cGVzLCBuYW1lID0gYCgke3R5cGVzLm1hcCh0eXBlID0+IHR5cGUubmFtZSkuam9pbignIHwgJyl9KWApID0+IHtcbiAgICBjb25zdCBsZW4gPSB0eXBlcy5sZW5ndGg7XG4gICAgY29uc3QgdmFsdWVzID0gbmV3IEFycmF5KGxlbik7XG4gICAgY29uc3QgaGFzaCA9IHt9O1xuICAgIGxldCB1c2VIYXNoID0gdHJ1ZTtcbiAgICBjb25zdCBnZXQgPSBnZXRUYWdWYWx1ZSh0YWcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXQodHlwZXNbaV0pO1xuICAgICAgICB1c2VIYXNoID0gdXNlSGFzaCAmJiBleHBvcnRzLnN0cmluZy5pcyh2YWx1ZSk7XG4gICAgICAgIHZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICBoYXNoW1N0cmluZyh2YWx1ZSldID0gaTtcbiAgICB9XG4gICAgY29uc3QgaXNUYWdWYWx1ZSA9IHVzZUhhc2hcbiAgICAgICAgPyAobSkgPT4gZXhwb3J0cy5zdHJpbmcuaXMobSkgJiYgaGFzaC5oYXNPd25Qcm9wZXJ0eShtKVxuICAgICAgICA6IChtKSA9PiB2YWx1ZXMuaW5kZXhPZihtKSAhPT0gLTE7XG4gICAgY29uc3QgZ2V0SW5kZXggPSB1c2VIYXNoXG4gICAgICAgID8gdGFnID0+IGhhc2hbdGFnXVxuICAgICAgICA6IHRhZyA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGxlbiAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNbaV0gPT09IHRhZykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfTtcbiAgICBjb25zdCBUYWdWYWx1ZSA9IG5ldyBUeXBlKHZhbHVlcy5tYXAobCA9PiBKU09OLnN0cmluZ2lmeShsKSkuam9pbignIHwgJyksIGlzVGFnVmFsdWUsIChtLCBjKSA9PiAoaXNUYWdWYWx1ZShtKSA/IGV4cG9ydHMuc3VjY2VzcyhtKSA6IGV4cG9ydHMuZmFpbHVyZShtLCBjKSksIGV4cG9ydHMuaWRlbnRpdHkpO1xuICAgIHJldHVybiBuZXcgVW5pb25UeXBlKG5hbWUsICh2KSA9PiB7XG4gICAgICAgIGlmICghZXhwb3J0cy5EaWN0aW9uYXJ5LmlzKHYpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFnVmFsdWUgPSB2W3RhZ107XG4gICAgICAgIHJldHVybiBUYWdWYWx1ZS5pcyh0YWdWYWx1ZSkgJiYgdHlwZXNbZ2V0SW5kZXgodGFnVmFsdWUpXS5pcyh2KTtcbiAgICB9LCAocywgYykgPT4ge1xuICAgICAgICBjb25zdCBkaWN0aW9uYXJ5VmFsaWRhdGlvbiA9IGV4cG9ydHMuRGljdGlvbmFyeS52YWxpZGF0ZShzLCBjKTtcbiAgICAgICAgaWYgKGRpY3Rpb25hcnlWYWxpZGF0aW9uLmlzTGVmdCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGljdGlvbmFyeVZhbGlkYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkID0gZGljdGlvbmFyeVZhbGlkYXRpb24udmFsdWU7XG4gICAgICAgICAgICBjb25zdCB0YWdWYWx1ZVZhbGlkYXRpb24gPSBUYWdWYWx1ZS52YWxpZGF0ZShkW3RhZ10sIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCB0YWcsIFRhZ1ZhbHVlKSk7XG4gICAgICAgICAgICBpZiAodGFnVmFsdWVWYWxpZGF0aW9uLmlzTGVmdCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZ1ZhbHVlVmFsaWRhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGkgPSBnZXRJbmRleCh0YWdWYWx1ZVZhbGlkYXRpb24udmFsdWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZS52YWxpZGF0ZShkLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgU3RyaW5nKGkpLCB0eXBlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0eXBlcy5ldmVyeSh0eXBlID0+IHR5cGUuZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5KSA/IGV4cG9ydHMuaWRlbnRpdHkgOiBhID0+IHR5cGVzW2dldEluZGV4KGFbdGFnXSldLmVuY29kZShhKSwgdHlwZXMpO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=