import { Commons } from "../Commons"

export class PaginatorConfig {
    public status: number = Commons.STATUS_ACTIVE
    public sizes: number[] = [5, 10, 25, 50, 100, 200]
    public currentSizes: number[] = []
    public page: number = 1
    public limit: number = this.sizes[0]
    public total: number = 0
    public firstPage: number = 1
    public lastPage: number = 1
    public currentPage: number = 1
    public allPages: any[] = [1]
    public filtersTag: string | null = null
    public addingFilters: boolean = false
    public statusActive: number = Commons.STATUS_ACTIVE
    public statusInactive: number = Commons.STATUS_INACTIVE
    public statusDeleted: number = Commons.STATUS_DELETED_ACTIVE
    public statusDeletedInactive: number = Commons.STATUS_DELETED_INACTIVE
    public statusInProcess: number = Commons.STATUS_IN_PROCESS
    public loading: boolean = false
}