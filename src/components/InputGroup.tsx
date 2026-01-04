import { useState, useDeferredValue, useEffect } from 'react'
import MessageBox, { MESSAGETYPE } from '@/components/MessageBox/MessageBox'

interface IBaseProps {
    id: string
    label: string
    className?: string
    required?: boolean
    error?: string[]
    kind?: 'basic' | 'search-select'
}

interface IBasicInputProps extends IBaseProps {
    kind?: 'basic'
    type: HTMLInputElement['type']
    defaultValue?: {
        value?: string
        checked?: boolean
    }
}

interface ISelectInputProps extends IBaseProps {
    kind: 'search-select'
    minChars?: number
    maxResults?: number
    search: searchFn
    defaultValue?: number
    onSelect?: (id: number) => void
}

export type searchFn = (query: string) => Promise<ISearchResult[]>

export type inputGroupProps = IBasicInputProps | ISelectInputProps

export interface ISearchResult { label: string, value: number }

function isBasicInputProps(props: inputGroupProps): props is IBasicInputProps { return !('search' in props) }

export default function InputGroup(props: inputGroupProps) {
    const { id, label, className, required, error } = props, [query, setQuery] = useState(isBasicInputProps(props) ? props.defaultValue?.value ?? '' : ''),
    [results, setResults] = useState<ISearchResult[]>([]), deferredQuery = useDeferredValue(query),
    [selectedId, setSelectedId] = useState<number | null>(null), [isOpen, setIsOpen] = useState(false)
        
    useEffect(() => {
        if (props.kind === 'search-select') {
            const { minChars = 3, maxResults = 10, search, defaultValue } = props

            let cancelled = false;

            (async () => {
                if (cancelled) return

                if (query === '' && defaultValue != null) {
                    const item = (await search('')).find(r => r.value === defaultValue)

                    if (item) {
                        setSelectedId(item.value)
                    }

                    return
                }

                if (deferredQuery.length < minChars) {
                    setResults([])
                    return
                }

                setIsOpen(true)
                setResults((await search(deferredQuery)).slice(0, maxResults))
            })()
            
            return () => { cancelled = true }
        }
    }, [deferredQuery, props])

    return <div className={ className }>
        <label htmlFor={ id }>{ label }:</label>
        { isBasicInputProps(props) ? 
            <input id={ id } name={ id } type={ props.type } required={ required } defaultValue={ props.defaultValue?.value } checked={ props.defaultValue?.checked }/>
        : <>
            <input id={ `${ id }-search` } type='text' value={ query } onChange={ e => setQuery(e.target.value) } placeholder={`Type at least ${ props.minChars ?? 3 } characters...`} autoComplete='off'/>
            <select id={ `${ id }-select` } required={ required } value={ selectedId ?? '' } onChange={e => {
                    setSelectedId(Number(e.target.value))
                    setIsOpen(false)
            }} size={ isOpen ? results.length : 1 } onClick={ () => { setIsOpen(!isOpen) } }>
            { results.length === 0 ? <option disabled>No matches</option> : results.map(r => (
                <option key={ r.value } value={ r.value }>{ r.label }</option>
            ))}
            </select>
            <input id={ id } name={ id } type='hidden' value={ selectedId ?? '' }  />
        </> }
        {error && <MessageBox msg={error} type={MESSAGETYPE.WARNING} />}
    </div>
}