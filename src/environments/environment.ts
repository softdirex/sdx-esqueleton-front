// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: '1.0.0',
  coreTransactionKey: '2wR14ikRE9BadFkpfRb6',
  appName: 'APP_NAME',
  orgName: 'Softdirex',
  productId: 1,
  productBackendEndpoint: 'http://127.0.0.1:3334/v1',
  coreBackendEndpoint: 'http://127.0.0.1:3333/v1',
  coreFrontendEndpoint: 'http://localhost:4401/',
  pwdRegex: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
  rutRegex: '\\b[0-9|.]{1,10}\\-[K|k|0-9]',
  passportRegex: '[a-zA-Z0-9-]{6,100}',
  dniRegex: '[a-zA-Z0-9-]{6,100}',
  documentDataRegex: '[a-zA-Z0-9-]{6,100}',
  namesRegex: '[a-zA-Z\u00C0-\u00ff- ]{2,90}',
  phonesRegex: '[0-9+() -]{6,40}',
  addressRegex: '[a-zA-Z\u00C0-\u00ff-.@ 0-9]{2,90}',
  rrssRegex: '[a-zA-Z-.@_0-9]',
  obsRegex: '[a-zA-Z\u00C0-\u00ff-.,": 0-9]{2,250}',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
