import ProjectContainer from "@/app/components/ProjectContainer";

const project1 = {
  title: "Voxely — Build, Edit and Share!",
  description: (
    <>
      <i>Voxely</i> é um web app que eu desenvolvi para criação de modelos 3D
      baseados em voxels com a possibilidade de compartilhar suas criações com a
      comunidade e visualização em <i>realidade aumentada</i>.
    </>
  ),
  list: [
    // <>Construído em React e Supabase permitindo uma experiência fluída e compartilhamento fácil de modelos 3D.</>,
    <>
      Implementação de funcionalidades de AR usando a biblioteca <i>Three.js</i>{" "}
      para visualização 3D.
    </>,
    <>
      Desenvolvido para Web e disponível na <i>Play Store</i> como aplicativo
      Android!
    </>,
  ],
  tags: [
    "React",
    "PWA",
    "Android",
    "Supabase",
    "PostgreSQL",
    "Three.js",
    "Realidade Aumentada",
  ],
  src: "/assets/Voxely.webp",
  alt: "Imagem do projeto Voxely",
  links: [
    {
      label: "Acessar o site!",
      url: "https://voxely.souwell.com",
    },
    {
      label: "Baixar o aplicativo!",
      url: "https://play.google.com/store/apps/details?id=app.voxely.twa",
    }
  ]
};

const project2 = {
  title: "Medital - Encaminhamento Médico",
  description: (
    <>
      Medital é uma plataforma de encaminhamento médico que direciona os
      pacientes para a unidade de saúde mais adequada com base na especialidade,
      distância e a gravidade do caso. O site foi concorrente na{" "}
      <i>Feira de Ciências e Engenharia de Guarulhos de 2022 (FECEG)</i>
    </>
  ),
  list: [
    <>Integrado todo o banco de dados do DATASUS na plataforma.</>,
    <>
      Sistema de priorização de atendimento baseado na gravidade do caso,
      otimizando o tempo de resposta.
    </>,
    <>
      Desenvolvido com NextJS e MongoDB para garantir alta performance e
      escalabilidade.
    </>,
  ],
  tags: ["NextJS", "MongoDB", "NodeJS", "Rest API", "DATASUS", "Healthcare"],
  src: "/assets/Medital.webp",
  alt: "Imagem do projeto Medital",
  links: [
    {
      label: "Acessar o projeto!",
      url: "http://medital.vercel.app/",
    }
  ]
};

const project3 = {
  title: "Five Nights at Freddy's Web",
  description: (
    <>
      Uma versão de navegador do famoso jogo <i>Five Nights at Freddy's</i>. Foi meu primeiro projeto desenvolvido lá em 2020 e o repositório {"("}que contém o código aberto do projeto{")"} já conta com mais de 150 estrelas e mais de 200 forks no meu perfil do GitHub!
    </>
  ),
  tags: ["Javascript", "Web", "Desenvolvimento de Jogos", "Código aberto"],
  src: "/assets/FNAF_WEB.webp",
  alt: "Imagem do projeto Five Nights at Freddy's Web",
  links: [
    {
      label: "Acessar o site!",
      url: "https://wellsousaaa.github.io/Five-Nights-at-Freddys-Web/",
    },
    {
      label: "Ver código no GitHub!",
      url: "https://github.com/wellsousaaa/Five-Nights-at-Freddys-Web",
    }
  ]
};

const project4 = {
  title: "Kidding - Aprendendo Inglês",
  description: (
    <>
      Kidding é um site educacional que utiliza inteligência artificial e jogos didáticos no ensino de inglês para crianças de 4 à 7 anos de idade. O site foi concorrente na Feira de Ciências e Engenharia de Guarulhos de 2020 (FECEG).
    </>
  ),
  tags: ["Javascript", "Python", "Django", "Rest API", "Inteligência artificial"],
  src: "/assets/kidding.jpg",
  alt: "Imagem do projeto Kidding",
};

export default function Projects() {
  return (
    <div className="mt-40">
      <h2 className="text-center text-2xl">Meus projetos</h2>
      <section className="pb-20 mt-10 flex flex-col gap-5 md:gap-10">
        <ProjectContainer {...project1} />
        <ProjectContainer {...project2} className="md:flex-row-reverse" />


        <ProjectContainer {...project3} />
        <ProjectContainer {...project4} className="md:flex-row-reverse" />

        {/* <div className="flex w-11/12 md:w-10/12 mx-auto flex-col md:flex-row gap-5">
          <ProjectContainer {...project3} mini />
          <ProjectContainer {...project4} mini />
        </div> */}
      </section>
    </div>
  );
}
