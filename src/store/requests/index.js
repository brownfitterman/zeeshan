import axios from 'axios';
import { URLs } from './configuration';

axios.defaults.baseURL = 'http://localhost:2030/main';


let userdata = JSON.parse(sessionStorage.getItem('user'));
let headers = {
  requestId: '',
  'X-Request-By': userdata && userdata.userId,
  tenantId: 'SAB'
};
axios.defaults.headers.common['Content-Type'] =
  'application/json; charset=utf-8';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const onRequestSuccess = config => {
  console.debug('request success', config);
  var tokenObject = localStorage.getItem('dr:token');
  if (tokenObject) {
    const accessToken = JSON.parse(localStorage.getItem('dr:token'))
      .access_token;
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
  }
  return config;
};

const onRequestFail = error => {
  console.debug('request error', error);
  return Promise.reject(error);
};

axios.interceptors.request.use(onRequestSuccess, onRequestFail);

const onResponseSuccess = response => {
  console.debug('response success', response);
  return response;
};
const onResponseFail = error => {
  console.debug('response error', error);
  return Promise.reject(error);
};

axios.interceptors.response.use(onResponseSuccess, onResponseFail);

export default class API {
  // static getphotos = () => {
  //   return axios.get(URLs.photos);
  // };
  static addExpense = param => {
    return axios.post(URLs.addOrder, param, { headers: headers });
  };
  static getExpensesList = param => {
    return axios.get(URLs.getOrderList, { params: param });
  };
}
