import { useState, useEffect } from "react";
import { Experience } from "@/lib/api";

interface ExperienceFormProps {
  experience?: Experience | null;
  onSubmit: (experience: any) => void;
  onCancel: () => void;
}

export default function ExperienceForm({
  experience,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
    technologies: [] as string[],
  });

  const [newTechnology, setNewTechnology] = useState("");

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        position: experience.position,
        start_date: experience.start_date,
        end_date: experience.end_date || "",
        current: experience.current,
        description: experience.description,
        technologies: experience.technologies,
      });
    }
  }, [experience]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Убедимся, что end_date не пустая строка, если не current
    const submissionData = {
      ...formData,
      end_date: formData.current ? null : formData.end_date || null,
    };

    onSubmit(
      experience ? { ...submissionData, id: experience.id } : submissionData
    );
  };

  const handleAddTechnology = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTechnology.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(newTechnology.trim())) {
        setFormData({
          ...formData,
          technologies: [...formData.technologies, newTechnology.trim()],
        });
      }
      setNewTechnology("");
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Компания
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Должность
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Дата начала
          </label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Дата окончания
          </label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            disabled={formData.current}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="current"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
          checked={formData.current}
          onChange={(e) =>
            setFormData({ ...formData, current: e.target.checked })
          }
        />
        <label
          htmlFor="current"
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          В настоящее время работаю здесь
        </label>
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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
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
          {experience ? "Сохранить" : "Создать"}
        </button>
      </div>
    </form>
  );
}
