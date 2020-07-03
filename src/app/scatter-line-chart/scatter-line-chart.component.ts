import { Component,
         OnChanges,
         ElementRef,
         NgZone,
         ChangeDetectorRef,
         Input,
         ViewChild,
         SimpleChanges } from '@angular/core';

import { BaseChartComponent,
         ViewDimensions,
         calculateViewDimensions,
         getScale,
         getDomain } from '@swimlane/ngx-charts';

import { extent } from 'd3';

import { timer } from 'rxjs';

import { Scale,
  SeriesData,
  ChartConfig } from './scatter-line-series.model';

import { ScatterPainter } from './scatter-line-series/scatter-series.painter';

@Component({
  selector: 'app-scatter-line-chart',
  templateUrl: './scatter-line-chart.component.html',
  styleUrls: ['./scatter-line-chart.component.scss']
})
export class ScatterLineChartComponent<T> extends BaseChartComponent implements OnChanges {
  @ViewChild('canvas', { static: true }) private canvas: ElementRef<HTMLCanvasElement>;

  dims: ViewDimensions;
  xDomain: number[];
  yDomain: number[];
  xScale: Scale;
  yScale: Scale;

  transform: string;

  margin = [0, 0, 0, 0];
  xAxisHeight = 0;
  yAxisWidth = 0;
  radius = 1.5;

  tresholdSeries: SeriesData<T>[];

  scatterPainter: ScatterPainter<T>;

  @Input() config: ChartConfig<T>;

  constructor(elementRef: ElementRef, zone: NgZone, cdr: ChangeDetectorRef) {
    super(elementRef, zone, cdr);
   }

   ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

   update(): void {
    this.tresholdSeries = this.config.toleranceSeries(this.results);
    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();
    this.updateLayout();
    this.scatterPainter = new ScatterPainter(
      this.results,
      this.xScale,
      this.yScale,
      this.config.chartColors,
      this.config.xSelector,
      this.config.ySelector);

    const tolerancePainters = this.tresholdSeries.map(s => new ScatterPainter(
      s.series,
      this.xScale,
      this.yScale,
      this.config.chartColors,
      this.config.xSelector,
      this.config.ySelector
    ));

    timer(50).subscribe(() => {
      const canvas = this.canvas.nativeElement;
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.scatterPainter.draw(context);
        tolerancePainters.map(t => t.draw(context));
      }
    });
   }

   private updateLayout(): void {
    if (this.updateViewDimensionsIfNeeded()) {
      this.setScales();
    }
    this.transform = `translate(${this.dims.xOffset},${this.margin[0]})`;
   }

   private updateViewDimensionsIfNeeded(): boolean {
    const containerDims = this.getContainerDims();
    if (containerDims) {
      if (this.height !== containerDims.height) {
        this.height = containerDims.height;
      }
      if (this.width !== containerDims.width) {
        this.width = containerDims.width;
      }
    }
    const dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: true,
      showYAxis: true,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: true,
      showYLabel: true,
      showLegend: true,
      legendType: this.schemeType,
      legendPosition: 'below'
    });

    if (!this.dims) {
      this.dims = dims;
      return true;
    }

    const heightChanged = this.dims.height !== dims.height;
    const widthChanged = this.dims.width !== dims.width;
    const offsetChanged = this.dims.xOffset !== dims.xOffset;

    if (heightChanged || widthChanged || offsetChanged) {
      this.dims = dims;
      return true;
    }
    return false;
   }

   /** Pads the maximal and minimal scale values to not cut off any circles */
  private setScales(): void {
    const width = this.dims.width - this.radius;
    const height = this.dims.height - this.radius;
    this.xScale = this.getXScale(this.xDomain, width);
    this.yScale = this.getYScale(this.yDomain, height);
  }

  private getYScale(domain, height): Scale {
    const scale = getScale(domain, [height, this.radius], 'linear', false);
    return scale;
  }

  private getXScale(domain, width): Scale {
    const scale = getScale(domain, [this.radius, width], 'linear', false);
    return scale;
  }

  private getXDomain(): number[] {
    let values: number[] = [];
    const vals = extent(this.results, this.config.xSelector);
    values = vals[0] === undefined ? [0, 0] : vals;
    return getDomain(values, 'linear', false);
  }

  private getYDomain(): number[] {
    return [1, 10];
  }
}
