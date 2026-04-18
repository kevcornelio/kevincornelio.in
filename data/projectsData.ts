interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Coming Soon',
    description: `A portfolio of projects I'm working on will appear here. Stay tuned!`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '/',
  },
]

export default projectsData
