import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Виктор Руди. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
