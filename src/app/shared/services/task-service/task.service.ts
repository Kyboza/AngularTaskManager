import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  //Define Standard Get Settings
  private getStandardOptions = (): { headers: HttpHeaders, params?: HttpParams } => {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }

  //Get Tasks From API
   getTasks = () => {
    let options = this.getStandardOptions();
    options.params = new HttpParams({
      fromObject: {
        limit: '5'
      }
    })
    return this.http.get('https://dummyjson.com/todos', options).pipe(catchError(this.handleError))
  }

  //Handle Error
  private handleError = (error: HttpErrorResponse) => {
    if(error.status === 0){
      console.error('Client or Network Error'); 
    } 
    else if(error.status >= 400 && error.status < 500){
      console.error(error.error?.message || error.error || 'Bad Request'); 
    } 
    else if(error.status >= 500 && error.status < 600){
      console.error(error.error?.message || error.error ||'Server Error'); 
    } 
    else {
      console.error('Unknown Error Occurred While Getting Tasks')
    }
    return throwError(() => new Error('Failed To get Tasks'))
  }
}
