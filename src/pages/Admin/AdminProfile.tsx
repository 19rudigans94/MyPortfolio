import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { api, Profile } from '@/lib/api'
import { useAuth } from '@/lib/auth'

export default function AdminProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (error) throw error
      return data as Profile
    }
  })

  const updateMutation = useMutation({
    mutationFn: (profile: Partial<Profile>) => api.updateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] })
      setIsEditing(false)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedProfile = {
      id: user?.id,
      full_name: formData.get('full_name') as string,
      title: formData.get('title') as string,
      bio: formData.get('bio') as string,
      avatar_url: formData.get('avatar_url') as string,
      email: formData.get('email') as string,
      github_url: formData.get('github_url') as string,
      linkedin_url: formData.get('linkedin_url') as string,
      location: formData.get('location') as string
    }
    updateMutation.mutate(updatedProfile)
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (!profile) {
    return <div>Профиль не найден</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Профиль</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md"
          >
            Редактировать
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Полное имя
                </label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={profile.full_name}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Должность
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={profile.title}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={profile.email || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Местоположение
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={profile.location || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  defaultValue={profile.github_url || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  defaultValue={profile.linkedin_url || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Аватар URL
                </label>
                <input
                  type="url"
                  name="avatar_url"
                  defaultValue={profile.avatar_url || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  О себе
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  defaultValue={profile.bio}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md"
              >
                Сохранить
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{profile.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Контактная информация</h3>
                <dl className="space-y-2">
                  {profile.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                      <dd>{profile.email}</dd>
                    </div>
                  )}
                  {profile.location && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Местоположение
                      </dt>
                      <dd>{profile.location}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Социальные сети</h3>
                <dl className="space-y-2">
                  {profile.github_url && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">GitHub</dt>
                      <dd>
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                        >
                          {profile.github_url}
                        </a>
                      </dd>
                    </div>
                  )}
                  {profile.linkedin_url && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        LinkedIn
                      </dt>
                      <dd>
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                        >
                          {profile.linkedin_url}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">О себе</h3>
              <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}