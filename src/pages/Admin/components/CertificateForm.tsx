import { useState, useEffect } from 'react'
import { Certificate } from '@/types'

interface CertificateFormProps {
  certificate?: Certificate | null
  onSubmit: (certificate: any) => void
  onCancel: () => void
}

export default function CertificateForm({
  certificate,
  onSubmit,
  onCancel
}: CertificateFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    issue_date: '',
    credential_url: '',
    image_url: ''
  })

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title,
        provider: certificate.provider,
        issue_date: certificate.issue_date,
        credential_url: certificate.credential_url || '',
        image_url: certificate.image_url || ''
      })
    }
  }, [certificate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(certificate ? { ...formData, id: certificate.id } : formData)
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
          Провайдер
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.provider}
          onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Дата выдачи
        </label>
        <input
          type="date"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.issue_date}
          onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          URL сертификата
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.credential_url}
          onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
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
          {certificate ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}