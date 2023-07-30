import { Component } from '@angular/core';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent {

  constructor() { }

  comics = {
    title: "",
    cover: "",
    id: "",
    status: "",
    type: "",

  }

  chapter =
    {
      "id": 1225430,
      "ord": 42,
      "read": 1,
      "size": 0,
      "title": "异世界是大同人时代的故事",
      "cover": "http://i0.hdslb.com/bfs/manga-static/b72a72bfbe6e5f52a6165f4bd3869fb7486deb3d.jpg",
      "pub_time": "2023-07-12 12:01:44",
      "image_count": 27
    }

  images = {
    id: "",
    "images": [
      {
        "src": "/bfs/manga/df1ef759f9f472cb442d70a00d973c8d76a98f18.jpg",
        "width": 2000,
        "height": 2843
      },
    ]
  }

  last_read_comics = {}

  last_read_chapter = {}

  comics_config = {}


}
