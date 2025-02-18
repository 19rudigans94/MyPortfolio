import { supabase } from "./supabase";
import { toast } from "react-hot-toast";
import { BaseEntity, Certificate } from "@/types";

// Types
export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  location: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  proficiency: number;
}

// Certificate импортируется из @/types

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  technologies: string[];
}

// API функции
export const api = {
  // Профиль
  async updateProfile(profile: Partial<Profile>) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", profile.id);

      if (error) throw error;
      toast.success("Профиль обновлен");
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      toast.error("Ошибка обновления профиля");
      throw error;
    }
  },

  // Проекты
  async createProject(project: Omit<Project, "id">) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      toast.success("Проект создан");
      return data;
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
      toast.error("Ошибка создания проекта");
      throw error;
    }
  },

  async updateProject(id: string, project: Partial<Project>) {
    try {
      const { error } = await supabase
        .from("projects")
        .update(project)
        .eq("id", id);

      if (error) throw error;
      toast.success("Проект обновлен");
    } catch (error) {
      console.error("Ошибка обновления проекта:", error);
      toast.error("Ошибка обновления проекта");
      throw error;
    }
  },

  async deleteProject(id: string) {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
      toast.success("Проект удален");
    } catch (error) {
      console.error("Ошибка удаления проекта:", error);
      toast.error("Ошибка удаления проекта");
      throw error;
    }
  },

  // Навыки
  async createSkill(skill: Omit<Skill, "id" | "user_id">) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Пользователь не авторизован");

      const { data, error } = await supabase
        .from("skills")
        .insert({ ...skill, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      toast.success("Навык добавлен");
      return data;
    } catch (error) {
      console.error("Ошибка добавления навыка:", error);
      toast.error("Ошибка добавления навыка");
      throw error;
    }
  },

  async updateSkill(id: string, skill: Partial<Skill>) {
    try {
      const { error } = await supabase
        .from("skills")
        .update(skill)
        .eq("id", id);

      if (error) throw error;
      toast.success("Навык обновлен");
    } catch (error) {
      console.error("Ошибка обновления навыка:", error);
      toast.error("Ошибка обновления навыка");
      throw error;
    }
  },

  async deleteSkill(id: string) {
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);

      if (error) throw error;
      toast.success("Навык удален");
    } catch (error) {
      console.error("Ошибка удаления навыка:", error);
      toast.error("Ошибка удаления навыка");
      throw error;
    }
  },

  // Сертификаты
  async createCertificate(certificate: Omit<Certificate, "id" | "user_id">) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Пользователь не авторизован");

      const { data, error } = await supabase
        .from("certificates")
        .insert({ ...certificate, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      toast.success("Сертификат добавлен");
      return data;
    } catch (error) {
      console.error("Ошибка добавления сертификата:", error);
      toast.error("Ошибка добавления сертификата");
      throw error;
    }
  },

  async updateCertificate(id: string, certificate: Partial<Certificate>) {
    try {
      const { error } = await supabase
        .from("certificates")
        .update(certificate)
        .eq("id", id);

      if (error) throw error;
      toast.success("Сертификат обновлен");
    } catch (error) {
      console.error("Ошибка обновления сертификата:", error);
      toast.error("Ошибка обновления сертификата");
      throw error;
    }
  },

  async deleteCertificate(id: string) {
    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Сертификат удален");
    } catch (error) {
      console.error("Ошибка удаления сертификата:", error);
      toast.error("Ошибка удаления сертификата");
      throw error;
    }
  },

  // Опыт работы
  async createExperience(experience: Omit<Experience, "id">) {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .insert(experience)
        .select()
        .single();

      if (error) throw error;
      toast.success("Опыт работы добавлен");
      return data;
    } catch (error) {
      console.error("Ошибка добавления опыта работы:", error);
      toast.error("Ошибка добавления опыта работы");
      throw error;
    }
  },

  async updateExperience(id: string, experience: Partial<Experience>) {
    try {
      const { error } = await supabase
        .from("experiences")
        .update(experience)
        .eq("id", id);

      if (error) throw error;
      toast.success("Опыт работы обновлен");
    } catch (error) {
      console.error("Ошибка обновления опыта работы:", error);
      toast.error("Ошибка обновления опыта работы");
      throw error;
    }
  },

  async deleteExperience(id: string) {
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Опыт работы удален");
    } catch (error) {
      console.error("Ошибка удаления опыта работы:", error);
      toast.error("Ошибка удаления опыта работы");
      throw error;
    }
  },
};
