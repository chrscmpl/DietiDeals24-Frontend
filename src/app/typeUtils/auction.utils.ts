export enum AuctionType {
    silent = 'silent',
    reverse = 'reverse',
}

export enum auctionStatus {
    active = 'active',
    pending = 'pending',
    accepted = 'accepted',
    rejected = 'rejected',
}

export type AuctionSearchParameters = Partial<{
    keywords: string;
    type: string;
    category: string;
    macroCategory: string;
}>;
