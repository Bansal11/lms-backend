class ResponseFormatter {
    private statusCode: number;
    private message: string;
    private data: any;

    constructor(statusCode: number, message: string, data: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    format() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        };
    }
}

export default ResponseFormatter;