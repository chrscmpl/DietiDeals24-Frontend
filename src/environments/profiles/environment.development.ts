export const environment = {
    backendHost: 'http://localhost:8080',
    passwordPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
    passwordMediumPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?=.{8,})',
    passwordStrongPattern:
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)(?=.{12,})',
    privacyPolicy:
        'DietiDeals24 values your privacy and is committed to safeguarding ' +
        'your personal information. When you visit the platform, we may collect certain non-personal ' +
        'information regarding the nature of the connected client application for analytical purposes. ' +
        'Any personal information you provide, is strictly voluntary and will only be used for the purposes ' +
        'for which it was provided. Moreover, the only information publicly shared on the platform DietiDeals24 ' +
        "are those found in the 'Public Profile' section of your profile, including your username, location, bio, " +
        'and links to external websites. Your contact information (email/phone number) are only shared when necessary ' +
        'to the user you conclude a deal with, and you will be prompted to choose which information to share every ' +
        'time this process is necessary. We do not sell, trade, or rent your personal information to third parties. ' +
        'However, we may disclose your information if required by law or to protect our rights and interests. By ' +
        'using our website, you consent to the terms outlined in this privacy policy. Please review this policy ' +
        'periodically for any updates or changes.',
};