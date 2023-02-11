import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { MentionlistComponent } from './mentionlist/mentionlist.component';
import { TrendingComponent } from './trending/trending.component';
import { UserMentionsComponent } from './user-mentions/user-mentions.component';

const routes: Routes = [
	{
		path: '',
		component: TrendingComponent
	},
	{
		path: 'charts',
		component: ChartsComponent
	},
	{
		path: ':name',
		component: MentionlistComponent
	},
	{
		path: 'user/:name',
		component: UserMentionsComponent
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
