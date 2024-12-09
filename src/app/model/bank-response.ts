import { AccountInfo } from "./account-info";

export class BankResponse{
    [x: string]: any;
    public responseCode!: number;
    public responseMessage!:string;
    public accountInfo!:AccountInfo;
}