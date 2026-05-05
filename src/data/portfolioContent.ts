export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
}

export interface AboutContent {
  title: string;
  summary: string;
  body: string;
  cvUrl: string;
  cvLabel: string;
}

export interface ExperienceItem {
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "ExanIa",
    description:
      "ExanIA is an EdTech SaaS designed to democratize access to high-quality exam preparation (CENEVAL/EXANI-II). By leveraging Generative AI, we provide personalized, real-time tutoring that adapts to the students learning curve.",
    imageUrl: "/portfolio/exania.png",
    liveUrl: "https://www.exania.app",
    githubUrl: "",
    tags: ["next.js", ".net", "tailwind", "typescript"],
  },
  {
    title: "Quiz Ai App",
    description:
      "Full-stack quiz application powered by artificial intelligence built with Next.js on the frontend, ASP.NET CORE on the backend, and the openRouter API to connect with AI models.",
    imageUrl: "/portfolio/quiz-ai.png",
    liveUrl: "https://quiz-ai-app-three.vercel.app/",
    githubUrl: "https://github.com/TheBasol/quiz-ai-app",
    tags: ["next.js", ".net", "tailwind", "typescript"],
  },
  {
    title: "Crypto Plasma",
    description:
      "Cryptocurrency data visualization app inspired by Crypto Bubble, built with React and Three.js for a 3D experience.",
    imageUrl: "/portfolio/crypto-plasma.png",
    liveUrl: "https://crypto-plasma-3d.vercel.app/",
    githubUrl: "https://github.com/TheBasol/crypto-plasma-3d",
    tags: ["react", "tailwind", "typescript"],
  },
];

export const aboutContent: AboutContent = {
  title: "About Me",
  summary:
    "Full Stack developer and tech entrepreneur focused on democratizing education through Artificial Intelligence.",
  body:
    "Specialist in the architecture of scalable solutions using the .NET ecosystem and Google Cloud Platform. I have a solid ability to transform complex technical challenges into market-validated products, currently leading the development of an EdTech platform selected by Startup México.",
  cvUrl: "/portfolio/CV - enriquevazquez.pdf",
  cvLabel: "Download CV",
};

export const experience: ExperienceItem[] = [
  {
    title: "ExanIA, Guadalupe",
    subtitle: "Full-Stack Software Engineer & Founder (2026 - Present)",
    summary:
      "Led the end-to-end design, development, and launch of a freemium Micro-SaaS platform for university admission exam preparation, successfully scaling to over 100 active users.\n\n• Architecture & Infrastructure: Designed and deployed a scalable infrastructure on Google Cloud Platform (Cloud Run & Cloud SQL) using Docker and GitHub Actions for automated continuous deployment.\n\n• Full-Stack & UX Optimization: Built a highly responsive frontend using Next.js and Tailwind CSS. Optimized Core Web Vitals (CLS/LCP) via Skeleton UIs and implemented gamified assessment features like 'Sudden Death' and adaptive diagnostic exams to boost student retention.\n\n• SaaS Monetization & Growth: Engineered a robust subscription system integrated with Stripe webhooks. Developed an idempotent, tiered referral engine using ASP.NET Core and Entity Framework to drive organic user acquisition.\n\n• AI Integration: Implemented a Socratic tutoring engine ('Dr. ExanIA') powered by Gemini 3 Flash using RAG techniques and pgvector in PostgreSQL, delivering personalized, contextual explanations for students.\n\n• Audit and Data Quality: Led the automated audit and validation of over 15,000 academic test items using LLMs to ensure high-fidelity simulations.",
    tags: [
      "Next.js",
      "React",
      ".NET Core",
      "C#",
      "Entity Framework",
      "Google Cloud Platform",
      "PostgreSQL",
      "Stripe API",
      "Docker",
      "RAG",
      "Tailwind CSS"
    ],
  },
  {
    title: "Manufai, Monterrey",
    subtitle: "Software Development (2022-2023)",
    summary:
      "Development of automation modules and web visualizers to represent complex welding processes and metal deformations.\n\n• Built a pipeline that converts STL parts and welds to WRL and generates an interactive HTML viewer for welding sequences and robot tasks.\n\n• Implemented flows with Next, React, and Flask.\n\n• Developed the system with Python.\n\n• Designed interactive interfaces for visualizing results.",
    tags: ["Next.js", "React", "Flask", "Python", "Three.js", "Automation"],
  }
];
