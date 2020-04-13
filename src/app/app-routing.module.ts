import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UpdateCommerceFormComponent} from "./components/update-commerce-form/update-commerce-form.component";
import {ThankYouComponent} from "./components/thank-you/thank-you.component";

const routes: Routes = [
  { path: "", redirectTo: "actualizacion-datos", pathMatch: "full" },
  { path: "actualizacion-datos", component: UpdateCommerceFormComponent},
  { path: "gracias", component: ThankYouComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
