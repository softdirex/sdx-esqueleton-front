// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  baseUrl: 'http://localhost:4200',
  production: false,
  appVersion: '1.0.0',
  coreTransactionKey: '2wR14ikRE9BadFkpfRb6',
  appName: 'APP_NAME',
  footerInfo: 'Softdirex - Innovate your digital tools',
  officeLocation: 'La Serena - Chile',
  contactEmail: 'sales@softdirex.com',
  contactPhone: '+569 9867 2957',
  orgName: 'Softdirex',
  // Direccion web de softdirex
  providerWeb: 'https://softdirex.cl/',
  // OWNER_ID Asociado al producto, si está en 0 carga datos de softdirex
  ownerId: 0,
  productId: 0,
  // BEGIN - Owner config default
  dfConfigCompanyName: 'Softdirex',
  dfConfigSlogan: 'Modernize your digital tools',
  dfConfigAbout: 'We are a company that in a short time has managed to take our clients to the next technological level, keeping our computer tools in constant evolution to keep up with the growing technological advance, our work has been arduous but the achievements have been rewarding, we focus on responding to our clients in their technological requirements with added value to continue growing. We have a research area to create new cutting-edge solutions.',
  dfConfigMission: 'Our mission is to promote and provide small and medium-sized businesses with better specific software management tools that will help them compete more effectively in the market.',
  dfConfigVision: 'We all must have access to modern information systems, regardless of the size of our projects, any effective implementation of technology will contribute to better development and in the long run will bring great profits.',
  dfConfigContactPhone: '+569 9867 2957',
  dfConfigContactMail: 'info@softdirex.com',
  dfConfigAddress: '',
  dfConfigCity: 'La Serena',
  dfConfigCountry: 'Chile',
  dfConfigTermsFilename: 'terms.json',
  dfConfigLang: 'en',
  // END - Owner config default
  productBackendEndpoint: 'http://127.0.0.1:3334/v1',
  coreFrontendEndpoint: 'http://localhost:4401/',
  pwdRegex: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
  rutRegex: '\\b[0-9|.]{1,10}\\-[K|k|0-9]',
  passportRegex: '[a-zA-Z0-9-]{6,100}',
  dniRegex: '[a-zA-Z0-9-]{6,100}',
  documentDataRegex: '[a-zA-Z0-9-]{6,100}',
  namesRegex: '[a-zA-Z\u00C0-\u00ff- ]{2,90}',
  phonesRegex: '[0-9+() -]{8,35}',
  addressRegex: '[a-zA-Z\u00C0-\u00ff-.@ 0-9]{2,90}',
  rrssRegex: '[a-zA-Z-.@_0-9]',
  obsRegex: '[a-zA-Z\u00C0-\u00ff-.,\'\n": 0-9]{20,1000}',
  aboutRegex: '[a-zA-Z\u00C0-\u00ff-.,\'\n": 0-9]{20,5000}',
  sessionTimeMins: 10,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
