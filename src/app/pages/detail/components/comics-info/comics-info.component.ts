import { Component, Input } from '@angular/core';
interface Info {
  cover: string,
  title: string,
  author?: string,
  intro?: string
}
@Component({
  selector: 'app-comics-info',
  templateUrl: './comics-info.component.html',
  styleUrls: ['./comics-info.component.scss']
})
export class ComicsInfoComponent {
  @Input() info!: Info;

}
