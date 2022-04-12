export interface Node {
    id: string;
    title: string;
    depends?: Array<string>;

    elements?: Element;
}

export interface Element {
    required?: Array<string>;
    taken?: Array<string>;
    obtained?: Array<string>;
}
