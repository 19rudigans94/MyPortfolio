import { useState, useEffect } from 'react'
import { Project } from '@/lib/api'

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (project: any) => void
  onCancel: () => void
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    image_url: '',
    project_url: '',
    github_url: '',
    featured: false
  })

  const [newTechnology, setNewTechnology] = useState('')

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        image_url: project.image_url || '',
        project_url: project.project_url || '',
        github_url: project.github_url || '',
        featured: project.featured
      })
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(project ? { ...formData, id: project.id } : formData)
  }

  const handleAddTechnology = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTechnology.trim()) {
      e.preventDefault()
      if (!formData.technologies.includes(newTechnology.trim())) {
        setFormData({
          ...formData,
          technologies: [...formData.technologies, newTechnology.trim()]
        })
      }
      setNewTechnology('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Название
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Описание
        </label>
        <textarea
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Технологии
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {formData.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700"
            >
              {tech}
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => handleRemoveTechnology(tech)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Добавить технологию (Enter)"
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={newTechnology}
          onChange={(e) => setNewTechnology(e.target.value)}
          onKeyDown={handleAddTechnology}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          URL изображения
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          URL проекта
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.project_url}
          onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          URL GitHub
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.github_url}
          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
        />
        <label
          htmlFor="featured"
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Featured проект
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md"
        >
          {project ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}