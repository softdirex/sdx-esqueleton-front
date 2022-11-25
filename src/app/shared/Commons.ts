import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import StatusTypeConfig from './config/status-type';
import * as uuid from 'uuid';
import { ProductType } from './config/product-type';
import { OwnerConfig } from './interfaces/core/owner-config';

export interface FILTER {
    label: string
    field: string
    value: string
    enabled: boolean
}

export class Commons {
    static readonly SDX = 'Softdirex'
    static readonly SESSION_KEY = 'cus_S'
    static readonly OWNER_KEY = 'own_S'
    // CUSTOMER's roles
    static readonly USER_ROL_BASIC = 'V'
    static readonly USER_ROL_RW = 'RW'
    static readonly USER_ROL_RWX = 'RWX'
    // ADMIN's roles
    static readonly USER_ROL_S_RW = 'S_RW'
    static readonly USER_ROL_S_RWX = 'S_RWX'

    // https://docs.google.com/spreadsheets/d/1Ibr_vxVzMILFJXGrDlIummIkQ11mSYCQT5j5dNT8R3o/edit#gid=0
    static readonly USER_TYPE_BASIC = 'CLI'
    static readonly USER_TYPE_MEDIUM = 'USU'
    static readonly USER_TYPE_APP = 'APP'

    static readonly STATUS_DELETED_INACTIVE = StatusTypeConfig.DELETED_INACTIVE.id
    static readonly STATUS_DELETED_ACTIVE = StatusTypeConfig.DELETED_ACTIVE.id
    static readonly STATUS_ACTIVE = StatusTypeConfig.ACTIVE.id
    static readonly STATUS_INACTIVE = StatusTypeConfig.INACTIVE.id
    static readonly STATUS_IN_PROCESS = StatusTypeConfig.IN_PROCESS.id

    static readonly ICON_ERROR = 'error'
    static readonly ICON_WARNING = 'warning'
    static readonly ICON_SUCCESS = 'success'
    static readonly DF_AVATAR = './assets/img/png/df_avatar.png'
    static readonly DF_PRODUCT_LOGO = './assets/img/png/product_logo_df.png'
    static readonly DF_COMPANY_LOGO = './assets/img/png/company_logo_df.png'

    static readonly PATH_MAIN = 'home'
    static readonly PATH_PRODUCT = 'product'
    static readonly PATH_MY_COMPANY = 'organization'
    static readonly PATH_MY_COMPANY_MEMBERS_CREATE = this.PATH_MY_COMPANY + '/add'
    static readonly PATH_MY_COMPANY_MEMBERS_EDIT = this.PATH_MY_COMPANY + '/edit'
    static readonly PATH_MY_PURCHASES = 'payment-history'
    static readonly PATH_MY_LICENCES = 'subscriptions'
    static readonly PATH_MY_CUSTOMER = 'user/profile'
    static readonly PATH_PRODUCT_SINGLE = 'product-single'
    static readonly PATH_CART = 'cart'
    static readonly PATH_CHECKOUT = 'checkout'

    /* BEGIN - ENDPOINT NECESSARY FOR EMAIL DIRECT LINK */
    static readonly PATH_LOGIN = 'login'
    static readonly PATH_REGISTER = 'register'
    static readonly PATH_PWD_REC = 'password-recovery'
    static readonly PATH_PWD_CHN = 'change-password'
    static readonly PATH_MAIL_VER = 'verify-mail'
    /* END - ENDPOINT NECESSARY FOR EMAIL DIRECT LINK */

    static readonly PATH_PURCHASE = 'payment'
    static readonly PATH_TERMS = 'terms'
    static readonly PATH_SUPPORT = 'support'
    static readonly PATH_ABOUT = 'about'
    static readonly PATH_CONTACT = 'contact'
    static readonly PATH_FACTS = 'faqs'
    static readonly PATH_FAVORITES = 'user/favorites'
    static readonly PATH_ORDERS = 'user/orders'
    static readonly PATH_PDF_VIEWER = environment.coreFrontendEndpoint + 'pdf-viewer'

