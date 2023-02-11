import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-stream',
	templateUrl: './stream.component.html',
	styleUrls: ['./stream.component.less']
})
export class StreamComponent implements OnInit {
	readonly ApiUrl = environment.API_URL;
	showError: boolean = false;
	showLoading: boolean = true;
	mentions: any[] = [];
	page: number = 1;
	nextPage = 2;

	constructor() { }

	ngOnInit(): void {
		this.displayComments();
	}

  	getData<T>(url: string): Promise<T> {
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

	displayComments() {
		this.showLoading = true;
		this.getData<any>(`${this.ApiUrl}/api/v1/mentions/comments?page=${this.page}&duration=alltime`)
		.then(mentions => {
				this.showLoading = false;
        this.showError = false;
				if (mentions.length == 0) {
					this.mentions = []
					return
				}
				for (let i = 0; i < mentions.length; i++) {
					mentions[i].published = this.formatDate(mentions[i].timestamp)
					this.mentions.push(mentions[i])
				}
				this.mentions = mentions
		}).catch(err => {
				console.log(err);
				this.showLoading = false
				this.showError = true
		})
	}

  	@HostListener('window:scroll', ['$event'])
	onScroll() {
		if (Math.ceil(window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight * 0.8)) {
			if (this.page+1 == this.nextPage) {
				this.showLoading = true;
				this.page += 1
				this.getData<any>(`${this.ApiUrl}/api/v1/mentions/comments?page=${this.page}&duration=alltime`)
				.then(mentions => {
					this.showLoading = false;
          this.showError = false;
					if (mentions.length == 0) {
						return
					}
					for (let i = 0; i < mentions.length; i++) {
						mentions[i].published = this.formatDate(mentions[i].timestamp)
					}
					this.mentions = this.mentions.concat(mentions)
					this.nextPage += 1
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}

	formatDate(timestamp: number): string | null {
		let published = new Date(timestamp * 1000)
		const datepipe: DatePipe = new DatePipe('en-US')
		return datepipe.transform(published, 'hh:mm - MMMM dd, yyyy')
	}
}
