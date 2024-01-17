import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseBilletsChartComponent } from './classe-billets-chart.component';

describe('ClasseBilletsChartComponent', () => {
  let component: ClasseBilletsChartComponent;
  let fixture: ComponentFixture<ClasseBilletsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasseBilletsChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasseBilletsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
