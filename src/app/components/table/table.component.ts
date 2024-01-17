import { Component, OnInit } from '@angular/core';
import { PassengerService } from 'src/app/services/passenger.service';
import { first, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  passengers: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  searchQuery = '';
  totalPages: number = 0;
  selectedFilter: string = 'all';

  constructor(private passengerService: PassengerService) { }

  ngOnInit(): void {
    this.passengerService.allPassengers$.subscribe(data => {
      this.totalItems = data.length;
      this.updateTable(data);
    });

    this.passengerService.getAllPassengers().subscribe(initialPassengers => {
      this.passengerService.updatePassengers(initialPassengers);
    });

    this.listenToSearch();
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.passengerService.allPassengers$.pipe(first()).subscribe(data => {
      const filteredData = this.filterPassengersByType(data);
      this.updateTable(filteredData);
    });
  }

  updateTable(data: any[]): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.passengers = data.slice(startIndex, endIndex);
    this.calculateTotalPages(data.length);
  }

  calculateTotalPages(totalItems: number): void {
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  getPages(): number[] {
    const pages: number[] = [];
    const totalPageDisplay = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(totalPageDisplay / 2));
    let endPage = startPage + totalPageDisplay - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - totalPageDisplay + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.passengerService.allPassengers$.subscribe(data => {
      this.updateTable(data);
    });
  }

  onSearch(): void {
    this.passengerService.allPassengers$.pipe(first()).subscribe(data => {
      const filteredData = this.filterPassengers(data);
      this.updateTable(filteredData);
    });
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.passengerService.allPassengers$.subscribe(data => {
        this.updateTable(data);
      });
    }
  }

  onNext(): void {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.passengerService.allPassengers$.subscribe(data => {
        this.updateTable(data);
      });
    }
  }

  listenToSearch(): void {
    this.passengerService.allPassengers$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(data => {
          const filteredData = this.filterPassengers(data);
          this.updateTable(filteredData);
          return this.passengerService.allPassengers$;
        })
      )
      .subscribe();
  }

  private filterPassengers(data: any[]): any[] {
    if (!this.searchQuery) {
      return data;
    }

    const lowerCaseQuery = this.searchQuery.toLowerCase();
    return data.filter(passenger =>
      passenger.Name.toLowerCase().includes(lowerCaseQuery) ||
      passenger.Sex.toLowerCase().includes(lowerCaseQuery) ||
      passenger.Pclass.toString().includes(lowerCaseQuery)
    );
  }

  private filterPassengersByType(data: any[]): any[] {
    return this.selectedFilter === 'all'
      ? data
      : data.filter(passenger => passenger.Survived === (this.selectedFilter === 'survived' ? '1' : '0'));
  }
}
