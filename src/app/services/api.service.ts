import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3002';

  constructor(private http: HttpClient) {}

  getAllPassengers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/passengers`);
  }

  postStatistics(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/stat`, data);
  }

getSurvivorsSortedByAge(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/passengers/Survived/1`).pipe(
    map((passengers) =>
      passengers
        .filter((passenger) => passenger.Age !== '') 
        .sort((a, b) => parseFloat(a.Age) - parseFloat(b.Age)) 
    )
  );
}


getPassengersGroupedBySexAndPclass(): Observable<{ name: string; value: number }[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/passengers/Survived/1`).pipe(
    map((passengers) => {
      const groupedData: { name: string; value: number }[] = [];

      passengers.forEach((passenger) => {
        passenger.Survived = +passenger.Survived;
        passenger.Pclass = +passenger.Pclass;

        passenger.Sex = passenger.Sex.toLowerCase();

        const category = `${passenger.Sex} - Pclass ${passenger.Pclass}`;
        const existingCategory = groupedData.find((entry) => entry.name === category);

        if (existingCategory) {
          existingCategory.value += 1;
        } else {
          groupedData.push({ name: category, value: 1 });
        }
      });

      return groupedData;
    })
  );
}

getPassengersGroupedBySexAndAge(): Observable<{ name: string; value: number }[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/passengers/Survived/1`).pipe(
    map((passengers) => {
      const groupedData: { name: string; value: number }[] = [];

      passengers.forEach((passenger) => {
        passenger.Survived = +passenger.Survived;
        passenger.Age = +passenger.Age;

        passenger.Sex = passenger.Sex.toLowerCase();

        const category = `${passenger.Sex} - ${passenger.Age}`;
        const existingCategory = groupedData.find((entry) => entry.name === category);

        if (existingCategory) {
          existingCategory.value += 1;
        } else {
          groupedData.push({ name: category, value: 1 });
        }
      });

      return groupedData;
    })
  );
}


  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/stat/`);
  }
}



