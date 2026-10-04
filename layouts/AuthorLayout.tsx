import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-10">
          <div className="pt-8">
            <div className="flex flex-col items-center rounded-xl border border-gray-200 p-6 text-center dark:border-gray-800">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  width={160}
                  height={160}
                  className="h-40 w-40 rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="bg-primary-900 flex h-32 w-32 items-center justify-center rounded-full text-4xl font-semibold tracking-wide text-white"
                >
                  {initials}
                </div>
              )}
              <h2 className="pt-5 text-xl leading-8 font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {name}
              </h2>
              <div className="text-gray-600 dark:text-gray-400">{occupation}</div>
              <div className="text-sm text-gray-500 dark:text-gray-500">{company}</div>
              <div className="flex space-x-4 pt-5">
                <SocialIcon kind="mail" href={`mailto:${email}`} size={6} />
                <SocialIcon kind="linkedin" href={linkedin} size={6} />
                <SocialIcon kind="github" href={github} size={6} />
                <SocialIcon kind="x" href={twitter} size={6} />
                <SocialIcon kind="bluesky" href={bluesky} size={6} />
              </div>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
