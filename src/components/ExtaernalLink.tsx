import { Icon } from '@iconify/react/dist/iconify.js'
import Link, { LinkProps } from 'next/link'

export const ExternalLink = ({ children, href, className }: { children: React.ReactNode; href: LinkProps['href'], className?: string }) => (
    <Link className={className} href={href} rel='noopener noreferrer' target='_blank'>
        {children}
        <Icon icon='system-uicons:external' />
    </Link>
)
