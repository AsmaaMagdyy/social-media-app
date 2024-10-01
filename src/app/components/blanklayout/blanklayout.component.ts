import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavblankComponent } from "../navblank/navblank.component";

@Component({
  selector: 'app-blanklayout',
  standalone: true,
  imports: [RouterOutlet, NavblankComponent],
  templateUrl: './blanklayout.component.html',
  styleUrl: './blanklayout.component.scss'
})
export class BlanklayoutComponent {

}
