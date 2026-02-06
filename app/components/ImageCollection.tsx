import { BlurFade } from "@/components/ui/blur-fade"

/* eslint-disable @next/next/no-img-element */
type Company = {
  src: string
  alt: string
}

const companies: Company[] = [
  {
    src: "https://wendelldesousa.netlify.app/assets/logos/esphere.webp",
    alt: "Logotipo da Esphere",
  },
  {
    src: "https://wendelldesousa.netlify.app/assets/logos/smart.webp",
    alt: "Logotipo da Smart",
  },
  {
    src: "https://wendelldesousa.netlify.app/assets/logos/wisebets.webp",
    alt: "Logotipo da WiseBets",
  },
  {
    src: "https://wendelldesousa.netlify.app/assets/logos/rifa321.webp",
    alt: "Logotipo da Rifa321",
  },
  {
    src: "https://wendelldesousa.netlify.app/assets/logos/rifaclick.webp",
    alt: "Logotipo da RifaClick",
  },
  {
    src: "https://wendelldesousa.netlify.app/assets/logos/menuflow.webp",
    alt: "Logotipo da MenuFlow",
  },
]

export function ImageCollection() {
  return (
    <section id="photos">
      <div className="columns-2 gap-4 sm:columns-3">
        {companies.map(({ src, alt }, idx) => (
          // <BlurFade  delay={0.25 + idx * 0.05} inView>
          <img
            key={src}
            className="mb-4 size-full rounded-lg object-contain shadow-sm border"
            src={src}
            alt={alt}
          />
          // </BlurFade>
        ))}
      </div>
    </section>
  )
}
