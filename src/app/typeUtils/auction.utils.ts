export enum AuctionType {
    silent = 'silent',
    reverse = 'reverse',
}

export enum AuctionStatus {
    active = 'ACTIVE',
    pending = 'PENDING',
    accepted = 'ACCEPTED',
    rejected = 'REJECTED',
}

export enum SearchPolicy {
    trending = 'trending',
    expiration = 'expiration',
}

export type AuctionSearchParameters = Partial<{
    keywords: string;
    type: AuctionType;
    category: string;
    macroCategory: string;
    policy: SearchPolicy;
}>;
