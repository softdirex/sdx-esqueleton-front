export interface CommercialBusiness{ 
    type: number
    label: string
    value: string 
}

export class CommercialBusinessType {
    static TYPES = [
        { type: 0, label: 'label.cmb-type-other', value: 'Other' },
        { type: 1, label: 'label.cmb-type-agro',value: 'Agriculture'  },
        { type: 2, label: 'label.cmb-type-mining',value:'Mining' },
        { type: 3, label: 'label.cmb-type-indusrty',value:'Industry' },
        { type: 4, label: 'label.cmb-type-energy-supply',value:'Energy supply' },
        { type: 5, label: 'label.cmb-type-water-supply',value:'Water supply' },
        { type: 6, label: 'label.cmb-type-building',value:'Building' },
        { type: 7, label: 'label.cmb-type-trade',value:'Trade' },
        { type: 8, label: 'label.cmb-type-transportation',value:'Transportation' },
        { type: 9, label: 'label.cmb-type-storage',value:'Storage' },
        { type: 10, label: 'label.cmb-type-accommodation',value:'Accommodation' },
        { type: 11, label: 'label.cmb-type-feeding',value:'Feeding' },
        { type: 12, label: 'label.cmb-type-it',value:'IT and communications' },
        { type: 13, label: 'label.cmb-type-financial',value:'Financial and insurance' },
        { type: 14, label: 'label.cmb-type-real-estate',value:'Real estate' },
        { type: 15, label: 'label.cmb-type-science',value:'Science and Technology' },
        { type: 16, label: 'label.cmb-type-management',value:'Management' },
        { type: 17, label: 'label.cmb-type-public',value:'Public administration and defense' },
        { type: 18, label: 'label.cmb-type-teaching',value:'Teaching' },
        { type: 19, label: 'label.cmb-type-health',value:'Health' },
        { type: 20, label: 'label.cmb-type-entertainment',value:'Entertainment' },
        { type: 21, label: 'label.cmb-type-trips',value:'Travels and tourism' },
        { type: 22, label: 'label.cmb-type-rental-service',value:'Rental service' }
    ]

    static getLangCode(value: string): string {
        const type = this.TYPES.find(item => item.value == value)
        if (type == undefined) {
            return this.TYPES[0].label
        }
        return type.label
    }
}