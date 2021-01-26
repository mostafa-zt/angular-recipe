export class ResponseData {
    data: any;
    message: string | Array<string>;
    success: boolean;
    errors?: Array<string>
    constructor(data: any, message: string | Array<string>, success: boolean, errors?: Array<string>) {
        this.data = data;
        this.message = message;
        this.success = success;
        this.errors = errors;
    }
}