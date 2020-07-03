export class CirclePainter {

  constructor(
    private cx: number,
    private cy: number,
    private color: string,
    public radius: number,
    private context: any) { }

  public draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.fillStyle = this.color;
    context.moveTo(this.cx, this.cy);
    context.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
}
