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
    data_applied: string;
    card_color: string;
    job_id: Number;
    Favourite: boolean;
}

export interface Column {
    id: number;
    title: string;
    cards: Card[];
}



