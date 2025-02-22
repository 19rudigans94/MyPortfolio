import { Helmet } from "react-helmet-async";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import CodeBracketSquareIcon from "@heroicons/react/24/outline/CodeBracketSquareIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import PageTitle from "@/components/SEO/PageTitle";

export default function Contact() {
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

  const contacts = [
    {
      title: "Email",
      icon: EnvelopeIcon,
      description: "Напишите мне на почту для обсуждения проектов",
      action: "Написать",
      href: `mailto:${profile?.email}`,
    },
    {
      title: "GitHub",
      icon: CodeBracketSquareIcon,
      description: "Посмотрите мои проекты на GitHub",
      action: "Перейти в GitHub",
      href: profile?.github_url,
    },
    {
      title: "LinkedIn",
      icon: UserCircleIcon,
      description: "Свяжитесь со мной в LinkedIn",
      action: "Открыть профиль",
      href: profile?.linkedin_url,
    },
  ].filter((contact) => contact.href);

  return (
    <>
      <PageTitle
        title="Контакты"
        description="Свяжитесь со мной для обсуждения проектов и сотрудничества"
      />

      <div className="max-w-4xl mx-auto animate-fadeIn">
        <h1 className="text-4xl font-bold text-center mb-12 dark:text-gray-700">
          Контакты
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.title}
              className="card p-6 text-center hover:scale-[1.02] transition-transform duration-300"
            >
              <contact.icon className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h2 className="text-xl font-semibold mb-4">{contact.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {contact.description}
              </p>
              <a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full text-sm font-medium"
              >
                {contact.action}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
