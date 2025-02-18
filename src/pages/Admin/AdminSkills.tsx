import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { api, Skill } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import SkillForm from "./components/SkillForm";

export default function AdminSkills() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const { data: skills, isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user?.id)
        .order("category", { ascending: true });

      if (error) throw error;
      return data as Skill[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (skill: Omit<Skill, "id" | "user_id">) => {
      // Добавляем user_id к данным навыка
      return api.createSkill(skill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, skill }: { id: string; skill: Partial<Skill> }) =>
      api.updateSkill(id, skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      setEditingSkill(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
    },
  });

  const handleCreate = (skill: Omit<Skill, "id">) => {
    createMutation.mutate(skill);
  };

  const handleUpdate = (skill: Skill) => {
    const { id, ...updateData } = skill;
    updateMutation.mutate({ id, skill: updateData });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот навык?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  // Группировка навыков по категориям
  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Навыки</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md"
        >
          Добавить навык
        </button>
      </div>

      {(isFormOpen || editingSkill) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <SkillForm
              skill={editingSkill}
              onSubmit={editingSkill ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingSkill(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(skillsByCategory || {}).map(([category, skills]) => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {skill.proficiency}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