    /* BEGIN - ENDPOINT ONLY WITH LICENCE ( path ends with *_WITH_LIC ) */
    static readonly PATH_CONFIG_WITH_LIC = 'configuration'
    /* END - ENDPOINT ONLY WITH LICENCE */

    static readonly PLAN_TYPES: any[] = [
        { value: -1, name: 'label.wrong-type' },
        { value: 0, name: 'label.trial-plan' },
        { value: 1, name: 'label.monthly-plan' },
        { value: 2, name: 'label.bi-monthly-plan' },
        { value: 3, name: 'label.quarterly-plan' },
        { value: 6, name: 'label.half-year-plan' },
        { value: 12, name: 'label.annual-plan' },
        { value: 24, name: 'label.biannual-plan' },
        { value: 36, name: 'label.triple-year-plan' }
    ]

    static readonly PROVINCE_TYPES: any[] = [
        { value: 'province', name: 'personal-data.province-1' },
        { value: 'state', name: 'personal-data.province-2' },
        { value: 'commune', name: 'personal-data.province-3' }
    ]

    static readonly CONFIRM = true
    static readonly CANCEL = false

    static readonly MAX_COUNTRIES = 251
    static readonly MOBILE_WIDTH = 991

    static readonly USER_ROLES: any[] = [
        { value: this.USER_ROL_BASIC, name: 'label.rol-v-name' },
        { value: this.USER_ROL_RW, name: 'label.rol-rw-name' },
        { value: this.USER_ROL_RWX, name: 'label.rol-rwx-name' },
        { value: this.USER_ROL_S_RW, name: 'label.rol-srw-name' },
        { value: this.USER_ROL_S_RWX, name: 'label.rol-srwx-name' }
    ]

    static readonly GENDER_TYPES: any[] = [
        { value: '0', name: 'personal-data.sex-0' },
        { value: '1', name: 'personal-data.sex-1' },
        { value: '2', name: 'personal-data.sex-2' },
        { value: '3', name: 'personal-data.sex-3' }
    ]

    static readonly USER_USU_ROLES: any[] = [
        { value: this.USER_ROL_BASIC, name: 'label.rol-v-name' },
        { value: this.USER_ROL_RW, name: 'label.rol-rw-name' },
        { value: this.USER_ROL_RWX, name: 'label.rol-rwx-name' }
    ]

    static readonly CONTACT_DATAS: any[] = [
        { label: 'label.personal-email', field: 'MAIL', value: '', enabled: false },
        { label: 'label.phone1', field: 'PHONE', value: '', enabled: false },
        { label: 'label.secondary-email', field: 'MAIL_2', value: '', enabled: false },
        { label: 'label.secondary-phone', field: 'PHONE_2', value: '', enabled: false },
        { label: 'label.twitter', field: 'TWITTER', value: '', enabled: false },
        { label: 'label.facebook', field: 'FACEBOOK', value: '', enabled: false },
        { label: 'label.instagram', field: 'INSTAGRAM', value: '', enabled: false },
        { label: 'label.reddit', field: 'REDDIT', value: '', enabled: false },
        { label: 'label.linkedin', field: 'LINKEDIN', value: '', enabled: false },
        { label: 'label.youtube', field: 'YOUTUBE', value: '', enabled: false },
        { label: 'label.pinterest', field: 'PINTEREST', value: '', enabled: false },
    ]

    static readonly USER_TYPES: any[] = [
        { value: this.USER_TYPE_BASIC, name: 'label.client' },
        { value: this.USER_TYPE_MEDIUM, name: 'label.user' },
        { value: this.USER_TYPE_APP, name: 'label.app' }
    ]

    static readonly DOCUMENT_DATA_TYPES: any[] = [
        { value: 'PASSPORT', name: 'personal-data.passport' },
        { value: 'DNI', name: 'personal-data.dni' },
        { value: 'RUT', name: 'personal-data.rut' }
    ]

