import { ColorManager, Scale } from '../scatter-line-series.model';
import { CirclePainter } from './circle.painter';

export class ScatterPainter<T> {
  radius = 1.5;
  circles: CirclePainter[];


  constructor(
    private data: T[],
    private xScale: Scale,
    private yScale: Scale,
    private colors: ColorManager<T>,
    private xSelector,
    private ySelector) {
    this.getCircles();
  }

  getCircles(): void {
    const circles = this.data.map(d => {
      const y = this.ySelector(d);
      const x = this.xSelector(d);
      const cx = this.xScale(x);
      const cy = this.yScale(y);
      const color = this.colors.getColor(d);
      return new CirclePainter(cx, cy, color, this.radius, d);
    });
    this.circles = circles;
  }

  public draw(context: CanvasRenderingContext2D): void {
    this.circles.forEach(c => c.draw(context));
  }
}
