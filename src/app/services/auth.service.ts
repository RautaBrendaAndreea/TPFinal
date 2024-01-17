import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3002/api'; 

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };

    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => this.handleSuccess(response)),
        catchError(this.handleError<any>('Login'))
      );
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logout`)
      .pipe(
        tap(() => this.handleLogout()),
        catchError(this.handleError<any>('Logout'))
      );
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`)
      .pipe(
        catchError(this.handleError<any>('Get Me'))
      );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }

  private handleSuccess(response: any): void {
    const token = response.token;
    localStorage.setItem('token', token);
  }

  private handleLogout(): void {
    localStorage.removeItem('token');
  }

  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
