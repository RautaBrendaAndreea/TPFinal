import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-age-chart',
  templateUrl: './age-chart.component.html',
  styleUrls: ['./age-chart.component.css']
})
export class AgeChartComponent implements OnInit {
  survivors: any[] = [];
  chart!: am5xy.XYChart;
  xAxis!: am5xy.CategoryAxis<any>;
  series!: am5xy.ColumnSeries;

  ageGroups = [
    { label: "0-10", min: 0, max: 10 },
    { label: "10-20", min: 10, max: 20 },
    { label: "20-30", min: 20, max: 30 },
    { label: "30-40", min: 30, max: 40 },
    { label: "40-50", min: 40, max: 50 },
    { label: "50-60", min: 50, max: 60 },
    { label: "60-70", min: 60, max: 70 },
    { label: "70-80", min: 70, max: 80 },
    { label: "80+", min: 80, max: Number.MAX_VALUE }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getSurvivorsSortedByAge().subscribe((data) => {
      this.survivors = data;
      this.setupChart();
      this.updateChart();
      
    });
  }

  private setupChart(): void {
    let root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "none",
      wheelY: "none"
    }));

    chart.zoomOutButton.set("forceHidden", true);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30
    });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: 0,
      paddingRight: 15
    });
    xRenderer.grid.template.set("visible", false);

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "ageGroupLabel",  
      renderer: xRenderer
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      categoryXField: "ageGroupLabel"  
    }));

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0
    });

    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: "{valueYWorking.formatNumber('#.')}",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: 0,
          centerX: am5.p50,
          populateText: true
        })
      });
    });

    this.chart = chart;
    this.xAxis = xAxis;
    this.series = series;
  }

  private updateChart(): void {
    if (!this.chart || !this.survivors || this.survivors.length === 0) {
      return;
    }
    this.survivors.sort((a, b) => a.Age - b.Age);
  
    const ageStatistics: { [key: string]: number } = {};

    this.survivors.forEach((survivor) => {

      const ageGroup = this.getAgeGroup(parseInt(survivor.Age));
      ageStatistics[ageGroup] = (ageStatistics[ageGroup] || 0) + 1;
    });
  
    const chartData: { ageGroupLabel: string, value: number }[] = [];
  

    this.ageGroups.forEach((ageGroup) => {
      const count = ageStatistics[ageGroup.label] || 0;
      chartData.push({ ageGroupLabel: ageGroup.label, value: count });
    });
    this.xAxis.data.setAll(chartData);
    this.series.data.setAll(chartData);
  }
  

  private getAgeGroup(age: number): string {
    for (const group of this.ageGroups) {
      if (age >= group.min && age < group.max) {
        return group.label;
      }
    }
    return '';
  }
}
