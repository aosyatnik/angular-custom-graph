import { Injectable } from '@angular/core';
import { ShotData } from './shot-data';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor() { }

  private getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getChartData(): any {
    const chartsData = new Array<ShotData>();
    for (let i = 0; i < 5; i++) {
      const temp = new ShotData();
      temp.opmode = this.getRandomInt(0, 6);
      temp.min = 1;
      temp.max = 10;
      temp.x = this.getRandom(0, 5);
      temp.y = this.getRandom(1, 10);
      chartsData.push(temp);
    }

    return chartsData;
  }
}
