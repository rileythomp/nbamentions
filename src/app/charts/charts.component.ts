import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less']
})
export class ChartsComponent implements OnInit {

  showPlayerChart: boolean = true;
  showTeamChart: boolean = false;
  showRedditorChart: boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

  showChart(type: string) {
    switch (type) {
      case 'player':
        this.showPlayerChart = true;
        this.showTeamChart = false;
        this.showRedditorChart = false;
        break;
      case 'team':
        this.showPlayerChart = false;
        this.showTeamChart = true;
        this.showRedditorChart = false;
        break;
      case 'redditor':
        this.showPlayerChart = false;
        this.showTeamChart = false;
        this.showRedditorChart = true;
        break;
      default:
        this.showPlayerChart = true;
        this.showTeamChart = false;
        this.showRedditorChart = false;
    }
  }

}
