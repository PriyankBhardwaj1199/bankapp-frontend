export class Statistics{
    public totalUsers!:number;
    public activeUsers!:number;
    public inactiveUsers!:number;
    public suspendedUsers!:number;
    public closedAccounts!:number;
    public pendingAccountApprovals!:number;
    public deactivatedAccounts!:number;

    public totalTransactions!:number;

    // cards related statistics
    public pendingCardApprovals!:number;
    public inactiveCreditCards!:number;
    public inactiveDebitCards!:number;
    public activeDebitCards!:number;
    public activeCreditCards!:number;
    public expiredCards!:number;
    public revokedCards!:number;
    public totalCards!:number;

    public totalBankStatements!:number;
}