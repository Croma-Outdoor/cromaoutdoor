import Link from "next/link";

export default function MetodosPage() {
  return (
    <section className="section page-section">
      <div className="page-header">
        <Link href="/" className="back-home-link">
          ← Voltar para o início
        </Link>
        <h1 className="page-title">Métodos</h1>
      </div>
      <div className="page-content">
        <p className="body-copy">
          Trabalhamos com diversos formatos de mídia exterior: paineis premium com backlight,
          frontlights clássicos e projetos especiais com recortes e volumetria.
        </p>
      </div>
    </section>
  );
}
