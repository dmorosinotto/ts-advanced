// TODO replace with fp-ts' Either once published

export abstract class HKT<F, A> {
    __hkt!: F;
    __hkta!: A;
  }
  
  export function identity<A>(a: A): A {
    return a
  }
  
  export type Either<L, A> = Left<L, A> | Right<L, A>
  
  export class Left<L, A> extends HKT<HKT<'Either', L>, A> {
    constructor(readonly value: L){ super() }
    map<B>(f: (a: A) => B): Either<L, B> {
      return this as any as Either<L, B>
    }
    //ap<B>(fab: Either<L, (a: A) => B>): Either<L, B> {
    //  return this as any as Either<L, B>
    //}
    chain<B>(f: (a: A) => Either<L, B>): Either<L, B> {
      return this as any as Either<L, B>
    }
    fold<B>(l: (l: L) => B, r: (a: A) => B): B {
      return l(this.value)
    }
    isLeft(): this is Left<L, A> {
      return true
    }
    isRight(): this is Right<L, A> {
      return false
    }
  }
  
  export class Right<L, A> extends HKT<HKT<'Either', L>, A> {
    constructor(readonly value: A){ super() }
    map<B>(f: (a: A) => B): Either<L, B> {
      return new Right<L, B>(f(this.value))
    }
    //ap<B>(fab: Either<L, (a: A) => B>): Either<L, B> {
    //  return fab.fold<Either<L, B>>(<any>identity, f => this.map(f))
    //}
    chain<B>(f: (a: A) => Either<L, B>): Either<L, B> {
      return f(this.value)
    }
    fold<B>(l: (l: L) => B, r: (a: A) => B): B {
      return r(this.value)
    }
    isLeft(): this is Left<L, A> {
      return false
    }
    isRight(): this is Right<L, A> {
      return true
    }
  }
  
  export function of<L, A>(a: A): Either<L, A> {
    return new Right<L, A>(a)
  }