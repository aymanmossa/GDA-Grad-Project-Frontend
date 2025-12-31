import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { FooterComponent } from './shared/components/footer/footer';
import { Services } from "./services/services";
import { Ads } from './ads/ads';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, Services,Ads],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