    static readonly PAYMENT_TYPES: any[] = [
        { value: 0, name: 'label.paymenttype-other' },
        { value: 1, name: 'label.paymenttype-pay-online' },
        { value: 2, name: 'label.paymenttype-cash' },
        { value: 3, name: 'label.paymenttype-wire-transfer' },
        { value: 4, name: 'label.paymenttype-check' }
    ]

    static readonly TERM_CODES = [
        {
            id: 1,
            code: 'privacy-policy'
        },
        {
            id: 2,
            code: 'terms-conditions'
        },
        {
            id: 3,
            code: 'terms-sales'
        },
        {
            id: 5,
            code: 'cookie-policy'
        }
    ]

    static readonly PLAN_CATEGORIES: any[] = [
        { value: 'TRIAL', name: 'label.trial-plan', icon: 'fas fa-flask' },
        { value: 'BASIC', name: 'label.basic-plan', icon: 'fas fa-bookmark' },
        { value: 'MEDIUM', name: 'label.medium-plan', icon: 'fas fa-certificate' },
        { value: 'PREMIUM', name: 'label.premium-plan', icon: 'fas fa-award' }
    ]

    /**
     * 
     * @returns a 11 characters of password with sdx in end for backend validation
     */
    static createPasswordForUser(): string {
        const pwd = uuid.v4();
        return pwd.substring(0, 8).toLowerCase() + 'sdx'
    }

    static validField(arg: any) {
        return arg != null && arg != undefined
    }

    static validNumber(str: string): boolean {
        if (this.validField(str)) {
            if (typeof str !== 'string') {
                return false;
            }
            if (str.trim() === '') {
                return false;
            }
            return !Number.isNaN(Number(str));
        }
        return false
    }

    static getCusRol(arg: string) {
        var item = this.USER_ROLES.find(item => item.value === arg.toUpperCase())
        if (item == undefined) {
            return this.USER_ROLES[0].name
        } else {
            return item.name
        }
    }

    static getCusType(arg: string) {
        var item = this.USER_TYPES.find(item => item.value === arg.toUpperCase())
        if (item == undefined) {
            return this.USER_TYPES[0].name
        } else {
            return item.name
        }
    }

    /**
     * Return the traductor field for product type
     * @param id 
     * @returns 
     */
    static getProductType(id: any): string {
        return ProductType.getType(id)
    }

