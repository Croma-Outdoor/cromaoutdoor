'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";
import { useOutdoorsCrud, type OutdoorPayload, type OutdoorRecord } from "@/app/hooks/useOutdoorsCrud";
import { useSupabaseAuth } from "@/app/hooks/useSupabaseAuth";

const emptyForm: Record<keyof Omit<OutdoorPayload, "latitude" | "longitude"> | "latitude" | "longitude", string> = {
  codigo: "",
  tipo: "",
  bairro: "",
  cidade: "",
  endereco: "",
  latitude: "",
  longitude: "",
  ocupato_ate: "",
  imagem_url: "",
};

type Credentials = { email: string; password: string };

export default function AdminPage() {
  const { t } = useAppTranslation();
  const admin = t("admin", { returnObjects: true }) as TranslationSchema["admin"];
  const auth = useSupabaseAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isAuthenticated = Boolean(auth.session);
  const { serverTime, error: serverTimeError } = useServerTime(isAuthenticated);

  async function handleLogin(credentials: Credentials) {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await auth.signIn(credentials);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Falha ao entrar");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await auth.signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  let content: ReactNode;

  if (auth.isLoading) {
    content = (
      <article className="stat-card">
        <p className="section-label">Autenticação</p>
        <p className="body-copy">Validando sessão junto ao Supabase...</p>
      </article>
    );
  } else if (isAuthenticated && auth.session) {
    content = (
      <>
        <header>
          <p className="section-label">{admin.label}</p>
          <h1>{admin.title}</h1>
          <p className="body-copy">{admin.intro}</p>
        </header>

        <div className="media-grid">
          {admin.features.map((item) => (
            <article className="admin-card" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <article className="stat-card">
          <p className="section-label">{admin.nextStepsTitle}</p>
          <ul>
            {admin.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>

        <AccountBanner
          email={auth.session.user.email ?? "Conta autenticada"}
          onSignOut={handleSignOut}
          isSigningOut={isSigningOut}
          serverTime={serverTime}
          serverTimeError={serverTimeError}
        />
        <OutdoorCrudPanel />
      </>
    );
  } else {
    content = <LoginCard onSubmit={handleLogin} isSubmitting={isLoggingIn} errorMessage={loginError ?? auth.authError} />;
  }

  return <section className="admin-wrapper">{content}</section>;
}

function LoginCard({ onSubmit, isSubmitting, errorMessage }: { onSubmit: (credentials: Credentials) => Promise<void>; isSubmitting: boolean; errorMessage: string | null }) {
  const [formState, setFormState] = useState<Credentials>({ email: "", password: "" });
  const [localError, setLocalError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    if (!formState.email.trim() || !formState.password.trim()) {
      setLocalError("Informe e-mail e senha cadastrados no Supabase.");
      return;
    }

    try {
      await onSubmit(formState);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Falha ao autenticar.");
    }
  }

  const feedback = localError ?? errorMessage;

  return (
    <article className="stat-card login-card">
      <h2>Acesso restrito</h2>
      <p className="body-copy">Use o e-mail cadastrado no Supabase Auth &gt; Users para liberar o painel.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail</span>
          <input type="email" name="email" value={formState.email} onChange={handleChange} placeholder="operacoes@croma.com" required />
        </label>
        <label>
          <span>Senha</span>
          <input type="password" name="password" value={formState.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
        {feedback && <p className="helper-text error">{feedback}</p>}
      </form>
    </article>
  );
}

function AccountBanner({
  email,
  onSignOut,
  isSigningOut,
  serverTime,
  serverTimeError,
}: {
  email: string;
  onSignOut: () => Promise<void>;
  isSigningOut: boolean;
  serverTime: string | null;
  serverTimeError: string | null;
}) {
  const clockMessage = serverTimeError ?? (serverTime ? formatServerTimestamp(serverTime) : "Sincronizando...");
  return (
    <article className="stat-card admin-toolbar">
      <div>
        <p className="section-label">Sessão ativa</p>
        <p className="body-copy">{email}</p>
        <p className="helper-text">Hora do servidor: {clockMessage}</p>
      </div>
      <button type="button" className="cta-button outline" onClick={onSignOut} disabled={isSigningOut}>
        {isSigningOut ? "Saindo..." : "Encerrar sessão"}
      </button>
    </article>
  );
}

function formatServerTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString("pt-BR");
}

function OutdoorCrudPanel() {
  const {
    records,
    isLoading,
    isSaving,
    error,
    mutationError,
    createOutdoor,
    updateOutdoor,
    deleteOutdoor,
  } = useOutdoorsCrud();

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  function validateNumbers() {
    if (!formState.latitude.trim() || !formState.longitude.trim()) {
      setStatusMessage("Informe latitude e longitude.");
      return null;
    }

    const latitude = Number(formState.latitude);
    const longitude = Number(formState.longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setStatusMessage("Latitude ou longitude inválidas.");
      return null;
    }
    return { latitude, longitude };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);

    if (!formState.codigo.trim()) {
      setStatusMessage("Informe o código do outdoor.");
      return;
    }

    const numbers = validateNumbers();
    if (!numbers) return;

    const payload: OutdoorPayload = {
      codigo: formState.codigo.trim(),
      tipo: formState.tipo,
      bairro: formState.bairro,
      cidade: formState.cidade,
      endereco: formState.endereco,
      latitude: numbers.latitude,
      longitude: numbers.longitude,
      ocupato_ate: formState.ocupato_ate || null,
      imagem_url: formState.imagem_url,
    };

    try {
      if (editingId) {
        await updateOutdoor(editingId, payload);
        setStatusMessage("Outdoor atualizado com sucesso.");
      } else {
        await createOutdoor(payload);
        setStatusMessage("Outdoor cadastrado com sucesso.");
      }
      setFormState(emptyForm);
      setEditingId(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Erro ao salvar registro.");
    }
  }

  function handleEdit(record: OutdoorRecord) {
    setEditingId(record.id);
    setFormState({
      codigo: record.codigo,
      tipo: record.tipo,
      bairro: record.bairro,
      cidade: record.cidade,
      endereco: record.endereco,
      latitude: String(record.latitude),
      longitude: String(record.longitude),
      ocupato_ate: record.ocupato_ate ? record.ocupato_ate.slice(0, 10) : "",
      imagem_url: record.imagem_url ?? "",
    });
    setStatusMessage("Editando outdoor. Altere os campos e salve.");
  }

  async function handleDelete(record: OutdoorRecord) {
    const confirmed = window.confirm(`Deseja realmente excluir o outdoor ${record.codigo}?`);
    if (!confirmed) return;
    try {
      await deleteOutdoor(record.id);
      setStatusMessage("Outdoor removido.");
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Erro ao excluir registro.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormState(emptyForm);
    setStatusMessage(null);
  }

  return (
    <section className="admin-panel">
      <header>
        <p className="section-label">Inventário</p>
        <h2>Gerencie os outdoors em produção</h2>
        <p className="body-copy">
          Todos os registros sobem direto para o Supabase. Utilize este formulário para cadastrar rapidamente novas faces e manter o mapa sincronizado.
        </p>
      </header>

      <form className="stat-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Código*</span>
            <input name="codigo" value={formState.codigo} onChange={handleChange} required />
          </label>
          <label>
            <span>Tipo</span>
            <input name="tipo" value={formState.tipo} onChange={handleChange} />
          </label>
          <label>
            <span>Bairro</span>
            <input name="bairro" value={formState.bairro} onChange={handleChange} />
          </label>
          <label>
            <span>Cidade</span>
            <input name="cidade" value={formState.cidade} onChange={handleChange} />
          </label>
          <label>
            <span>Endereço</span>
            <input name="endereco" value={formState.endereco} onChange={handleChange} />
          </label>
          <label>
            <span>Latitude*</span>
            <input name="latitude" value={formState.latitude} onChange={handleChange} placeholder="Ex.: -18.646000" required />
          </label>
          <label>
            <span>Longitude*</span>
            <input name="longitude" value={formState.longitude} onChange={handleChange} placeholder="Ex.: -48.193000" required />
          </label>
          <label>
            <span>Ocupado até</span>
            <input type="date" name="ocupato_ate" value={formState.ocupato_ate} onChange={handleChange} />
          </label>
          <label>
            <span>Imagem URL</span>
            <input name="imagem_url" value={formState.imagem_url} onChange={handleChange} placeholder="https://" />
          </label>
        </div>

        <div className="cta-buttons">
          <button type="submit" className="cta-button" disabled={isSaving}>
            {editingId ? "Salvar alterações" : "Adicionar outdoor"}
          </button>
          {editingId && (
            <button type="button" className="cta-button outline" onClick={handleCancelEdit}>
              Cancelar edição
            </button>
          )}
        </div>
        {statusMessage && <p className="helper-text">{statusMessage}</p>}
        {mutationError && <p className="helper-text error">{mutationError}</p>}
      </form>

      <div className="stat-card">
        <p className="section-label">Base atual</p>
        {error && <p className="helper-text error">Erro ao consultar: {error}</p>}
        {isLoading ? (
          <p>Carregando dados...</p>
        ) : records.length === 0 ? (
          <p>Nenhum outdoor cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Localização</th>
                  <th>Coordenadas</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.codigo}</td>
                    <td>
                      {record.endereco || "--"}
                      <br />
                      <small>{record.bairro}</small>
                    </td>
                    <td>
                      {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
                    </td>
                    <td>{record.ocupato_ate ? `Ocupado até ${new Date(record.ocupato_ate).toLocaleDateString("pt-BR")}` : "Disponível"}</td>
                    <td>
                      <button type="button" className="link-button" onClick={() => handleEdit(record)}>
                        Editar
                      </button>
                      <button type="button" className="link-button danger" onClick={() => handleDelete(record)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function useServerTime(isEnabled: boolean, refreshInterval = 60000) {
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setServerTime(null);
      setError(null);
      return undefined;
    }

    let isMounted = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function fetchTime() {
      try {
        const response = await fetch("/api/server-time");
        if (!response.ok) {
          throw new Error("Falha ao consultar hora do servidor.");
        }
        const payload = (await response.json()) as { serverTime: string };
        if (isMounted) {
          setServerTime(payload.serverTime);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erro ao consultar hora do servidor.");
        }
      }
    }

    fetchTime();
    if (refreshInterval > 0) {
      timer = setInterval(fetchTime, refreshInterval);
    }

    return () => {
      isMounted = false;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isEnabled, refreshInterval]);

  return { serverTime, error };
}
