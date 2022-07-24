import { Component } from '@angular/core';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.less']
})
export class AppComponent {
	players: any[] = [];
	upperBound: number = 0;

	getTrendingPlayers<T>(url: string): Promise<T> {
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

	ngOnInit() {
		this.getTrendingPlayers<any>('http://localhost:5000/api/v1/trending?limit=30')
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

	ngAfterViewChecked() {
		let barFlexes = document.getElementsByClassName('bar-flex')
		if (barFlexes.length != 10) {
			return
		}
		let mentionsBar = document.getElementsByClassName('mentions-bar')
		for (let i = 0; i < 10; i++) {
			// width of bar - 50 (for the image) times ratio of mentions to mentions upper bound
			(<HTMLElement>mentionsBar[i]).style.width = (( (<HTMLElement>barFlexes[i]).clientWidth - 50 ) * ( this.players[i].mentions / this.upperBound )).toString() + 'px'
		}
	}

}
