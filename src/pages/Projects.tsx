import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import PageTitle from "@/components/SEO/PageTitle";

export default function Projects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', '8c79a6d6-88a4-4a77-9d80-2c9e8812f485')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  return (
    <>
      <PageTitle
        title="Проекты"
        description="Портфолио проектов frontend разработчика. Современные веб-приложения и креативные решения"
      />
      
      <div className="max-w-7xl mx-auto animate-fadeIn">
        <h1 className="text-4xl font-bold text-center mb-12">Мои проекты</h1>
        
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="card overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-64 overflow-hidden">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          Открыть проект
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    {project.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech: string) => (
                      <span
                        key={tech}
                        className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}