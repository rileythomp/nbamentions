import { Component } from '@angular/core';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.less']
})
export class AppComponent {
	readonly ApiUrl = 'http://localhost:5000';
	readonly limit = 25;

	players: any[] = [];
	upperBound: number = 0;
	duration: string = 'week';

	getPlayers<T>(url: string): Promise<T> {
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

	getTrendingPlayers() {
		this.getPlayers<any>(`${this.ApiUrl}/api/v1/trending?limit=${this.limit}&duration=${this.duration}`)
		.then(players => {
				this.players = players
				let max = 0
				for (let player of this.players) {
					if (player.mentions > max) {
						max = player.mentions
					}
				}
				// rounds numbers to their second most significant digit (e.g. 1234 -> 1300, 146,899 -> 150,000)
				let orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(max)) - 1)
				this.upperBound = Math.ceil(max/orderOfMagnitude)*orderOfMagnitude
		}).catch(err => {
				console.log(err);
		})
	}

	ngOnInit() {
		this.getTrendingPlayers()
	}

	ngAfterViewChecked() {
		let barFlexes = document.getElementsByClassName('bar-flex')
		if (barFlexes.length != 9) {
			return
		}
		let mentionsBar = document.getElementsByClassName('mentions-bar')
		for (let i = 0; i < 9; i++) {
			// width of bar - 50 (for the image) times ratio of mentions to mentions upper bound
			(<HTMLElement>mentionsBar[i]).style.width = (( (<HTMLElement>barFlexes[i]).clientWidth - 55 ) * ( this.players[i].mentions / this.upperBound )).toString() + 'px'
		}
	}

	updateChart(event: any) {
		this.duration = event.target.value
		this.getTrendingPlayers()
	}
}
