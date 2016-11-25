export default (generator, fn) => {
    let result = generator.next();
    const andReturns = v => { result = generator.next(v); };
    const andThen = () => { result = generator.next(); };

    fn(() => result.value, andReturns, andThen);
};
