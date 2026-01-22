import Image from "next/image";

export function ImpactShowcase() {
  return (
    <section className="impact-section" aria-labelledby="impact-title">
      <h2 id="impact-title" className="visually-hidden">
        Painel digital em destaque
      </h2>

      <div className="impact-grid">
        <article className="impact-card" aria-label="Painel digital Croma Outdoor">
          <div className="impact-card-media" aria-hidden>
            <Image
              src="/media/painel_digital.webp"
              alt="Painel digital da Croma Outdoor"
              width={420}
              height={520}
              priority
            />
          </div>

          <div className="impact-card-copy">
            <p>Os melhores resultados para o seu negócio é com a</p>
            <div className="impact-card-logo">
              <Image
                src="/assets/brand/croma_logo.webp"
                alt="Croma Outdoor"
                width={360}
                height={110}
                priority
              />
            </div>
          </div>
        </article>

        <article className="impact-metric-card" aria-label="Frequência de exibição">
          <div className="impact-metric-label">Seu anúncio exibido por mais de:</div>
          <div className="impact-metric-value">
            <span>340x</span>
            <small>
              <span>por</span>
              <span>dia</span>
            </small>
          </div>
          <p className="impact-metric-subcopy">
            isso é mais de <strong>10.000 vezes por mês!</strong>
          </p>
          <p className="impact-metric-footnote">* valor aproximado para o painel digital</p>
        </article>

        <div className="impact-side-stack" aria-label="Indicadores adicionais">
          <article className="impact-stat-card" aria-label="Alcance de pessoas">
            <p className="impact-stat-label">Para até:</p>
            <p className="impact-stat-value">
              25.000 <span>pessoas em 24h</span>
            </p>
            <p className="impact-stat-footnote">* valor estimado de público para o painel digital</p>
          </article>

          <article className="impact-stat-card impact-stat-card--location" aria-label="Localização do painel">
            <p className="impact-stat-title">
              Tudo isso com o painel digital melhor localizado de Araguari
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
