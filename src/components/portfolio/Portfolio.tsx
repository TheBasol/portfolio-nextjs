
import Image from 'next/image';
import Link from 'next/link';
import { TechIcon, getTechColor } from './Icons';

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
    title: 'Quiz Ai App',
    description: 'App para hacer quizzes de inteligencia artificial hecha con Typescript y React utilizando la api de OpenAI.',
    imageUrl: '/portfolio/quiz-ai.png',
    liveUrl: 'https://quiz-ai-app-three.vercel.app/',
    githubUrl: 'https://github.com/TheBasol/quiz-ai-app',
    tags: ['next.js', 'tailwind', 'typescript'],
  },
  {
    title: 'Breaking News App',
    description: 'Una aplicación moderna y responsiva de noticias construida con Next.js 15, TypeScript y Tailwind CSS que entrega noticias de última hora en tiempo real de todo el mundo.',
    imageUrl: '/portfolio/breaking-news.png',
    liveUrl: 'https://breaking-news-next.vercel.app/',
    githubUrl: 'https://github.com/TheBasol/breaking-news-next?tab=readme-ov-file',
    tags: ['next.js', 'typescript', 'tailwindcss'],
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
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                   </svg>
                </Link>
                <div className="flex justify-between items-center mt-4">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors" aria-label={`${project.title} GitHub repository`}>
                    <TechIcon name="github" className="w-8 h-8" />
                  </a>
                  <div className="flex gap-4">
                    {project.tags.map(tag => (
                      <div key={tag} className={`flex items-center ${getTechColor(tag)}`}>
                        <TechIcon name={tag} className="w-6 h-6" />
                      </div>
                    ))}
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
