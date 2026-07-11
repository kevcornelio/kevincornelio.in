interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Wassup MLR',
    description: `Mangalore's AI food guide. Tell it your mood or craving and it finds you the
    perfect dish and spot — real recommendations from local foodies, served up by AI. Built with
    React, Supabase, and retrieval-augmented chat over community reviews.`,
    imgSrc: '/static/images/projects/wassup-mlr.jpg',
    href: 'https://www.wasp-mlr.com',
  },
  {
    title: 'Personal Tracker',
    description: `A private dashboard for running life like a project: tasks, finances, health,
    habits, and vaccination schedules in one place. Built with Next.js and Supabase, designed
    for exactly one very demanding user — me.`,
  },
]

export default projectsData
