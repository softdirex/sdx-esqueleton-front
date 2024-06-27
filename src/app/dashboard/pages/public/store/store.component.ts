import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { ItemsCategoriesService } from 'src/app/services/items-categories.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    TranslocoModule
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  titlepage: string = 'Tienda'
  loading: boolean = false
  descriptionpage: string = 'Seleccione los mejores productos'
  inputSearch:string=''
  categories = ItemsCategoriesService.getCategories()
  itemstosale = [
    {
      id: 1,
      images: [
        {
          image: 'assets/images/322.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/444.jpg',
          tag: 'img-second'
        }],
      name: 'Floral Kirby',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 329.10,
      deal: true,
      dealprice: 119.90,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    },
    {
      id: 2,
      images: [
        {
          image: 'assets/images/111.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/444.jpg',
          tag: 'img-second'
        }],
      name: 'Open knit switer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 29.10,
      deal: false,
      dealprice: 0,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    },
    {
      id: 3,
      images: [
        {
          image: 'assets/images/222.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/322.jpg',
          tag: 'img-second'
        }],
      name: 'Official trendy',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 355.00,
      deal: true,
      dealprice: 350.00,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    },
    {
      id: 4,
      images: [
        {
          image: 'assets/images/322.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/111.jpg',
          tag: 'img-second'
        }],
      name: 'Frock short',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 249,
      deal: false,
      dealprice: 0,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    },
    {
      id: 4,
      images: [
        {
          image: 'assets/images/444.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/222.jpg',
          tag: 'img-second'
        }],
      name: 'Sleeve dress',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 59.10,
      deal: false,
      dealprice: 0,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    },
    {
      id: 5,
      images: [
        {
          image: 'assets/images/322.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/222.jpg',
          tag: 'img-second'
        }],
      name: 'Stylish dress',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 99.00,
      deal: false,
      dealprice: 0,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    },
    {
      id: 6,
      images: [
        {
          image: 'assets/images/111.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/444.jpg',
          tag: 'img-second'
        }],
      name: 'Body suite',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 329.10,
      deal: false,
      dealprice: 0,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    },
    {
      id: 7,
      images: [
        {
          image: 'assets/images/222.jpg',
          tag: 'img-first'
        },
        {
          image: 'assets/images/322.jpg',
          tag: 'img-second'
        }],
      name: 'Sleeve linen shirt',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum ipsum dicta quod, quia doloremque aut deserunt commodi quis. Totam a consequatur beatae nostrum, earum consequuntur? Eveniet consequatur ipsum dicta recusandae.',
      price: 50.10,
      deal: false,
      dealprice: 0,
      currency: '$',
      sku: 'ABS242F2314',
      category: 1
    }
  ]

  search(){
    console.log(this.inputSearch)
  }
}
