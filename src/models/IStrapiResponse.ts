interface IData {
    id: number
    createdAt: Date
    updatedAt: Date
    publishedAt: Date
}

interface IMeta {
    meta?: {
        pagination: {
            page: number
            pageSize: number
            pageCount: number
            total: number
        }
    }
}


interface IStrapiError {
    error?: {
        status: number
        name: string
        message: string
        details: object
    }
}

export default interface IStrapiResponse<T> extends IMeta, IStrapiError {
    data: null | T & IData | (T & IData)[]
}