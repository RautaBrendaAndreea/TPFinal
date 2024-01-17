import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-classe-billets-chart',
  templateUrl: './classe-billets-chart.component.html',
  styleUrls: ['./classe-billets-chart.component.css']
})
export class ClasseBilletsChartComponent implements OnInit {
  survivorsByPclass: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPassengersGroupedBySexAndPclass().subscribe(data => {
      const maleChartData = [
        { value: this.getSurvivorCount(data, "male", 1), category: "Pclass 1" },
        { value: this.getSurvivorCount(data, "male", 2), category: "Pclass 2" },
        { value: this.getSurvivorCount(data, "male", 3), category: "Pclass 3" },
      ];

      const femaleChartData = [
        { value: this.getSurvivorCount(data, "female", 1), category: "Pclass 1" },
        { value: this.getSurvivorCount(data, "female", 2), category: "Pclass 2" },
        { value: this.getSurvivorCount(data, "female", 3), category: "Pclass 3" },
      ];

      this.createPictorialStackedChart("malediv", maleChartData, true);
      this.createPictorialStackedChart("femalediv", femaleChartData, false);
    });
  }

  private createPictorialStackedChart(containerId: string, data: any[], isMaleChart: boolean) {
    const root = am5.Root.new(containerId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(am5percent.SlicedChart.new(root, {
      layout: root.verticalLayout
    }));

    const series = chart.series.push(am5percent.PictorialStackedSeries.new(root, {
      alignLabels: true,
      orientation: "vertical",
      valueField: "value",
      categoryField: "category",
      svgPath: "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z"
    }));

    const colors = isMaleChart
      ? [am5.color(0x0f9747), am5.color(0xb0d136), am5.color(0xfdae19), am5.color(0xee1f25)]
      : [am5.color(0x0000ff), am5.color(0x00ff00), am5.color(0xff0000), am5.color(0xffff00)];

    series.get("colors")?.set("colors", colors);

    // Set data for the series
    series.data.setAll(data);

    // Animation
    series.appear(1000, 100);
  }


  private getSurvivorCount(data: any[], gender: string, pclass: number): number {
    return data.reduce((count, item) => {
      const category = `${gender} - Pclass ${pclass}`;
      if (item.name === category) {
        count += item.value || 0;
      }
      return count;
    }, 0);
  }

}
