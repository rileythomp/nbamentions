import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-mentionlist',
	templateUrl: './mentionlist.component.html',
	styleUrls: ['./mentionlist.component.less']
})
export class MentionlistComponent implements OnInit {
	readonly ApiUrl = environment.API_URL;
	paramName: string = '';
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
			this.paramName = params['name'];
			this.displayName = this.paramName.replaceAll('-', ' ').toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
			this.displayComments();
			this.displayImage();
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
				this.getData<any>(`${this.ApiUrl}/api/v1/mentions/comments?page=${this.page}&name=${this.paramName}`)
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

	displayImage() {
		this.getData<any>(`${this.ApiUrl}/api/v1/image?name=${this.paramName}`)
		.then(imgUrl => {
			this.imgUrl = imgUrl
		}).catch(err => {
			console.log(err)
		})
	}

	displayComments() {
		this.showEmpty = false;
		this.showLoading = true;
		this.getData<any>(`${this.ApiUrl}/api/v1/mentions/comments?page=${this.page}&name=${this.paramName}&duration=alltime`)
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
				if (this.mentions.length > 0) {
					if (this.mentions[0].mention_type == 'team') {
						(<HTMLImageElement>document.getElementById('img-pic')).style.border = 'none';
						(<HTMLImageElement>document.getElementById('img-pic')).style.borderRadius = '0px';
					} else if (this.mentions[0].mention_type == 'player') {
						(<HTMLImageElement>document.getElementById('img-pic')).style.border = '1px solid black';
						(<HTMLImageElement>document.getElementById('img-pic')).style.borderRadius = '50%';
					}
				}
		}).catch(err => {
				console.log(err);
				this.showLoading = false
				this.showError = true
		})
	}

	displayStats() {
		this.getData<any>(`${this.ApiUrl}/api/v1/mentions/stats?name=${this.paramName}`)
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
