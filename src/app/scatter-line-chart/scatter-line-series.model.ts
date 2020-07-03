import * as d3 from 'd3';

export type Scale = d3.ScaleLinear<number, number>;

export interface ChartConfig<T> {
    xSelector: (val: T) => number;
    ySelector: (val: T) => number;
    toleranceSeries: (values: T[]) => [SeriesData<T>, SeriesData<T>];
    groupingSelector: (val: T) => any;
    chartColors: ColorManager<T>;
    barBackgroundColor: string;
  }

export interface SeriesData<T> {
    name: string;
    series: T[];
}

export interface ColorManager<T> {
    getColor(value: T): string;
}