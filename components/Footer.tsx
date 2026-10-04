import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col-reverse items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {`© ${new Date().getFullYear()} `}
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
            {siteMetadata.author}
          </Link>
        </div>
        <div className="flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
        </div>
      </div>
    </footer>
  )
}
