export interface IData {
    company: {
        [key: string]: {
            src: string;
            des: string;
            price: number;
        }[];
    };
    country: {
        [key: string]: string;
    };
}

export interface IState {
    data: IData;
    countries: {};
    selectedCallerCountryKey: string | null;
    selectedCalleeCountryKey: string | null;
    selectedCheckboxes: string[];
    checkboxStates: { [key: string]: boolean };
}
