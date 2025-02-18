import React from 'react'
import PageTitle from '@/components/SEO/PageTitle'
import Image from '@/components/UI/Image'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Проект 1',
    description: 'Описание первого проекта',
    image: '/projects/project1.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    link: 'https://project1.com'
  },
  // Добавьте другие проекты здесь
]

const Projects: React.FC = () => {
  return (
    <>
      <PageTitle
        title="Проекты"
        description="Портфолио проектов frontend разработчика: веб-приложения, сайты, UI/UX решения"
      />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Мои проекты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Посмотреть проект →
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}

export default Projects
