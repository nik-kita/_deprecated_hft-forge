# itif()

This util allow you to write test with dynamic condition to execute them or to skip.

What you need to know:
1. You should define env `ITIF=true` before execute test command
    > example:
     
    ```
    ITIF=true npm run test
    ```
2. If you want to make single test independent from cli `ITIF` variable (only depend on condition) you should add `skip_cli_ITIF: true` inside options project of `itif` function.
    > example:

    ```ts
    itif({
        skip_cli_ITIF: true,
        // ...
    })('your test', () => { /* ... */ });

    ```
3. About conditions:
    * You should provide any logic or simple boolean for `customCondition` property inside options.
        > example

        ```ts
        itif({ customCondition: true })
        // ...or with any predicate callback
        itif({ customCondition: () => Date.now() % 2 === 0 })
        ```
    * Or you may use some predefined conditions. Their logic are already written and typed... (see another properties of `options` properties)
    