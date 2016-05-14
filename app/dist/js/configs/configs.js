import { createHistory, createHashHistory }     from 'history';
import { useRouterHistory }                     from "react-router";


export function isProduction() {
  console.log('window.location.hostname', window.location.hostname);
  return    window.location.hostname == 'ec2-54-235-235-7.compute-1.amazonaws.com'
        ||  window.location.hostname == 'mondeavie.ca'
        ||  window.location.hostname == 'www.blackandrouge.com'
}

export function getBaseUrlApi() {
  if( isProduction() ){
    return 'http://www.blackandrouge.com/public/api';
  } else {
    return 'http://localhost:3000/public/api';
  }
}

export function getBaseUrlImage() {
  if( isProduction() ){
    return 'http://www.blackandrouge.com';
  } else {
    return 'http://localhost:3000';
  }
}

export function getHistory() {
  if( isProduction() ){
    let  browserHistory = useRouterHistory(createHistory)({ basename: '/' });
    return browserHistory;

  } else {
    let  hashHistory = useRouterHistory(createHashHistory)({ basename: '/' });
    return hashHistory;
  }
}