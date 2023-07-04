import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAnalysisComponent } from './Components/product-analysis/product-analysis.component';

const routes: Routes = [
  {path:'', component: ProductAnalysisComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
