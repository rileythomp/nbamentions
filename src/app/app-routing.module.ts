import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MentionlistComponent } from './mentionlist/mentionlist.component';
import { TrendingComponent } from './trending/trending.component';

const routes: Routes = [
	{
		path: '',
		component: TrendingComponent
	},
	{
		path: ':name',
		component: MentionlistComponent
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
