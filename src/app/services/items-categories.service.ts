import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ItemsCategoriesService {
    static getCategories(){
        return [
            {"name": "Blusas", "subcategory": "Tops"},
            {"name": "Camisetas", "subcategory": "Tops"},
            {"name": "Camisas", "subcategory": "Tops"},
            {"name": "Crop Tops", "subcategory": "Tops"},
            {"name": "Polos", "subcategory": "Tops"},
            
            {"name": "Pantalones", "subcategory": "Bottoms"},
            {"name": "Jeans", "subcategory": "Bottoms"},
            {"name": "Leggings", "subcategory": "Bottoms"},
            {"name": "Shorts", "subcategory": "Bottoms"},
            {"name": "Faldas", "subcategory": "Bottoms"},
            
            {"name": "Vestidos Casual", "subcategory": "Vestidos"},
            {"name": "Vestidos de Noche", "subcategory": "Vestidos"},
            {"name": "Vestidos de Fiesta", "subcategory": "Vestidos"},
            {"name": "Vestidos de Verano", "subcategory": "Vestidos"},
            
            {"name": "Chaquetas", "subcategory": "Ropa Exterior"},
            {"name": "Abrigos", "subcategory": "Ropa Exterior"},
            {"name": "Blazers", "subcategory": "Ropa Exterior"},
            {"name": "Chalecos", "subcategory": "Ropa Exterior"},
            {"name": "Parkas", "subcategory": "Ropa Exterior"},
            
            {"name": "Sujetadores", "subcategory": "Ropa Interior"},
            {"name": "Bragas", "subcategory": "Ropa Interior"},
            {"name": "Conjuntos de Lencería", "subcategory": "Ropa Interior"},
            {"name": "Bodys", "subcategory": "Ropa Interior"},
            
            {"name": "Leggings Deportivos", "subcategory": "Ropa Deportiva"},
            {"name": "Tops Deportivos", "subcategory": "Ropa Deportiva"},
            {"name": "Chaquetas Deportivas", "subcategory": "Ropa Deportiva"},
            {"name": "Shorts Deportivos", "subcategory": "Ropa Deportiva"},
            
            {"name": "Pijamas", "subcategory": "Ropa de Dormir"},
            {"name": "Camisones", "subcategory": "Ropa de Dormir"},
            {"name": "Batas", "subcategory": "Ropa de Dormir"},
            
            {"name": "Bolsos", "subcategory": "Accesorios"},
            {"name": "Sombreros", "subcategory": "Accesorios"},
            {"name": "Bufandas", "subcategory": "Accesorios"},
            {"name": "Cinturones", "subcategory": "Accesorios"},
            {"name": "Joyas", "subcategory": "Accesorios"},
            
            {"name": "Camisetas", "subcategory": "Tops"},
            {"name": "Polos", "subcategory": "Tops"},
            {"name": "Camisas", "subcategory": "Tops"},
            {"name": "Sudaderas", "subcategory": "Tops"},
            
            {"name": "Pantalones", "subcategory": "Bottoms"},
            {"name": "Jeans", "subcategory": "Bottoms"},
            {"name": "Shorts", "subcategory": "Bottoms"},
            {"name": "Pantalones de Chándal", "subcategory": "Bottoms"},
            
            {"name": "Chaquetas", "subcategory": "Ropa Exterior"},
            {"name": "Abrigos", "subcategory": "Ropa Exterior"},
            {"name": "Blazers", "subcategory": "Ropa Exterior"},
            {"name": "Chalecos", "subcategory": "Ropa Exterior"},
            
            {"name": "Calzoncillos", "subcategory": "Ropa Interior"},
            {"name": "Boxers", "subcategory": "Ropa Interior"},
            {"name": "Ropa Térmica", "subcategory": "Ropa Interior"},
            
            {"name": "Pantalones Deportivos", "subcategory": "Ropa Deportiva"},
            {"name": "Camisetas Deportivas", "subcategory": "Ropa Deportiva"},
            {"name": "Chaquetas Deportivas", "subcategory": "Ropa Deportiva"},
            {"name": "Shorts Deportivos", "subcategory": "Ropa Deportiva"},
            
            {"name": "Pijamas", "subcategory": "Ropa de Dormir"},
            {"name": "Batas", "subcategory": "Ropa de Dormir"},
            
            {"name": "Gorros", "subcategory": "Accesorios"},
            {"name": "Bufandas", "subcategory": "Accesorios"},
            {"name": "Cinturones", "subcategory": "Accesorios"},
            {"name": "Relojes", "subcategory": "Accesorios"},
            {"name": "Carteras", "subcategory": "Accesorios"},
            
            {"name": "Bodies", "subcategory": "Ropa para Bebés (0-24 meses)"},
            {"name": "Mamelucos", "subcategory": "Ropa para Bebés (0-24 meses)"},
            {"name": "Conjuntos", "subcategory": "Ropa para Bebés (0-24 meses)"},
            {"name": "Pijamas", "subcategory": "Ropa para Bebés (0-24 meses)"},
            
            {"name": "Vestidos", "subcategory": "Ropa para Niñas"},
            {"name": "Camisetas", "subcategory": "Ropa para Niñas"},
            {"name": "Faldas", "subcategory": "Ropa para Niñas"},
            {"name": "Pantalones", "subcategory": "Ropa para Niñas"},
            {"name": "Sudaderas", "subcategory": "Ropa para Niñas"},
            
            {"name": "Camisetas", "subcategory": "Ropa para Niños"},
            {"name": "Pantalones", "subcategory": "Ropa para Niños"},
            {"name": "Shorts", "subcategory": "Ropa para Niños"},
            {"name": "Sudaderas", "subcategory": "Ropa para Niños"},
            {"name": "Conjuntos Deportivos", "subcategory": "Ropa para Niños"},
            
            {"name": "Pijamas", "subcategory": "Ropa de Dormir"},
            {"name": "Batas", "subcategory": "Ropa de Dormir"},
            
            {"name": "Gorras", "subcategory": "Accesorios"},
            {"name": "Bufandas", "subcategory": "Accesorios"},
            {"name": "Guantes", "subcategory": "Accesorios"},
            {"name": "Mochilas", "subcategory": "Accesorios"},
            
            {"name": "Ropa de Verano", "subcategory": "Ropa de Temporada"},
            {"name": "Ropa de Invierno", "subcategory": "Ropa de Temporada"},
            {"name": "Ropa de Otoño", "subcategory": "Ropa de Temporada"},
            {"name": "Ropa de Primavera", "subcategory": "Ropa de Temporada"},
            
            {"name": "Trajes", "subcategory": "Ropa Formal"},
            {"name": "Blazers", "subcategory": "Ropa Formal"},
            {"name": "Pantalones de Vestir", "subcategory": "Ropa Formal"},
            {"name": "Vestidos de Cóctel", "subcategory": "Ropa Formal"},
            
            {"name": "Jeans", "subcategory": "Ropa Casual"},
            {"name": "Camisetas", "subcategory": "Ropa Casual"},
            {"name": "Sudaderas", "subcategory": "Ropa Casual"},
            {"name": "Polos", "subcategory": "Ropa Casual"}
          ]
          
    }
}