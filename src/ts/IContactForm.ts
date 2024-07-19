export interface IContactForm {
    handler: IOpenEmailApp | IHook;
}

export interface IOpenEmailApp {
    yourEmail: string;
}

export interface IHook {
    url: string;
}