import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-trending',
	templateUrl: './trending.component.html',
	styleUrls: ['./trending.component.less']
})
export class TrendingComponent implements OnInit {
	readonly ApiUrl = environment.API_URL;
	readonly MentionsLimit = 30;
	readonly SearchLimit = 10;

	mentionList: any[] = [];
	searchResults: any[] = [];

	upperBound: number = 0;
	duration: string = 'day';
	chartType: string = 'player';
	showError: boolean = false;
	showLoading: boolean = false;
	setBars: boolean = false;
	showSearchResults = false;
	
	constructor() { }

	ngOnInit() {
		this.setBars = true;
		this.getTrending()
	}

	ngAfterViewChecked() {
		if (!this.setBars) {
			return
		}
		let barFlexes = document.getElementsByClassName('bar-flex')
		if (barFlexes.length != 9) {
			return
		}
		let mentionsBar = document.getElementsByClassName('mentions-bar')
		let barWidth = (<HTMLElement>barFlexes[0]).clientWidth;
		for (let i = 0; i < 9; i++) {
			// width of bar - 50 (for the image) times ratio of mentions to mentions upper bound
			(<HTMLElement>mentionsBar[i]).style.width = ((barWidth - 55 ) * (this.mentionList[i].mentions / this.upperBound )).toString() + 'px'
		}
	}

	updateDuration(event: any) {
		this.setBars = true;
		this.duration = event.target.value
		this.getTrending()
	}

	updateChart(event: any) {
		this.setBars = true;
		this.chartType = event.target.value
		this.getTrending()
	}

	searchName(ev: any) {
		let search = ev.target.value.slice(0, 25);
		if (search.length < 1) {
			this.showSearchResults = false;
			return;
		}
		this.setBars = false;
		this.mentionsApi<any>(`${this.ApiUrl}/api/v1/search?limit=${this.SearchLimit}&search=${search}`)
		.then(names => {
			this.searchResults = names;
			this.showSearchResults = true;
		})
		.catch(err => {
			console.log(err);
		})
	}

	mentionsApi<T>(url: string): Promise<T> {
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
		this.mentionsApi<any>(`${this.ApiUrl}/api/v1/mentions?limit=${this.MentionsLimit}&duration=${this.duration}&mention_type=${this.chartType}`)
		.then(resp => {
			this.showLoading = false
			this.mentionList = resp
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
}
