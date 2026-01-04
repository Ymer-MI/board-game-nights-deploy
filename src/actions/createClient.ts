import { z } from 'zod'
import IFormState from '@/models/IFormState'
import { CREATE_CLIENT_INIT_STATE } from '@/components/CreateClientForm/CreateClientForm'
import { getToken, createClient } from '@/helpers/serverFunctions'
import { formatZodErrors, getFormData } from '@/helpers/actionHelpers'
import { ZodFieldErrors } from '@/models/zodFieldErrors'

const createClientSchema = z.object({
    email: z.email({ error: 'Please enter a valid email address.' }),
    name: z.string().regex(/^(?!.*\s{2})(?=.{3,}$)[\p{L}\p{N}](?:[\p{L}\p{N}!_' -]*[\p{L}\p{N}!_']|[\p{L}\p{N}])$/u, { error: 'Please enter a valid user name using only letters, number and any of these special characters: ! - _ (no other special characters are allowed).' }),
    passWord: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?#%&+-_~])(?!.*[^A-Za-z0-9!?#%&+-_~]).{10,}$/, { error: `Please enter a valid password:\n1. At least 1 upper case character.\n2. At least 1 lower case character.\n3. At least one digit.\n4. At least one of these special characters: ! ? # % & + - _ ~ (no other special characters are allowed).\n5. At least 10 characters long.` }),
    passConf: z.string()
}).superRefine(({ passWord, passConf }, ctx) => {
    if (passConf !== passWord) {
    ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match.',
        path: ['passConf']
    });
  }
})

export interface ICreateClientState extends IFormState<ZodFieldErrors<typeof createClientSchema.shape>, z.infer<typeof createClientSchema>> {}

export default async function createClientAction(prevState: ICreateClientState, formData: FormData) {
    const data = getFormData<ICreateClientState['formData']>(formData), validatedFields = createClientSchema.safeParse(data)

    if (!validatedFields.success) return { ...prevState, ...CREATE_CLIENT_INIT_STATE, zodErrors: formatZodErrors(z.treeifyError(validatedFields.error).properties), formData: { ...data } } as ICreateClientState

    const { email, name, passWord } = validatedFields.data, token = await getToken(passWord)

    if(!token) return { ...prevState, ...CREATE_CLIENT_INIT_STATE, errorMessage: `Failed to create a token.\nToken: ${ token }`, formData: { ...data } } as ICreateClientState

    const respons = await createClient({ email, name, token })

    if(!respons) return { ...prevState, ...CREATE_CLIENT_INIT_STATE, errorMessage: 'Ops! Something went wrong. Please try again.', formData: { ...data } } as ICreateClientState

    if(respons.error) return { ...prevState, ...CREATE_CLIENT_INIT_STATE, strapiErrors: respons.error, errorMessage: 'Failed to create new user.', formData: { ...data } } as ICreateClientState

    return { ...prevState, ...CREATE_CLIENT_INIT_STATE, successMessage: `New user created successfully!\n\nHere is your token:\n\n${ token }` } as ICreateClientState
}