import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-user-mentions',
	templateUrl: './user-mentions.component.html',
	styleUrls: ['./user-mentions.component.less']
})
export class UserMentionsComponent implements OnInit {
	readonly ApiUrl = environment.API_URL;
	displayName: string = '';
	page: number = 1;
	nextPage = 2;
	imgUrl: string = '';
	showLoading: boolean = false;
	showEmpty: boolean = false;
	showError: boolean = false;

	mentions: any[] = [];

	stats: any = {};

	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.displayName = params['name'];
			this.displayComments();
			this.displayStats();
		})
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

	@HostListener('window:scroll', ['$event'])
	onScroll() {
		if (Math.ceil(window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight * 0.8)) {
			if (this.page+1 == this.nextPage) {
				this.showLoading = true;
				this.page += 1
				this.getData<any>(`${this.ApiUrl}/api/v1/redditor/posts?page=${this.page}&name=${this.displayName}&duration=alltime`)
				.then(mentions => {
					this.showLoading = false;
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

	displayComments() {
		this.showEmpty = false;
		this.showLoading = true;
		this.getData<any>(`${this.ApiUrl}/api/v1/redditor/posts?page=${this.page}&name=${this.displayName}&duration=alltime`)
		.then(mentions => {
				this.showLoading = false;
				if (mentions.length == 0) {
					this.mentions = []
					this.showEmpty = true;
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

	displayStats() {
		this.getData<any>(`${this.ApiUrl}/api/v1/redditor/stats?name=${this.displayName}`)
		.then(stats => {
			this.stats = stats
		}).catch(err => {
			console.log(err)
			this.showLoading = false
			this.showError = true
		})
	}

	formatDate(timestamp: number): string | null {
		let published = new Date(timestamp * 1000)
		const datepipe: DatePipe = new DatePipe('en-US')
		return datepipe.transform(published, 'hh:mm - MMMM dd, yyyy')
	}

}
