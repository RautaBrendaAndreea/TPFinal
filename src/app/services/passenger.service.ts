import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {
  private apiUrl = 'http://localhost:3002';

  private allPassengersSubject = new BehaviorSubject<any[]>([]);
  allPassengers$ = this.allPassengersSubject.asObservable();

  constructor(private http: HttpClient) {}

  
  getAllPassengers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/passengers`)
      .pipe(
        tap(passengers => console.log('All Passengers:', passengers))
      );
  }
  

  updatePassengers(passengers: any[]): void {
    this.allPassengersSubject.next(passengers);
  }
}
