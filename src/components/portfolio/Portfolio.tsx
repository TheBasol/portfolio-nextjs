
import Image from 'next/image';
import Link from 'next/link';

// Define the type for a single project
interface Project {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
}

// Array of projects with the defined type
const projects: Project[] = [
  {
    title: 'Gallery App React',
    description: 'App para buscar imagenes libres de derechos de autor hecha con Typescript y React utilizando la api de unsplash.',
    imageUrl: '/source/gallery.png',
    liveUrl: 'https://gallery-app-typescript.netlify.app/',
    githubUrl: 'https://github.com/TheBasol/Gallery-App-Typescript',
    tags: ['react', 'typescript'],
  },
  {
    title: 'Phonestore Web',
    description: 'Pagina de una tienda de telefonos 100% responsive hecha con CSS y Js para las animaciones.',
    imageUrl: '/source/phonestore.png',
    liveUrl: 'https://thebasol.github.io/PhoneStore/',
    githubUrl: 'https://github.com/TheBasol/PhoneStore',
    tags: ['html', 'css', 'js'],
  },
  // ... other projects here
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="my-40 flex flex-col justify-center items-center px-4">
      <h2 className="text-3xl font-bold">Portfolio</h2>
      <div className="bg-[#3545d4] w-14 h-1 my-4"></div>

      <div className="flex flex-col gap-24 mt-20">
        {projects.map((project) => (
          <div key={project.title} className="w-full max-w-4xl p-6 bg-[#2c283a] rounded-lg border-2 border-[#AAB1F2]">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-full md:w-2/5 h-64 md:-ml-12">
                 <Image src={project.imageUrl} alt={project.title} layout="fill" objectFit="cover" className="rounded-lg border-2 border-[#AAB1F2]" />
              </div>
              <div className="flex flex-col gap-6 md:w-3/5">
                <h2 className="text-2xl font-bold">{project.title}</h2>
                <p>{project.description}</p>
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 w-40 h-12 text-white bg-[#482ebb] rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors self-start">
                    Go
                   <div className="arrow"></div>
                </Link>
                <div className="flex justify-between items-center mt-4">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="icon github" aria-label={`${project.title} GitHub repository`}></a>
                  <div className="flex gap-4">
                    {project.tags.map(tag => <div key={tag} className={`icon ${tag}`}></div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
