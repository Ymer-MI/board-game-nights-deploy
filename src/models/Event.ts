import Client, { IClient } from '@/models/Client'
import JWTHelper from '@/helpers/JWTHelper' 

const JWT = new JWTHelper()

export interface IEvent {
    documentId: string
    location: string
    dateTime: string
    gameID: number
    description: string
    token: string
    playersMin: number
    playersMax: number
    host?: IClient
    attendees?: IClient[]
}

export default class Event {
    private documentId: string
    private location:   string
    private dateTime: Date
    private gameID: number
    private description: string
    private token: string
    private playersMin: number
    private playersMax: number
    private host?: Client
    private attendees?: Client[]

    constructor({ documentId, location, dateTime, gameID, description, token, playersMin, playersMax, host, attendees }: IEvent) {
        this.documentId = documentId
        this.location = location
        this.dateTime = new Date(dateTime)
        this.gameID = gameID
        this.description = description
        this.token = token
        this.playersMin = playersMin
        this.playersMax = playersMax
        this.host = host && new Client(host)
        this.attendees = attendees?.map(a => new Client(a))
    }

    static groupByDate = (events: IEvent[]) => events.reduce((o, e) => {
        const k = new Date(e.dateTime).toISOString().split('T')[0]

        if(!o[k]) o[k] = []

        o[k].push(e)

        return o
    }, {} as Record<string, IEvent[]>)

    getDocumentId = () => this.documentId
    getLocation = () => this.location
    getDateTime = () => this.dateTime
    getGameID = () => this.gameID
    getDescription = () => this.description
    verifyToken = async (str: string) => await JWT.verifyToken(str, this.token)
    getPlayersMin = () => this.playersMin
    getPlayersMax = () => this.playersMax
    getHost = () => this.host
    getAttendees = () => this.attendees
}