export interface student {
    name?: string,
    prename?: string,
    id?: string,
    subject?: string,
    year?: string,
    department?: department[]
}

export interface department {
    startingdate?: string,
    endingdate?: string,
    abbreviation?: string
}