export class Alert {
    constructor(type?: AlertType, messages: Array<{ prop?: string, msg: string }> = []) {
        this.type = type;
        this.messages = messages
    }
    type: AlertType;
    messages: Array<{ prop?: string, msg: string }>;
}

export enum AlertType {
    Success = "success",
    Danger = "danger",
    Warning = "warning"
}
