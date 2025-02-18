import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Experience, CreateEntityInput } from '@/types'
import { useAuth } from '@/lib/auth'
import ExperienceForm from './components/ExperienceForm'

export default function AdminExperiences() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user?.id)
        .order('start_date', { ascending: false })
      
      if (error) throw error
      return data as Experience[]
    }
  })

  const createMutation = useMutation({
    mutationFn: async (experience: Omit<Experience, 'id'>) => {
      const { data, error } = await supabase
        .from('experiences')
        .insert(experience)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] })
      setIsFormOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, experience }: { id: string; experience: Partial<Experience> }) => {
      const { data, error } = await supabase
        .from('experiences')
        .update(experience)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] })
      setEditingExperience(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] })
    }
  })

  const handleCreate = (experience: CreateEntityInput<Experience>) => {
    if (!user?.id) return
    createMutation.mutate({ ...experience, user_id: user.id } as Experience)
  }

  const handleUpdate = (experience: Experience) => {
    const { id, ...updateData } = experience
    updateMutation.mutate({ id, experience: updateData })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот опыт работы?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Опыт работы</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md"
        >
          Добавить опыт
        </button>
      </div>

      {(isFormOpen || editingExperience) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ExperienceForm
              experience={editingExperience}
              onSubmit={editingExperience ? 
                ((data: CreateEntityInput<Experience>) => handleUpdate({ ...data, id: editingExperience.id } as Experience)) : 
                handleCreate}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingExperience(null)
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {experiences?.map((experience) => (
          <div
            key={experience.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{experience.position}</h2>
                <p className="text-gray-600 dark:text-gray-400">{experience.company}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditingExperience(experience)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                >
                  Удалить
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {new Date(experience.start_date).toLocaleDateString('ru-RU', { 
                year: 'numeric', 
                month: 'long'
              })} - {
                experience.current ? 'По настоящее время' : 
                experience.end_date ? new Date(experience.end_date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long'
                }) : ''
              }
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {experience.description}
            </p>
            {experience.technologies && (
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {(!experiences || experiences.length === 0) && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Опыт работы пока не добавлен
          </p>
        )}
      </div>
    </div>
  )
}