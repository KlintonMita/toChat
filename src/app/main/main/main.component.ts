import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';



@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatCardModule, MatMenuModule, MatIconModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
