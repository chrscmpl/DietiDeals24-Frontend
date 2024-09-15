export const environment = {
    isProd: true,
    backendHost: 'http://192.168.1.21:8080',
    disableWarnings: false,
    maximumCachedUserAuctionsRequests: 9,
    passwordPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
    passwordMediumPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?=.{8,})',
    passwordStrongPattern:
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)(?=.{12,})',
    auctionTitleMaxLength: 100,
    auctionDescriptionMaxLength: 3000,
    auctionMaxDuration: 30 * 24 * 60 * 60 * 1000,
    auctionMinDuration: 1 * 24 * 60 * 60 * 1000,
    auctionMaxPictures: 4,
    auctionMaxPictureSize: 5 * 1024 * 1024,
    auctionPendingTime: 3 * 24 * 60 * 60 * 1000,
    profilePictureMaxSize: 5 * 1024 * 1024,
};
