import { useState, useEffect } from 'react'
import { Skill } from '@/lib/api'

interface SkillFormProps {
  skill?: Skill | null
  onSubmit: (skill: any) => void
  onCancel: () => void
}

export default function SkillForm({ skill, onSubmit, onCancel }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 1
  })

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency
      })
    }
  }, [skill])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(skill ? { ...formData, id: skill.id } : formData)
  }

  const categories = ['Frontend', 'Backend', 'DevOps', 'Cloud', 'Mobile', 'Other']

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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Категория
        </label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Уровень владения
        </label>
        <input
          type="range"
          min="1"
          max="5"
          className="mt-1 block w-full"
          value={formData.proficiency}
          onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
        />
        <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Начинающий (1)</span>
          <span>Средний (2)</span>
          <span>Хороший (3)</span>
          <span>Продвинутый (4)</span>
          <span>Эксперт (5)</span>
        </div>
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
          {skill ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}