export class Student {
    id: string;
    serial: string;
    name: string;
    firstName: string;
    courseId: string;
    groupId: string;
    photoStudent: any;

    constructor( id: string, serial: string, name: string, firstName: string, courseId: string, groupId: string, photoStudent: any) {
        this.id = id;
        this.serial = serial
        this.name = name;
        this.firstName = firstName;
        this.courseId = courseId;
        this.groupId = groupId;
		this.photoStudent=photoStudent;
    }
};