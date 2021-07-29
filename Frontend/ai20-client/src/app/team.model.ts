export class Team {
    id: number;
    name: string;
    status: number;
    vcpuTot: number;
    vcpuUsati: number;
    maxVmAccese: number;
    vmAccese: number;
    gbramTot: number;
    gbramUsati: number;
    gbdiskTot: number;
    gbdiskUsati: number;

    constructor( id: number,
        name: string,
        status: number,
        vcpuTot: number,
        vcpuUsati: number,
        maxVmAccese: number,
        vmAccese: number,
        gbramTot: number,
        gbramUsati: number,
        gbdiskTot: number,
        gbdiskUsati: number
    ) {
        this.id=id;
        this.name=name;
        this.status=status;
        this.vcpuTot=vcpuTot;
        this.maxVmAccese=maxVmAccese;
        this.vmAccese=vmAccese;
        this.gbramTot=gbramTot;
        this.gbramUsati=gbramUsati;
        this.gbdiskTot=gbdiskTot;
        this.gbdiskUsati=gbdiskUsati;
    }
};