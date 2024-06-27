import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productsingle',
  templateUrl: './productsingle.component.html',
  styleUrls: ['./productsingle.component.css']
})
export class ProductsingleComponent implements OnInit {

  itemId: string|null='';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('item-id');
      console.log(this.itemId)
      // Ahora puedes usar el itemId para cualquier lógica adicional, como cargar datos del producto
    });
  }

}
