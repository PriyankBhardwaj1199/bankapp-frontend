import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token');

  if(req.url.includes('http://localhost:8080/api/user/login')||req.url.includes('http://localhost:8080/api/user/register')){
      return next(req);
  }


  const clonedReq = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  })


  
  return next(clonedReq);
};
