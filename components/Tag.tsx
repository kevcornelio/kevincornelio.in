import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 dark:hover:bg-primary-900/60 dark:hover:text-primary-200 mt-2 mr-2 rounded-full px-3 py-1 text-sm font-medium transition-colors"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
