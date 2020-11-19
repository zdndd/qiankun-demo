export interface TransferItem {
    title: string;
    direction?: 'left' | 'right';
    group?: { title: string; key: string };
    disabled?: boolean;
    checked?: boolean;
    _hiden?: boolean;
    subdatatype?: any;
    // tslint:disable-next-line:no-any
    [key: string]: any;
}

export interface TransferCanMove {
    direction: string;
    list: TransferItem[];
}

export interface TransferChange {
    from: string;
    to: string;
    list: TransferItem[];
}

export interface TransferSearchChange {
    direction: string;
    value: string;
}

export interface TransferSelectChange {
    direction: string;
    checked: boolean;
    list: TransferItem[];
    item: TransferItem;
}
