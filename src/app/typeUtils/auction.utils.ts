export enum AuctionType {
    silent = 'silent',
    reverse = 'reverse',
}

export enum AuctionStatus {
    active = 'active',
    pending = 'pending',
    accepted = 'accepted',
    rejected = 'rejected',
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
