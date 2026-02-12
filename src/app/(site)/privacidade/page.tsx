import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <section className="section page-section">
      <div className="page-header">
        <Link href="/" className="back-home-link">
          ← Voltar para o início
        </Link>
        <h1 className="page-title">Política de Privacidade</h1>
      </div>
      <div className="page-content">
        <p className="body-copy">
          Conteúdo da política de privacidade em breve.
        </p>
      </div>
    </section>
  );
}
