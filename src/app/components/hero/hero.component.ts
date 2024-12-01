import { Component } from '@angular/core';
import { SliderComponent } from "../slider/slider.component";

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}
