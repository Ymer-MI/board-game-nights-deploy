export default function ServerStatus({ status }: { status: string }) {
    return <section>
        <h2>Server Status: <span style={{ color: status.toLowerCase().match(/offline/) ? '#f00' : '#0f0' }}>{ status }</span></h2>
    </section>
}