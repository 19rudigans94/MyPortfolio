import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function About() {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", "8c79a6d6-88a4-4a77-9d80-2c9e8812f485")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: experiences, isLoading: isExperiencesLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("user_id", "8c79a6d6-88a4-4a77-9d80-2c9e8812f485")
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const isLoading = isProfileLoading || isExperiencesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Обо мне - Frontend Developer Portfolio</title>
        <meta
          name="description"
          content="Узнайте больше о моем опыте, навыках и подходе к разработке. Frontend разработчик с фокусом на создание современных веб-приложений."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-8">Обо мне</h1>

        {profile && (
          <div className="card p-6">
            <div className="flex items-center gap-6 mb-6">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.full_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {profile.title}
                </p>
                {profile.location && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {profile.location}
                  </p>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {profile.bio}
            </p>
            <div className="flex gap-4">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}

        {experiences && experiences.length > 0 && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Опыт работы
            </h2>
            <div className="space-y-8">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {experience.position}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {experience.company}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(experience.start_date).toLocaleDateString(
                        "ru-RU",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}{" "}
                      -{" "}
                      {experience.current
                        ? "По настоящее время"
                        : new Date(experience.end_date).toLocaleDateString(
                            "ru-RU",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )}
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {experience.description}
                  </p>
                  {experience.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech: string) => (
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
            </div>
          </div>
        )}
      </div>
    </>
  );
}
