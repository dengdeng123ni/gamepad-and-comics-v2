import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
   constructor(
    public current:CurrentService,
    public data:DataService,
    public router: Router,
    public route: ActivatedRoute
    ){
      let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
     id$.subscribe(params => this.current._init(params.get('id') as string,params.get('sid') as string))
    //  console.log();

   }



}
