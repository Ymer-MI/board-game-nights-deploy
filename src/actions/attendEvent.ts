import z from 'zod'
import { ZodFieldErrors } from '@/models/zodFieldErrors'
import IFormState from '@/models/IFormState'
import { formatZodErrors, getFormData } from '@/helpers/actionHelpers'
import { ATTEND_EVENT_INIT_STATE } from '@/components/AttendForm/AttendEventForm'
import { attendEvent, getClient, verifyToken } from '@/helpers/serverFunctions'
import Client, { IClient } from '@/models/Client'
import { IEvent } from '@/models/Event'

const attendEventSchema = z.object({
    event: z.string(),
    token: z.string().min(128, { error: 'Token is to short. make sure you entered the entire token.' })
})

export interface IAttendEventState extends IFormState<ZodFieldErrors<typeof attendEventSchema.shape>, { event: IEvent | undefined, token: IClient['token'] }> {
    updatedEvent?: IEvent
}

export default async function attendEventAction(_: IAttendEventState, formData: FormData) {
    const data = getFormData<IAttendEventState['formData']>(formData), validatedFields = attendEventSchema.safeParse({ ...data, event: JSON.stringify(data.event) })
    if (!validatedFields.success) return { ...ATTEND_EVENT_INIT_STATE, zodErrors: formatZodErrors(z.treeifyError(validatedFields.error).properties), formData: { ...data } } satisfies IAttendEventState as IAttendEventState

    const { token } = data, event = data.event as IEvent, client = ((await getClient(token)).data as IClient[])?.map(c => new Client(c))[0]

    if (!client) return { ...ATTEND_EVENT_INIT_STATE, errorMessage: `Could not find user with token: ${ token }`, formData: { ...data } } satisfies IAttendEventState as IAttendEventState

    if (event.host?.documentId === client.getDocumentId()) return { ...ATTEND_EVENT_INIT_STATE, errorMessage: `Host automatically attends their events, they can't register as an additional attendee.`, formData: { ...data } } satisfies IAttendEventState as IAttendEventState
    
    if (event.attendees?.find(c => c.documentId === client.getDocumentId())) return { ...ATTEND_EVENT_INIT_STATE, errorMessage: `You are already registerd as an attendee, ${ client.getName() }`, formData: { ...data } } satisfies IAttendEventState as IAttendEventState

    if (!await verifyToken(token, client.getToken())) return { ...ATTEND_EVENT_INIT_STATE, errorMessage: `Could not verify token. Please check it and try entering it again.`, formData: { ...data } } satisfies IAttendEventState as IAttendEventState

    const respons = await attendEvent(event.documentId, { attendees: { connect: [client.getDocumentId()] } })

    if(!respons) return { ...ATTEND_EVENT_INIT_STATE, errorMessage: 'Ops! Something went wrong. Please try again.', formData: { ...data } } satisfies IAttendEventState as IAttendEventState
    
    if(respons.error || !respons.data) return { ...ATTEND_EVENT_INIT_STATE, strapiErrors: respons.error, errorMessage: 'Failed to Update the event with a new attendee.', formData: { ...data } } satisfies IAttendEventState as IAttendEventState

    return { ...ATTEND_EVENT_INIT_STATE, successMessage: `Congratulations, you, ${ client.getName() }, are now registered as an attendee for this event.`, updatedEvent: respons.data as IEvent } satisfies IAttendEventState as IAttendEventState
}