import { ChartConfig, ColorManager, SeriesData } from './scatter-line-chart/scatter-line-series.model';

export class ShotData {
    x: number;
    y: number;
    min: number;
    max: number;
    opmode: ShotType;
}

export enum ShotType {
    None = 0,
    Normal,
    Warning,
    Error,
    OutOfTolerance,
    Treshold
}

export const defaultColorScheme = new Map<ShotType, string>([
    [ShotType.Normal, '#008A5A'], // green
    [ShotType.Error, '#E35F6C'], // red
    [ShotType.Warning, '#FFC400'], // orange
    [ShotType.OutOfTolerance, '#9528d4'], // purple
    [ShotType.Treshold, '#0081B4'], // blue
    [ShotType.None, '#ddd'], // grey
    ]
  );

export class GraphColorManager implements ColorManager<ShotData> {
    getColor(value: ShotData): string {
      return defaultColorScheme.get(value.opmode) || '#000';
    }
  }

export class GraphConfig implements ChartConfig<ShotData> {
    chartColors = new GraphColorManager();
    barBackgroundColor = defaultColorScheme.get(ShotType.None) || '#000';

    groupingSelector = (val: ShotData) => val.opmode;
    ySelector = (val: ShotData) => val.y;

    xSelector = (val: ShotData): number => val.x;

    toleranceSeries = (values: ShotData[]): [SeriesData<ShotData>, SeriesData<ShotData>] => {
      const minSeries: ShotData[] = [];
      const maxSeries: ShotData[] = [];

      for (let index = 0; index < values.length; index++) {
          const val = values[index];
          const { min, max } = val;
          if (min || min === 0) {
            minSeries.push({ ...val, y: min, opmode: ShotType.Treshold });
          }
          if (max || max === 0) {
            maxSeries.push({ ...val, y: max, opmode: ShotType.Treshold });
          }
        }

      return [{ name: 'min', series: minSeries }, { name: 'max', series: maxSeries }];
      }
}
