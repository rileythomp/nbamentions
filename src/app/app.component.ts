import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent {
	readonly ApiUrl = environment.API_URL;
	showModal = false;

	ngOnInit() {
		fetch(`${this.ApiUrl}/api/v1/visit`, {method: 'POST'})
		.then(response => {
			if (!response.ok) {
				throw new Error(response.statusText)
			}
		})
		.catch(err => {
			console.log(err)
		})
	}
}
