export interface STATUS_TYPE {
    id: number;
    name: string;
    description: string;
}
export default class StatusTypeConfig {
    static readonly DELETED_INACTIVE: STATUS_TYPE = {
        id: -1,
        name: 'DELETED INACTIVE',
        description: 'Cuando se deshabilita el registro inactivo'
    }

    static readonly DELETED_ACTIVE: STATUS_TYPE = {
        id: 0,
        name: 'DELETED',
        description: 'Cuando se deshabilita el registro activo'
    }

    static readonly ACTIVE: STATUS_TYPE = {
        id: 1,
        name: 'ACTIVE',
        description: 'El registro se encuentra disponible'
    }

    static readonly INACTIVE: STATUS_TYPE = {
        id: 2,
        name: 'INACTIVE',
        description: 'Pendiente de aprobacion, luego pasa a activo'
    }

    static readonly IN_PROCESS: STATUS_TYPE = {
        id: 3,
        name: 'IN_PROCESS',
        description: 'Registro bloqueado no se puede modificar hasta que finalice dicho proceso'
    }

    static readonly LOCKED: STATUS_TYPE = {
        id: 4,
        name: 'LOCKED',
        description: 'Registro bloqueado no se puede modificar'
    }

    static readonly ALL_STATUS = [this.DELETED_INACTIVE, this.DELETED_ACTIVE, this.ACTIVE, this.INACTIVE, this.IN_PROCESS, this.LOCKED]

    static getStatus(id: number): number {
        const status = this.ALL_STATUS.find(item => item.id === id)
        return status != undefined ? status.id : this.LOCKED.id
    }
}