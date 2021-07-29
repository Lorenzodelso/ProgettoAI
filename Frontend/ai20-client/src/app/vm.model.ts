export class Vm {
    id: number;
    vcpu: number;
    gbdisk: number;
    gbram: number;
    status: string;
    idCreatore: string;
    screenVm: any;
    isOwner: boolean;

    constructor(    id: number,
        vcpu: number,
        gbdisk: number,
        gbram: number,
        status: string,
        idCreatore: string,
        screenVm: any,
        isOwner: boolean
    ) {
        this.id=id;
        this.status=status;
        this.vcpu=vcpu;
        this.gbdisk=gbdisk;
        this.gbram=gbram;
        this.idCreatore=idCreatore;
        this.screenVm= screenVm;
        this.isOwner = isOwner;
    }
}


