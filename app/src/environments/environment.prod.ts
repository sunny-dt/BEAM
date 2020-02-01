
////-----PROD-------
// export const environment = {
//   production: true,
//   apiUrl: 'https://g3mapper.amat.com/api/',
//   issuer_uri: 'https://mylogin.amat.com:8080',
//   client_id: 'G3Mobile',
//   redirect_uri: 'https://g3mapper.amat.com/app/callback',
//   scope:'openid profile',
//   extras: {
//     'access_type': 'offline'
//   }
// };


////-----QA-------
// export const environment = {
//   production: true,
//   apiUrl: 'https://g3mapperqa.amat.com/api/',
//   issuer_uri: 'https://myloginqa.amat.com:8080',
//   client_id: 'G3Mobile_Dev',
//   redirect_uri: 'https://g3mapperqa.amat.com/app/callback',
//   scope:'openid profile',
//   extras: {
//     'access_type': 'offline'
//   }
// };


//-----DEMO-------
// export const environment = {
//   production: true,
//   apiUrl: 'https://digitaas.io/amatg3mapper/api/',
//   issuer_uri: 'https://myloginqa.amat.com:8080',
//   client_id: 'G3Mobile_Dev',
//   redirect_uri: 'https://digitaas.io/amatg3mapper/app/callback',
//   scope:'openid profile',
//   extras: {
//     'access_type': 'offline'
//   }
// };

//-----DEV-------
export const environment = {
  production: true,
  // apiUrl: 'https://digitaas.io/amatg3mapperV2/api/',
  apiUrl: 'http://localhost:3000/',
  issuer_uri: 'https://myloginqa.amat.com:8080',
  client_id: 'G3Mobile_Dev',
  redirect_uri: 'https://digitaas.io/amatg3mapper/app/callback',
  scope:'openid profile',
  extras: {
    'access_type': 'offline'
  }
};
