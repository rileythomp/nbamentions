import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-trending',
	templateUrl: './trending.component.html',
	styleUrls: ['./trending.component.less']
})
export class TrendingComponent implements OnInit {
	readonly ApiUrl = environment.API_URL;
	readonly limit = 25;

	mentionList: any[] = [];
	upperBound: number = 0;
	duration: string = 'week';
	chartType: string = 'player';
	showError: boolean = false;
	showLoading: boolean = false;

	constructor() { }

	ngOnInit() {
		this.getTrending()
	}

	ngAfterViewChecked() {
		let barFlexes = document.getElementsByClassName('bar-flex')
		if (barFlexes.length != 9) {
			return
		}
		let mentionsBar = document.getElementsByClassName('mentions-bar')
		for (let i = 0; i < 9; i++) {
			// width of bar - 50 (for the image) times ratio of mentions to mentions upper bound
			(<HTMLElement>mentionsBar[i]).style.width = (( (<HTMLElement>barFlexes[i]).clientWidth - 55 ) * ( this.mentionList[i].mentions / this.upperBound )).toString() + 'px'
		}
	}

	getMentions<T>(url: string): Promise<T> {
		return fetch(url)
		  .then(response => {
				if (!response.ok) {
				  throw new Error(response.statusText)
				}
				return response.json()
		  })
		  .catch(err => {
				console.log(err)
		  })
	}

	getTrending() {
		this.showLoading = true
		this.getMentions<any>(`${this.ApiUrl}/api/v1/mentions?limit=${this.limit}&duration=${this.duration}&mention_type=${this.chartType}`)
		.then(players => {
			this.showLoading = false
			this.mentionList = players
			let max = 0
			for (let mention of this.mentionList) {
				if (mention.mentions > max) {
					max = mention.mentions
				}
			}
			// rounds numbers to their second most significant digit (e.g. 1234 -> 1300, 146,899 -> 150,000)
			let orderOfMagnitude = Math.max(Math.pow(10, Math.floor(Math.log10(max)) - 1), 10)
			this.upperBound = Math.ceil(max/orderOfMagnitude)*orderOfMagnitude
		}).catch(err => {
				console.log(err);
				this.showLoading = false
				this.showError = true
		})
	}

	updateDuration(event: any) {
		this.duration = event.target.value
		this.getTrending()
	}

	updateChart(event: any) {
		this.chartType = event.target.value
		this.getTrending()
	}
}
