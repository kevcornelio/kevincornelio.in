import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 3

const focusAreas = [
  {
    title: 'Security Operations',
    description: 'Building and leading global SOC functions that run reliably at enterprise scale.',
  },
  {
    title: 'Threat Detection',
    description: 'Driving detection engineering so teams find and respond to real threats faster.',
  },
  {
    title: 'Enterprise Protection',
    description:
      'Aligning threat management strategy with business risk across multiple cyber teams.',
  },
]

function SectionHeading({ title, href, linkText }) {
  return (
    <div className="mb-6 flex items-baseline justify-between">
      <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-primary-700 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
        >
          {linkText} &rarr;
        </Link>
      )}
    </div>
  )
}

export default function Home({ posts }) {
  const featuredProject = projectsData[0]

  return (
    <div className="space-y-20">
      <section className="pt-6 md:pt-12">
        <p className="text-primary-700 dark:text-primary-400 mb-4 text-sm font-semibold tracking-wider uppercase">
          Cybersecurity Leader · Bengaluru
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight text-gray-900 md:text-5xl md:leading-tight dark:text-gray-100">
          Building security operations that keep enterprises ahead of threats.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          I'm Kevin Cornelio, a cybersecurity leader with 15+ years in Security Operations, Threat
          Detection, and Enterprise Protection. I currently work at Fidelity Investments.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="bg-primary-800 hover:bg-primary-900 dark:bg-primary-600 dark:hover:bg-primary-500 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            About me
          </Link>
          <Link
            href={siteMetadata.linkedin || '/about'}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Connect on LinkedIn
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading title="Areas of focus" href={undefined} linkText={undefined} />
        <div className="grid gap-4 md:grid-cols-3">
          {focusAreas.map((area) => (
            <div
              key={area.title}
              className="rounded-xl border border-gray-200 p-6 dark:border-gray-800"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Recent writing"
          href={posts.length > MAX_DISPLAY ? '/blog' : undefined}
          linkText="All posts"
        />
        <ul className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {!posts.length && <li className="py-6 text-gray-500">No posts yet.</li>}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary } = post
            return (
              <li key={slug}>
                <Link
                  href={`/blog/${slug}`}
                  className="group block py-6 sm:grid sm:grid-cols-4 sm:gap-6"
                >
                  <time
                    dateTime={date}
                    className="text-sm text-gray-500 sm:pt-0.5 dark:text-gray-400"
                  >
                    {formatDate(date, siteMetadata.locale)}
                  </time>
                  <div className="mt-1 sm:col-span-3 sm:mt-0">
                    <h3 className="group-hover:text-primary-700 dark:group-hover:text-primary-400 text-lg font-semibold text-gray-900 transition-colors dark:text-gray-100">
                      {title}
                    </h3>
                    {summary && (
                      <p className="mt-1 line-clamp-2 text-gray-600 dark:text-gray-400">
                        {summary}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {featuredProject && (
        <section>
          <SectionHeading title="Side project" href="/projects" linkText="All projects" />
          <Link
            href={featuredProject.href || '/projects'}
            className="group hover:border-primary-300 dark:hover:border-primary-700 block rounded-xl border border-gray-200 p-6 transition-colors dark:border-gray-800"
          >
            <h3 className="group-hover:text-primary-700 dark:group-hover:text-primary-400 text-lg font-semibold text-gray-900 transition-colors dark:text-gray-100">
              {featuredProject.title} &rarr;
            </h3>
            <p className="mt-2 max-w-3xl text-gray-600 dark:text-gray-400">
              {featuredProject.description}
            </p>
          </Link>
        </section>
      )}
    </div>
  )
}
