# drizzt

```
require("drizzt")(
  options: {
    emitter: antenna.Emitter,
    key: string,
    async: boolean,
    traps: aran.traps,
    initialize: (global:object, origin:string) => {
      namespace: string,
      setup: string,
      sandbox: * },
    instrument: (script:string, source:string, origin:string) => string },
  callback: (error:Error) => undefined);
```
