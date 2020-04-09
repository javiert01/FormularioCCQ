import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AgmCoreModule } from '@agm/core'
import { AppRoutingModule } from './app-routing.module';
import { PipesModule } from "../app/pipes/pipes.module";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { AppComponent } from './app.component';
import { UpdateCommerceFormComponent } from './components/update-commerce-form/update-commerce-form.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateCommerceFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAswlswB4nSDMpRuWl9MLTJVBLc4x9J7XE",
      libraries: ["places"]
    }),
    NgxMaterialTimepickerModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
