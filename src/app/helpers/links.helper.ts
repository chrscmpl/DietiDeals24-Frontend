export interface link {
    name: string;
    url: string;
    icon?: string;
}

export const mainPages: link[] = [
    { name: 'Home', url: 'home', icon: 'pi pi-home' },
    { name: 'Your Page', url: 'your-page', icon: 'pi pi-user' },
    { name: 'Create Auction', url: 'create-auction', icon: 'pi pi-plus' },
    {
        name: 'Security & Privacy',
        url: 'your-page/security-privacy',
        icon: 'pi pi-lock',
    },
    { name: 'Help', url: 'help', icon: 'pi pi-question' },
];
