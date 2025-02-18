import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import DocumentIcon from "@heroicons/react/24/outline/DocumentIcon";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import CommandLineIcon from "@heroicons/react/24/outline/CommandLineIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [projects, skills, certificates, profile] = await Promise.all([
        supabase
          .from("projects")
          .select("id", { count: "exact" })
          .eq("user_id", user?.id),
        supabase
          .from("skills")
          .select("id", { count: "exact" })
          .eq("user_id", user?.id),
        supabase
          .from("certificates")
          .select("id", { count: "exact" })
          .eq("user_id", user?.id),
        supabase.from("profiles").select("*").eq("id", user?.id).single(),
      ]);

      return {
        projects: projects.count || 0,
        skills: skills.count || 0,
        certificates: certificates.count || 0,
        profile: profile.data,
      };
    },
  });

  const { data: recentProjects } = useQuery({
    queryKey: ["recent-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <div className="mb-8 ">
        <h1 className="text-2xl font-bold mb-2">
          Добро пожаловать, {stats?.profile?.full_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управляйте своим портфолио и контентом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/projects"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <DocumentIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Проекты
              </p>
              <p className="text-2xl font-semibold">{stats?.projects}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/skills"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <CommandLineIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Навыки</p>
              <p className="text-2xl font-semibold">{stats?.skills}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/certificates"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Сертификаты
              </p>
              <p className="text-2xl font-semibold">{stats?.certificates}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Последние проекты</h2>
        <div className="space-y-4">
          {recentProjects?.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.technologies.join(", ")}
                </p>
              </div>
              <Link
                to="/admin/projects"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                Редактировать
              </Link>
            </div>
          ))}
          {(!recentProjects || recentProjects.length === 0) && (
            <p className="text-gray-500 dark:text-gray-400">Нет проектов</p>
          )}
        </div>
      </div>
    </div>
  );
}
