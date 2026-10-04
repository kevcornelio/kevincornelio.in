import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="hover:border-primary-300 hover:text-primary-700 dark:hover:border-primary-700 dark:hover:text-primary-300 mt-2 mr-2 rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 transition-colors dark:border-gray-700 dark:text-gray-300"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
