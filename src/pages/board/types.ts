// Define interfaces for the cards and columns
export interface Card {
    id: string;
    company: string;
    position: string;
    deadline: string;
    location: string;
    url: string;
    notes: string;
    salary: number;
    interview_stage: string;
}

export interface Column {
    id: number;
    title: string;
    cards: Card[];
}



