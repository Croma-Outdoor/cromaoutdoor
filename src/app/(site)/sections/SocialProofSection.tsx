'use client';

import Image from "next/image";
import styles from "./SocialProofSection.module.css";

interface LogoCard {
  id: string;
  src: string;
  alt: string;
  variant: "light" | "dark";
}

const logos: LogoCard[] = [
  {
    id: "imepac",
    src: "/media/logos/logo_imepac.webp",
    alt: "IMEPAC - Centro Universitário",
    variant: "light",
  },
  {
    id: "oboticario",
    src: "/media/logos/logo_boticario.webp",
    alt: "O Boticário",
    variant: "light",
  },
  {
    id: "sagradafamilia",
    src: "/media/logos/logo_sagradasfamilia.webp",
    alt: "Sagrada Família",
    variant: "dark",
  },
  {
    id: "wntelecom",
    src: "/media/logos/logo_wntelecom.webp",
    alt: "WN Telecom",
    variant: "dark",
  },
];

export function SocialProofSection() {
  return (
    <section className={styles.section} aria-labelledby="social-proof-title">
      <div className={styles.container}>
        {/* Left Column - Content */}
        <div className={styles.content}>
          <h2 id="social-proof-title" className={styles.title}>
            FAÇA COMO<br/>AS MAIORES<br/>EMPRESAS DE<br/>ARAGUARI!
          </h2>

          {/* Logos Grid */}
          <div className={styles.logosGrid}>
            {logos.map((logo) => (
              <div
                key={logo.id}
                className={`${styles.logoCard} ${styles[`logoCard--${logo.variant}`]}`}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Outdoor Image */}
        <div className={styles.imageWrapper}>
          <Image
            src="/media/outdoor.webp"
            alt="Outdoor com marca - Sua marca onde todos veem"
            width={350}
            height={600}
            priority
            className={styles.outdoorImage}
          />
        </div>
      </div>
    </section>
  );
}
