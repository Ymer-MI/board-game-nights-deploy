export enum BGGDBFields {
    ID,
    NAME,
    YEAR_PUBLISHED,
    IS_EXPANSION
}

export interface IBGGDBRow {
    id: number
    name: string
    yearPublished: number
    isExpansion: boolean
}

class BGGEntry {
    private id: number
    private name: string
    private yearPublished: number
    private isExpansion: boolean

    constructor(data: IBGGDBRow) {
        this.id = data.id
        this.name = data.name.replaceAll(/["']/g, '').split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ')
        this.yearPublished = data.yearPublished
        this.isExpansion = data.isExpansion
    }

    public getID = () => this.id
    public getName = () => this.name
    public getYearPublished = () => this.yearPublished
    public getIsExpansion = () => this.isExpansion
}

export default class BGGDB {
    private DB: BGGEntry[]

    constructor(data: IBGGDBRow[]) {
        this.DB = data.filter(e => !e.name.toLowerCase().match(/[#]|hashhtag/gi) && e.yearPublished !== 0).map(e => new BGGEntry(e))
    }

    public getDB = () => this.DB
    public findByID = (id: number) => this.DB.find(entry => entry.getID() === id)
    public searchByName = (query: string) => this.DB.filter(entry => entry.getName().toLowerCase().includes(query.toLowerCase()))
    public sort = (field: BGGDBFields, asc: boolean = true) =>  this.DB.sort((a, b) => {
        let valA: IBGGDBRow[keyof IBGGDBRow], valB: typeof valA

        switch (field) {
            case BGGDBFields.ID:
                valA = a.getID()
                valB = b.getID()
                break
            case BGGDBFields.NAME:
                valA = a.getName()
                valB = b.getName()
                break
            case BGGDBFields.YEAR_PUBLISHED:
                valA = a.getYearPublished()
                valB = b.getYearPublished()
                break
            case BGGDBFields.IS_EXPANSION:
                valA = a.getIsExpansion()
                valB = b.getIsExpansion()
                break
            default:
                return 0
        }

        if (valA < valB) return asc ? -1 : 1
        if (valA > valB) return asc ? 1 : -1
        return 0
    })
}