    /**
     * Decrypt json object
     * @param encryptedData 
     * @returns 
     */
    static decryptDataGlobal(encryptedData: string | null): any {
        if (encryptedData != null && encryptedData != undefined) {
            var bytes = CryptoJS.AES.decrypt(encryptedData, environment.coreTransactionKey);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return null
    }

    /**
     * Encrypt json object
     * @param jsonData 
     * @returns 
     */
    static encryptDataGlobal(jsonData: any) {
        if (this.validField(jsonData)) {
            return CryptoJS.AES.encrypt(JSON.stringify(jsonData), environment.coreTransactionKey).toString();
        }
        return ''
    }

    /**
     * Encrypt string value
     * @param stringData 
     * @returns 
     */
    static encryptString(stringData: any): string {
        if (this.validField(stringData)) {
            try {
                return window.btoa(window.btoa(stringData))
            } catch (error) {
                return '-'
            }

        }
        return ''
    }

    /**
     * Decrypt string value
     * @param encryptedString 
     * @returns 
     */
    static decryptString(encryptedString: string): any {
        if (this.validField(encryptedString)) {
            try {
                return window.atob((window.atob(encryptedString)))
            } catch (error) {
                return '-'
            }

        }
        return '-'
    }

    static sessionOpenCustomer(customer: any, credentials: string) {
        const now: Date = new Date()
        const sessionSign = {
            customer: customer,
            key: credentials,
            time: now.getTime()
        }
        sessionStorage.setItem(this.SESSION_KEY, this.encryptDataGlobal(sessionSign))
    }

    static sessionReloadCustomer(customer: any) {
        const now: Date = new Date()
        var sessionSign = this.decryptDataGlobal(sessionStorage.getItem(this.SESSION_KEY))
        sessionSign.customer = customer
        sessionSign.time = now.getTime()
        sessionStorage.setItem(this.SESSION_KEY, this.encryptDataGlobal(sessionSign))
    }

    static sessionIsOpen(): boolean {
        return this.decryptDataGlobal(sessionStorage.getItem(this.SESSION_KEY)) != null
    }

    static sessionRenew() {
        const now: Date = new Date()
        const sessionSign: any = this.decryptDataGlobal(sessionStorage.getItem(this.SESSION_KEY))

        if (sessionSign != null) {
            // renew session time
            sessionSign.time = now.getTime()
            sessionStorage.setItem(this.SESSION_KEY, this.encryptDataGlobal(sessionSign))
        }
    }

    static sessionClose() {
        sessionStorage.removeItem(this.SESSION_KEY)
    }

    static sessionObject(): any {
        return this.decryptDataGlobal(sessionStorage.getItem(this.SESSION_KEY))
    }

    static sessionIsSuperUser(): any {
        var isSuper: boolean = false
        const sessionSign: any = this.decryptDataGlobal(sessionStorage.getItem(this.SESSION_KEY))

        if (sessionSign != null && this.validField(sessionSign.customer.rol)) {
            isSuper = (sessionSign.customer.rol == this.USER_ROL_S_RW || sessionSign.customer.rol == this.USER_ROL_S_RWX)
        }
        return isSuper
    }

    static sessionRol(): string {
        var rol: string = this.USER_ROL_BASIC
        const sessionSign: any = this.decryptDataGlobal(sessionStorage.getItem(this.SESSION_KEY))

        if (sessionSign != null && this.validField(sessionSign.customer.rol)) {
            rol = sessionSign.customer.rol
        }
        return rol
    }

    static sessionCredentials(): string {
        var credentials: string = ''
        const sessionSign: any = this.decryptDataGlobal(sessionStorage.getItem(this.SESSION_KEY))

        if (sessionSign != null && this.validField(sessionSign.key)) {
            credentials = sessionSign.key
        }
        return credentials
    }

    static openWithExternalToken(path: string) {
        window.open(environment.coreFrontendEndpoint + 'store?to=' + path + '&token=' + Commons.encryptString(sessionStorage.getItem('cus_S')))
    }

    static openWithoutExternalToken(path: string) {
        window.open(environment.coreFrontendEndpoint + path)
    }

    static setOwnerConfig(ownerConfig: OwnerConfig) {
        sessionStorage.setItem(this.OWNER_KEY, this.encryptDataGlobal(ownerConfig))
    }

    /**
     * If result is null then call getConfig service
     * @returns 
     */
    static getOwnerConfig(): OwnerConfig | null {
        const result = this.decryptDataGlobal(sessionStorage.getItem(this.OWNER_KEY))
        if (result == null) {
            var ownerDetail: OwnerConfig = {
                company_name: environment.dfConfigCompanyName,
                slogan: environment.dfConfigSlogan,
                about: environment.dfConfigAbout,
                mission: environment.dfConfigMission,
                vision: environment.dfConfigVision,
                contact_phone: environment.dfConfigContactPhone,
                contact_mail: environment.dfConfigContactMail,
                address: environment.dfConfigAddress,
                city: environment.dfConfigCity,
                country: environment.dfConfigCountry,
                terms_filename: environment.dfConfigTermsFilename,
                lang: environment.dfConfigLang
            }
            if (environment.ownerId != 0) {

                const customer = (Commons.sessionIsOpen()) ? Commons.sessionObject().customer : null
                if (Commons.validField(customer) && Commons.validField(customer.owner) && Commons.validField(customer.owner.config)) {
                    const customer = Commons.sessionObject().customer
                    return customer.owner.config
                } else {
                    return null

                }
            } else {
                const customer = (Commons.sessionIsOpen()) ? Commons.sessionObject().customer : null
                if (Commons.validField(customer) && Commons.validField(customer.owner) && Commons.validField(customer.owner.config)) {
                    return customer.owner.config
                }
                return ownerDetail
            }
        } else {
            return result
        }

    }
}