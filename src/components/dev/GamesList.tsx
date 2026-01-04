import { BGGDB, BGGDBFields } from '@/models/BGGDB'

export default function GamesList({ BGGDB, itemsToDisplay }: { BGGDB: BGGDB, itemsToDisplay?: number }) {
    return <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>{ (itemsToDisplay && `${itemsToDisplay} first`) ?? `All ${BGGDB.getDB().length}` } games in the DB:</h2>
        <ul  style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            { BGGDB.sort(BGGDBFields.NAME).slice(0, itemsToDisplay).map((g, i) => (<li key={g.getID()}  style={{ width: '100%', display: 'flex', gap: '1em' }}>
                <span style={{ display: 'inline-block', width: '10%', textAlign: 'right' }}>{ ++i }</span>
                <span style={{ display: 'inline-block', width: '80%' }}>{ g.getName() }</span>
                <span style={{ display: 'inline-block', width: '10%', textAlign: 'center' }}>{ g.getYearPublished() }</span>
            </li>)) }
        </ul>
    </section>
}