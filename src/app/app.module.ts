import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule} from '@angular/common/http';
import { AgmCoreModule } from '@agm/core'
import { AppRoutingModule } from './app-routing.module';
import { PipesModule } from "../app/pipes/pipes.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { AppComponent } from './app.component';
import { UpdateCommerceFormComponent } from './components/update-commerce-form/update-commerce-form.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateCommerceFormComponent,
    HeaderComponent,
    FooterComponent,
    ThankYouComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: "",
      libraries: ["places"]
    }),
    NgxMaterialTimepickerModule,
    MatTooltipModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
