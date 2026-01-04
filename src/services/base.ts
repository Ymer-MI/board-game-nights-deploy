import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import qs from 'qs'

export class BaseService {
    private ax: AxiosInstance

    constructor(baseURL?: string, token?: string) {
        this.ax = axios.create({ baseURL, headers: { Authorization: token && `Bearer ${token}` }, paramsSerializer: ps => qs.stringify(ps) })
    }

    private checkEndPointStr = (str: string) => `${str.charAt(0) !== '/' ? `/${str}` : str}`

    private checkParams = (str?: string) => str && str.length !== 0 ? `?${str}` :  ''

    private buildEndPoint = (endPoint: string, params?: string) => this.checkEndPointStr(endPoint) + this.checkParams(params)

    ping = async (URL: string, headers?: AxiosRequestConfig['headers']) => await axios.create().get(URL, { headers })

    get = async <T>(endpoint: string, params?: object) => (await this.ax.get<T>(endpoint, { params })).data

    post = async <T>(endpoint: string, data: object) => (await this.ax.post<T>(endpoint, JSON.stringify({ data }), { headers: { 'Content-Type': 'application/json' } })).data

    put = async <T>(endpoint: string, data: object, params?: object) => (await this.ax.put<T>(endpoint, JSON.stringify({ data }), { params, headers: { 'Content-Type': 'application/json' } })).data
}