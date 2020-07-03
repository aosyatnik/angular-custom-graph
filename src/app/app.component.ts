import { Component } from '@angular/core';
import { DataProviderService } from './data-provider.service';
import { ChartConfig } from './scatter-line-chart/scatter-line-series.model';
import { ShotData, GraphConfig } from './shot-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-custom-graph';

  data: any;
  chartConfig: ChartConfig<ShotData>;

  constructor(private dataProviderService: DataProviderService) {
    this.chartConfig = new GraphConfig();
    this.data = dataProviderService.getChartData();
    console.log(this.data);
  }
}
