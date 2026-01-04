import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { IClient } from '@/models/Client'
import { IEvent } from '@/models/Event'

interface ITokenContent {
    hash: ReturnType<typeof bcrypt['hashSync']>
}

export default class JWTHelper {
    private readonly secret = process.env.JWT_SECRET
    private readonly options = {
        algorithm: 'HS512'
    } as const

    private decodeToken = (str: string) => this.secret ? jwt.verify(str, this.secret, this.options as VerifyOptions) as ITokenContent : undefined

    getToken = async (str: string) => this.secret && jwt.sign({ hash: await (bcrypt.hash(str, await (bcrypt.genSalt(12)))) } satisfies ITokenContent, this.secret, this.options as SignOptions) as IClient['token'] | IEvent['token']
    verifyToken = (testToken: string, token: IClient['token']) => this.decodeToken(testToken)?.hash === this.decodeToken(token)?.hash
    logProperties = () => { console.log(this.secret, this.options) }
}