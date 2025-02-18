import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { api, Project } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import ProjectForm from './components/ProjectForm'

export default function AdminProjects() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Project[]
    }
  })

  const createMutation = useMutation({
    mutationFn: (project: Omit<Project, 'id'>) => api.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      setIsFormOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<Project> }) => 
      api.updateProject(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      setEditingProject(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
    }
  })

  const handleCreate = (project: Omit<Project, 'id'>) => {
    if (!user?.id) return
    createMutation.mutate(project)
  }

  const handleUpdate = (project: Project) => {
    const { id, ...updateData } = project
    updateMutation.mutate({ id, project: updateData })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md"
        >
          Добавить проект
        </button>
      </div>

      {(isFormOpen || editingProject) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProjectForm
              project={editingProject}
              onSubmit={editingProject ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingProject(null)
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Технологии
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects?.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{project.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.featured
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                    }`}
                  >
                    {project.featured ? 'Featured' : 'Regular'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}