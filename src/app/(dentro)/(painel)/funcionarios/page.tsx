'use client';

import { useEffect, useState, useContext } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

Chart.register(ArcElement, Tooltip, Legend);

export type Leave = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  justificativo: string | null;
  status: "pendente" | "aprovada" | "rejeitada";
  admin_comentario: string | null;
  created_at: string;
  funcionario_nome: string;
};

const FuncionarioDashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [aprovada, setAprovadas] = useState(0);
  const [reprovada, setReprovadas] = useState(0);
  const [pendente, setPendentes] = useState(0);
  const [total, setTotal] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/logincomsenha');
      return;
    }

    fetch('https://backend-django-2-7qpl.onrender.com/api/dispensa/my/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then((j: Leave[]) => {
        const aprovadas = j.filter(l => l.status === "aprovada").length;
        const reprovadas = j.filter(l => l.status === "rejeitada").length;
        const pendentes = j.filter(l => l.status === "pendente").length;

        setTotal(j.length);
        setAprovadas(aprovadas);
        setReprovadas(reprovadas);
        setPendentes(pendentes);
      })
      .catch(err => console.error(err));
  }, [accessToken, router]);

  if (!accessToken) return null;

  const doughnutData = {
    labels: ['Aprovadas', 'Rejeitadas', 'Pendentes'],
    datasets: [
      {
        data: [aprovada, reprovada, pendente],
        backgroundColor: ['#22c55e', '#ef4444', '#facc15'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="md:text-4xl font-bold text-gray-500">Painel do Funcionário</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total de Dispensas', value: total, color: 'blue' },
          { label: 'Aprovadas', value: aprovada, color: 'green' },
          { label: 'Rejeitadas', value: reprovada, color: 'red' },
          { label: 'Pendentes', value: pendente, color: 'yellow' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${item.color}-500`}
          >
            <h2 className="text-gray-500">{item.label}</h2>
            <p className={`text-2xl font-bold text-${item.color}-600`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="w-full md:w-1/2 mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-600 mb-4">
          Status das minhas dispensas
        </h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
};

export default FuncionarioDashboard;
