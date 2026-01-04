import { z } from 'zod'
import { ZodFieldErrors } from '@/models/zodFieldErrors'
import { formatZodErrors, getFormData } from '@/helpers/actionHelpers'
import IFormState from '@/models/IFormState'
import { CREATE_EVENT_INIT_STATE } from '@/components/CreateEventForm/CreateEventForm'
import { createEvent, getClient, getToken, verifyToken } from '@/helpers/serverFunctions'
import Client, { IClient } from '@/models/Client'
import { IEvent } from '@/models/Event'

const createEventSchema = z.object({
    token: z.string().min(128, 'Token is to short, should be minimum 128 characters long. Did you copy and paste it correctly?'),
    location: z.string().regex(/^(?!.*\s{2,})(?=.{3,64}$)[\p{L}\p{N}](?:[\p{L}\p{N} ,.]*[\p{L}\p{N},.]|[\p{L}\p{N}])$/u, { error: 'Please enter a valid location name using only letters, number, spaces, commas and punctations (no other special characters are allowed).\nIt must be between 3 - 64 characters long.' }),
    dateTime: z.date({ error: 'Please enter a valid date and time.' }),
    gameID: z.number({ error: 'Game ID must be a number.' }),
    description: z.string().regex(/^(?!.*\s{2,})(?=.{3,64}$)[\p{L}\p{N}](?:[\p{L}\p{N} ,.]*[\p{L}\p{N},.]|[\p{L}\p{N}])$/u, { error: 'Please enter a valid description using only letters, number, spaces, commas and punctations (no other special characters are allowed)' }),
    passWord: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?#%&+-_~])(?!.*[^A-Za-z0-9!?#%&+-_~]).{10,}$/, { error: `Please enter a valid password:\n1. At least 1 upper case character.\n2. At least 1 lower case character.\n3. At least one digit.\n4. At least one of these special characters: ! ? # % & + - _ ~ (no other special characters are allowed).\n5. At least 10 characters long.` }),
    passConf: z.string(),
    playersMin: z.number().optional(),
    playersMax: z.number().optional()
}).superRefine(({ passWord, passConf }, ctx) => {
    if (passConf !== passWord) ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match.',
        path: ['passConf']
    })
})

export interface ICreateEventState extends IFormState<ZodFieldErrors<typeof createEventSchema.shape>, z.infer<typeof createEventSchema>> {
    newEvent?: IEvent
}

export default async function createEventAction(prevState: ICreateEventState, formData: FormData) {
    const data = (d => { 
        const { dateTime, gameID, playersMin, playersMax } = d
        return { ...d, dateTime: new Date(dateTime), gameID: Number(gameID), playersMin: playersMin ? Number(playersMin) : undefined, playersMax: playersMax ?  Number(playersMax) : undefined }
    })(getFormData<ICreateEventState['formData']>(formData)), validatedFields = createEventSchema.safeParse(data)

    if(!validatedFields.success) return { ...prevState, ...CREATE_EVENT_INIT_STATE, zodErrors:  formatZodErrors(z.treeifyError(validatedFields.error).properties), formData: { ...data } } as ICreateEventState

    const { token, location, dateTime, gameID, description, passWord, playersMin, playersMax } = validatedFields.data,
    eventToken = await getToken(passWord), host = ((await getClient(token)).data as IClient[])?.map(c => new Client(c))[0]

    if(!host) return { ...prevState, ...CREATE_EVENT_INIT_STATE, errorMessage: `Could not find user with token: ${ token }`, formData: { ...data } } as ICreateEventState

    if(!await verifyToken(token, host.getToken())) return { ...prevState, ...CREATE_EVENT_INIT_STATE, errorMessage: `Could not verify token. Please check it and try entering it again.`, formData: { ...data } } as ICreateEventState

    if(!eventToken) return { ...prevState, ...CREATE_EVENT_INIT_STATE, errorMessage: `Could not create a token.\nToken: ${ token }`, formData: { ...data } } as ICreateEventState

    const respons = await createEvent({ host: { connect: [host.getDocumentId()] }, location, dateTime: dateTime.toISOString(), gameID, description, token: eventToken, playersMin, playersMax })

    if(!respons) return { ...prevState, ...CREATE_EVENT_INIT_STATE, errorMessage: 'Ops! Something went wrong. Please try again.', formData: { ...data } } as ICreateEventState

    if(respons.error) return { ...prevState, ...CREATE_EVENT_INIT_STATE, strapiErrors: respons.error, errorMessage: 'Failed to create a new event.', formData: { ...data } } as ICreateEventState

    return { ...prevState, ...CREATE_EVENT_INIT_STATE, successMessage: `New user created successfully!\n\nHere is your token (needed to alter the event):\n\n${ eventToken }`, newEvent: respons.data as IEvent } as ICreateEventState
}