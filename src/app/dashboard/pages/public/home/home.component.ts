import { Component, OnInit } from '@angular/core';
import { ItemsCategoriesService } from 'src/app/services/items-categories.service';
import { BestDeals } from 'src/app/shared/models/BestDeals';
import { FooterDeal } from 'src/app/shared/models/FooterDeal';
import { Items } from 'src/app/shared/models/Items';
import { Slider } from 'src/app/shared/models/Slider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sliders: Slider[] = []

  //only three deals
  deals: BestDeals[] = []

  itemstosale: Items[] = []

  titlepage: string = ''
  descriptionpage: string = ''
  footerdeal: FooterDeal | null = null
  loading:boolean=false
  categories = ItemsCategoriesService.getCategories()

  constructor() { }

  ngOnInit(): void {
    this.titlepage = 'Nuevos productos'
    this.descriptionpage = 'Las mejores rebajas online para comprar este fin de semana'
    this.sliders = [
      {
        background: 'assets/images/slideshow1-2.jpg',
        title: 'Winter Collection Sales',
        descriptionResalt: '70% off ',
        descriptionPart2: 'to everything',
        btnLabel: 'Shop Now',
        btnLink: '#',
      },
      {
        background: 'assets/images/slideshow1-3.jpg',
        title: 'up to 70% off',
        descriptionResalt: 'Classic',
        descriptionPart2: ' Style',
        btnLabel: 'Shop Now',
        btnLink: '#',
      },
      {
        background: 'assets/images/slideshow1-1.jpg',
        title: 'Trendy dress',
        descriptionResalt: 'Winter ',
        descriptionPart2: 'Collection',
        btnLabel: 'Shop Now',
        btnLink: '#',
      }
    ]

    this.deals = [
      {
        image: 'assets/images/cat-1.jpg',
        title: 'Stylish Leather watch',
        dealtext: 'up to 50% off',
        route: 'deal/top1',
        routelabel: 'Shop now',
      },
      {
        image: 'assets/images/cat-2.jpg',
        title: 'Ladies hand bag',
        dealtext: 'up to 40% off',
        route: 'deal/top2',
        routelabel: 'Shop now',
      },
      {
        image: 'assets/images/cat-3.jpg',
        title: 'Trendy shoe',
        dealtext: 'up to 50% off',
        route: 'deal/top3',
        routelabel: 'Shop now',
      }
    ]

    this.itemstosale = [
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

    this.footerdeal = {
      background: '../../../../assets/images/counter.jpg',
      dealname: 'Trendy Suit',
      dealtext: 'Deal of the day 50% Off',
      dealdescription: 'Hurry up! Limited time offer.Grab ot now!',
      routelabel: 'Shop Now',
      routelink: '#',
    }
  }
  //Slider settings
  slideConfig = { "slidesToShow": 1, "slidesToScroll": 1 };
}