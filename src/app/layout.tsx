import '@/styles/globals.css'
import type { Metadata } from 'next'

if (!process.env.DB_API_URL || !process.env.DB_API_TOKEN || !process.env.JWT_SECRET) {
    throw new Error(`Missing required environment variables:\nDB_API_URL = ${ process.env.DB_API_URL}\nDB_API_TOKEN = ${ process.env.DB_API_TOKEN }\nJWT_SECRET = ${ process.env.JWT_SECRET }`)
}

export const metadata: Metadata = {
    icons: {
        icon: '/imgs/icons/favicon.ico',
    },
    title: 'Board Game Nights',
    description: '',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <html lang='en'>
        <body>
            <header></header>
            <main>
                {children}
            </main>
            <footer><p>&copy; { new Date().getFullYear() } Ymer Nordström. All rights reserved.</p></footer>
        </body>
    </html>
}