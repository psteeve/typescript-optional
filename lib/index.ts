export default abstract class Optional<T> {
    /**
     * Returns `true` if this is present, otherwise `false`.
     */
    abstract get isPresent(): boolean;
    
    /**
     * Returns true if this is empty, otherwise false.
     * This method is negation of `Optional.isPresent`.
     * 
     */
    get isEmpty(): boolean {
        return !this.isPresent;
    }

    /**
     * If a payload is present, returns the payload, otherwise throws `TypeError`.
     * 
     * @throws {TypeError} if this is empty.
     */
    abstract get(): T;
    
    /**
     * If a payload is present, executes the given `consumer`, otherwise not.
     * 
     * @param consumer a consumer of the payload
     */
    abstract ifPresent(consumer: (value: T) => void): void;

    /**
     * If a payload is present, executes the given `consumer`,
     * otherwise executes `emptyAction` instead.
     * 
     * @param consumer a consumer of the payload, if present
     * @param emptyAction an action, if empty
     */
    abstract ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void;

    /**
     * If a payload is present and the payload matches the given `predicate`, returns `this`,
     * otherwise returns an empty `Optional` even if this is present.
     * 
     * @param predicate a predicate to test the payload, if present
     */
    abstract filter(predicate: (value: T) => boolean): Optional<T>;
    
    /**
     * If a payload is present, returns an `Optional` as if applying `Optional.ofNullable` to the result of
     * applying the given `mapper` to the payload,
     * otherwise returns an empty `Optional`.
     * 
     * @param mapper a mapper to apply the payload, if present
     */
    abstract map<U> (mapper: (value: T) => U): Optional<U>;
    
    /**
     * If a payload is present, returns the result of applying the given `mapper` to the payload,
     * otherwise returns an empty `Optional`.
     * 
     * @param mapper a mapper to app;y the payload, if present
     */
    abstract flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U>;

    /**
     * If a payload is present, returns `this`,
     * otherwise returns an `Optional` provided by the given `supplier`.
     * 
     * @param supplier a supplier
     */
    abstract or(supplier: () => Optional<T>): Optional<T>;

    /**
     * If a payload is present, returns the payload, otherwise returns `another`.
     * 
     * @param another an another value
     */
    abstract orElse(another: T): T;
    
    /**
     * If a payload is present, returns the payload,
     * otherwise returns the result provided by the given `supplier`.
     * 
     * @param supplier a supplier of another value
     */
    abstract orElseGet(supplier: () => T): T;
    
    /**
     * If a payload is present, returns the payload,
     * otherwise throws an error provided by the given `errorSupplier`.
     * 
     * @param errorSupplier a supplier of an error
     * @throws {T} when `this` is empty.
     */
    abstract orElseThrow<U>(errorSupplier: () => U): T;

    /**
     * Returns an Optional whose payload is the given non-null `value`.
     * 
     * @param value a value 
     * @throws {TypeError} when the given `value` is `null` or `undefined`.
     */
    static of<T>(value: T): Optional<T> {
        if (value !== null && value !== undefined)
            return new PresentOptional<T>(value);
        else
            throw new TypeError("The passed value was null or undefined.");
    }

    /**
     * This method is an alias of `Optional.of`.
     * 
     * @param value a value
     * @throws {TypeError} when the given `value` is `null` or `undefined`.
     */
    static ofNonNull<T>(value: T): Optional<T> {
        return Optional.of(value);
    }

    /**
     * If the given `nullable` value is not `null` or `undefined`,
     * returns an `Optional` whose payload is the given value,
     * otherwise (or when `null` or `undefined`) returns an empty `Optional`.
     * 
     * @param nullable a nullable value
     */
    static ofNullable<T>(nullable: T | null | undefined): Optional<T> {
        if (nullable !== null && nullable !== undefined)
            return new PresentOptional<T>(nullable);
        else
            return new EmptyOptional<T>();
    }

    /**
     * Returns an empty `Optional`.
     */
    static empty<T>(): Optional<T> {
        return new EmptyOptional();
    }
}

class PresentOptional<T> extends Optional<T> {
    payload: T;

    get isPresent(): boolean {
        return true;
    }
    
    constructor(value: T)  {
        super();
        this.payload = value;
    }

    get(): T {
        return this.payload;
    }

    ifPresent(consumer: (value: T) => void): void {
        consumer(this.payload);
    }

    ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void {
        consumer(this.payload);
    }

    filter(predicate: (value: T) => boolean): Optional<T> {
        return (predicate(this.payload)) ? this : Optional.empty();
    }

    map<U>(mapper: (value: T) => U | null | undefined): Optional<U> {
        return Optional.ofNullable(mapper(this.payload));
    }
    
    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        return mapper(this.payload);
    }

    or(supplier: () => Optional<T>): Optional<T> {
        return this;
    }

    orElse(another: T): T {
        return this.payload;
    }

    orElseGet(another: () => T): T {
        return this.payload;
    }

    orElseThrow<U>(exception: () => U): T {
        return this.payload;
    }
}

class EmptyOptional<T> extends Optional<T> {
    get isPresent(): boolean {
        return false;
    }

    constructor() {
        super();
    }

    get(): T {
        throw new TypeError("The optional is not present.");
    }

    ifPresent(consumer: (value: T) => void): void {
    }

    ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void {
        emptyAction();
    }

    filter(predicate: (value: T) => boolean): Optional<T> {
        return this;
    }

    map<U>(mapper: (value: T) => U): Optional<U> {
        return Optional.empty();
    }

    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        return Optional.empty();
    }

    or(supplier: () => Optional<T>): Optional<T> {
        return supplier();
    }

    orElse(another: T): T {
        return another;
    }

    orElseGet(another: () => T): T {
        return this.orElse(another());
    }

    orElseThrow<U>(exception: () => U): T {
        throw exception();
    }
}
