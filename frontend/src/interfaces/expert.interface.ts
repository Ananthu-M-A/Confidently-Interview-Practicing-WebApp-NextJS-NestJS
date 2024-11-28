interface Availability {
    date: string;
    slots: string[];
}

export interface Expert {
    _id: string,
    email: string,
    fullname: string,
    specialization: string,
    yearsOfExperience: 5,
    availability: Availability[],
    active: boolean,
    createdAt: string,
    updatedAt: string
}