export class BankStatement {
    public customerName: string | undefined;
    public accountNumber: string | undefined;
    public createdOn: string | undefined;
    public pdfFile: Uint8Array | undefined;
}