export const environment = {
    isProd: false,
    backendHost: 'http://localhost:8080',
    disableWarnings: false,
    passwordPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
    passwordMediumPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?=.{8,})',
    passwordStrongPattern:
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)(?=.{12,})',
};
