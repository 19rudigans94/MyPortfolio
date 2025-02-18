import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import GitHubCalendar from "react-github-calendar";
import CommandLineIcon from "@heroicons/react/24/outline/CommandLineIcon";
import ServerIcon from "@heroicons/react/24/outline/ServerIcon";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import CodeBracketIcon from "@heroicons/react/24/outline/CodeBracketIcon";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import CodeBracketSquareIcon from "@heroicons/react/24/outline/CodeBracketSquareIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import ServerStackIcon from "@heroicons/react/24/outline/ServerStackIcon";
import CloudIcon from "@heroicons/react/24/outline/CloudIcon";

export default function Home() {
  const { data: profile } = useQuery({
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

  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", "8c79a6d6-88a4-4a77-9d80-2c9e8812f485")
        .order("category", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Сертификаты
  const { data: certificates } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", "8c79a6d6-88a4-4a77-9d80-2c9e8812f485")
        .order("issue_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Группировка навыков по категориям
  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  const skillCategories = skillsByCategory
    ? Object.entries(skillsByCategory).map(([category, items]) => ({
        title: category,
        icon:
          category === "Frontend"
            ? CommandLineIcon
            : category === "Backend"
            ? ServerStackIcon
            : category === "DevOps"
            ? WrenchScrewdriverIcon
            : category === "Cloud"
            ? CloudIcon
            : CodeBracketIcon,
        items,
      }))
    : [];

  return (
    <>
      <Helmet>
        <title>{profile?.full_name || "Frontend Developer"} | Portfolio</title>
        <meta
          name="description"
          content={profile?.bio || "Frontend Developer Portfolio"}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 text-center card animate-fadeIn">
        <h1 className="text-5xl font-bold mb-6">
          Привет, я {profile?.full_name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          {profile?.bio}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/projects"
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full font-medium"
          >
            Мои проекты
          </Link>
          <Link
            to="/contact"
            className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white px-6 py-3 rounded-full font-medium"
          >
            Связаться со мной
          </Link>
        </div>
      </section>

      {/* Skills Section */}
      {skillCategories.length > 0 && (
        <section className="py-20 card animate-fadeIn my-8">
          <h2 className="text-3xl font-bold text-center mb-12">Мои навыки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {skillCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center"
              >
                <category.icon className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
                <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {(category.items as string[]).map((item: string) => (
                    <li key={item} className="text-gray-600 dark:text-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GitHub Section */}
      <section className="py-20 card animate-fadeIn my-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Мой GitHub
        </h2>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
            <GitHubCalendar
              username="19rudigans94"
              colorScheme="light"
              fontSize={14}
              blockSize={12}
              blockMargin={2}
            />
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      {certificates && certificates.length > 0 && (
        <section className="py-20 card animate-fadeIn my-8">
          <h2 className="text-3xl font-bold text-center mb-12">Сертификаты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                {certificate.image_url && (
                  <img
                    src={certificate.image_url}
                    alt={certificate.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {certificate.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {certificate.provider} •{" "}
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </p>
                  {certificate.credential_url && (
                    <a
                      href={certificate.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full text-sm font-medium"
                    >
                      Посмотреть сертификат
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
