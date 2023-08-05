import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { AppDataService } from 'src/app/library/public-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  constructor(private Current: CurrentService,
    public Data: DataService,
    public AppData:AppDataService,
    public router:Router
    ) {
      this.Current.init();
  }

  list = [
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷",
      "selected": false
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    }, {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
    {
      "id": 1688657990457,
      "title": "偷窥孔",
      "cover": "http://localhost:9880/file/L1VzZXJzL3poaWFuZ3plbmcvaUNsb3VkJUU0JUJBJTkxJUU3JTlCJTk4JUVGJUJDJTg4JUU1JUJEJTkyJUU2JUExJUEzJUVGJUJDJTg5L0RvY3VtZW50cy8lRTUlQTQlOUElRTUlQjElODIlRTYlQkMlQUIlRTclOTQlQkIvJUU1JTgxJUI3JUU3JUFBJUE1JUU1JUFEJTk0LyVFNyVBQyVBQzAxJUU1JThEJUI3LzEucG5n",
      "subTitle": "第01卷"
    },
  ]

  on_list($event: HTMLElement) {

  }

  on_item(e: { $event: HTMLElement, data: any }) {
    const $event = e.$event;
    const data = e.data;
    this.router.navigate(['/detail', data.id])
  }

  ngAfterViewInit() {
  }

}
