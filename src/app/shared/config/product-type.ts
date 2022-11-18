export class ProductType {
    static TYPES = [
        { type: 0, name: 'label.prd-type-unknown' },
        { type: 1, name: 'label.prd-type-webapp' },
        { type: 2, name: 'label.prd-type-desktopapp' },
        { type: 3, name: 'label.prd-type-mobileapp' }
    ]

    static getType(id: number): string {
        const type = this.TYPES.find(item => item.type == id)
        if (type == undefined) {
            return this.TYPES[0].name
        }
        return type.name
    }
}