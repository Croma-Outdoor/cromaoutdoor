'use client';

import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";

export default function AdminPage() {
  const { t } = useAppTranslation();
  const admin = t("admin", { returnObjects: true }) as TranslationSchema["admin"];

  return (
    <section className="admin-wrapper">
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
        {/* TODO: Wire admin actions to future API and auth layer. */}
      </article>
    </section>
  );
}
