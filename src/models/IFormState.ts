import IStrapiResponse from '@/models/IStrapiResponse'

export default interface IFormState<T, D> {
    zodErrors?: T,
    strapiErrors?: IStrapiResponse<unknown>['error']
    errorMessage?: string
    successMessage?: string
    formData: D
}