'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

type Perfil = {
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
};

type Avaliacao = {
  nota: number;
  feedback: string;
  data: string;
};

type Formacao = {
  titulo: string;
  data_inicio: string;
  local: string;
};

type Notificacao = {
  titulo: string;
  mensagem: string;
  data: string;
};

const PainelFuncionario = () => {
  const { accessToken } = useContext(AuthContext);
  const router = useRouter();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [formacoes, setFormacoes] = useState<Formacao[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    if (!accessToken) {
      router.push("/logincomsenha");
      return;
    }

    const fetchDados = async () => {
      try {
        const [resPerfil, resAvaliacao, resFormacoes, resNotificacoes] = await Promise.all([
          fetch('https://backend-django-2-7qpl.onrender.com/api/funcionario/meu-perfil/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch('https://backend-django-2-7qpl.onrender.com/api/avaliacoes/minha/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch('https://backend-django-2-7qpl.onrender.com/api/formacoes/futuras/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch('https://backend-django-2-7qpl.onrender.com/api/notificacoes/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setPerfil(await resPerfil.json());
        setAvaliacao(await resAvaliacao.json());
        setFormacoes(await resFormacoes.json());
        setNotificacoes(await resNotificacoes.json());
      } catch (err) {
        console.error('Erro ao carregar dados do funcionário:', err);
      }
    };

    fetchDados();
  }, [accessToken]);

  if (!accessToken) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-600">Painel do Funcionário</h1>

      {/* Perfil */}
      {perfil && (
        <div className="bg-white p-6 rounded-xl shadow space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">👤 Meu Perfil</h2>
          <p><strong>Nome:</strong> {perfil.nome}</p>
          <p><strong>Cargo:</strong> {perfil.cargo}</p>
          <p><strong>Departamento:</strong> {perfil.departamento}</p>
          <p><strong>Email:</strong> {perfil.email}</p>
        </div>
      )}

      {/* Avaliação */}
      {avaliacao && (
        <div className="bg-white p-6 rounded-xl shadow space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">📈 Avaliação de Desempenho</h2>
          <p><strong>Nota:</strong> {avaliacao.nota}%</p>
          <p><strong>Feedback:</strong> {avaliacao.feedback}</p>
          <p><strong>Última Avaliação:</strong> {avaliacao.data}</p>
        </div>
      )}

      {/* Formações futuras */}
      {formacoes.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📚 Formações Futuras</h2>
          <ul className="space-y-1 list-disc pl-5">
            {formacoes.map((f, i) => (
              <li key={i}>
                <span className="font-medium">{f.titulo}</span> — {f.data_inicio} em {f.local}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notificações */}
      {notificacoes.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">🔔 Notificações</h2>
          <ul className="space-y-3">
            {notificacoes.map((n, i) => (
              <li key={i} className="border-l-4 border-blue-500 pl-4">
                <p className="font-bold">{n.titulo}</p>
                <p className="text-gray-600">{n.mensagem}</p>
                <p className="text-sm text-gray-400">{n.data}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PainelFuncionario;
