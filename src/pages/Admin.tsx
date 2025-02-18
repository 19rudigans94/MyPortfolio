import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/auth";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import CommandLineIcon from "@heroicons/react/24/outline/CommandLineIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProjects from "./Admin/AdminProjects";
import AdminSkills from "./Admin/AdminSkills";
import AdminCertificates from "./Admin/AdminCertificates";
import AdminProfile from "./Admin/AdminProfile";
import AdminExperiences from "./Admin/AdminExperiences";

const navigation = [
  { name: "Обзор", href: "/admin", icon: TableCellsIcon },
  { name: "Профиль", href: "/admin/profile", icon: CommandLineIcon },
  { name: "Проекты", href: "/admin/projects", icon: Squares2X2Icon },
  { name: "Навыки", href: "/admin/skills", icon: UserIcon },
  { name: "Опыт работы", href: "/admin/experiences", icon: BriefcaseIcon },
  { name: "Сертификаты", href: "/admin/certificates", icon: AcademicCapIcon },
];

export default function Admin() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Админ панель | Виктор Руди</title>
      </Helmet>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Админ панель</h2>
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeftOnRectangleIcon
                  className="mr-3 h-6 w-6"
                  aria-hidden="true"
                />
                Выйти
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="experiences" element={<AdminExperiences />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="profile" element={<AdminProfile />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
