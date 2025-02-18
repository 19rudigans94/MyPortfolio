import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { Certificate } from "@/types";
import { useAuth } from "@/lib/auth";
import CertificateForm from "./components/CertificateForm";

export default function AdminCertificates() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user?.id)
        .order("issue_date", { ascending: false });

      if (error) throw error;
      return data as Certificate[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (certificate: Omit<Certificate, "id" | "user_id">) => {
      return api.createCertificate(certificate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      certificate,
    }: {
      id: string;
      certificate: Partial<Certificate>;
    }) => api.updateCertificate(id, certificate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      setEditingCertificate(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
    },
  });

  const handleCreate = (certificate: Omit<Certificate, "id">) => {
    createMutation.mutate(certificate);
  };

  const handleUpdate = (certificate: Certificate) => {
    const { id, ...updateData } = certificate;
    updateMutation.mutate({ id, certificate: updateData });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот сертификат?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Сертификаты</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md"
        >
          Добавить сертификат
        </button>
      </div>

      {(isFormOpen || editingCertificate) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <CertificateForm
              certificate={editingCertificate}
              onSubmit={editingCertificate ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCertificate(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates?.map((certificate) => (
          <div
            key={certificate.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
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
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-sm block mb-4"
                >
                  Посмотреть сертификат
                </a>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setEditingCertificate(certificate)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(certificate.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
