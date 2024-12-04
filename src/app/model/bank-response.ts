import { AccountInfo } from "./account-info";

export class BankResponse{
    public responseCode!: number;
    public responseMessage!:string;
    public accountInfo!:AccountInfo;
}