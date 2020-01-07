import request from '../utils/request';

export const login = data => Request({
  url: `/express/login`,
  method: 'POST',
  data,
});

export const getUserInfo = data => Request({
  url: `/express/depositor/show`,
  method: 'GET',
  data,
});
 

