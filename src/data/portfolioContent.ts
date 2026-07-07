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
  imageUrl?: string;
}

export interface ExperienceItem {
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "ExanIA",
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
  }
];

export const aboutContent: AboutContent = {
  title: "About Me",
  summary:
    "Full Stack developer and tech entrepreneur focused on democratizing education through Artificial Intelligence.",
  body:
    "Specialist in the architecture of scalable solutions using the .NET ecosystem and Google Cloud Platform. I have a solid ability to transform complex technical challenges into market-validated products, currently leading the development of an EdTech platform selected by Startup México.",
  cvUrl: "/portfolio/CV - Enrique Vazquez.pdf",
  cvLabel: "Download CV",
  imageUrl: "/portfolio/me.png",
};

export const experience: ExperienceItem[] = [
  {
    title: "ExanIA, Guadalupe, Nuevo León, Mexico",
    subtitle: "Full-Stack Software Engineer & Founder (2026 - Present)",
    summary:
      "Co-designed, full-stack developed, and launched ExanIA, an adaptive, AI-native B2C EdTech SaaS platform for Mexican university admission exams, scaling to over 260 registered users organically.\n\n• Product Launch & Organic Growth: Co-designed, full-stack developed, and launched an adaptive, AI-native B2C EdTech SaaS platform tailored for high-stakes Mexican university admission exams (EXANI-II, UNAM, IPN). Scaled traction 100% organically to over 260 registered users and validated market willingness-to-pay with an initial 1% conversion rate on a zero-dollar marketing budget.\n\n• AI Architecture & Spaced Repetition: Engineered a Socratic tutoring engine powered by large language models (LLMs) utilizing Retrieval-Augmented Generation (RAG) and pgvector in PostgreSQL. Automated the real-time generation of contextual, explanatory micro-lessons and personalized flashcard decks based strictly on each student's unique error profile.\n\n• Data Engineering & Quality Assurance: Developed an automated LLM-driven data pipeline to audit and validate a proprietary question bank of over 20,000 academic test items. Implemented structural guardrails within the architecture to strictly mitigate model hallucinations, ensuring high-fidelity exam simulations that mirror official guide restrictions.\n\n• Lean Cloud Infrastructure & Finanzas: Deployed a highly scalable, cost-efficient infrastructure on Google Cloud Platform using Docker and automated CI/CD pipelines via GitHub Actions. Maintained an optimized 72% software gross margin by capping fixed server and database development costs at an ultra-lean $528 MXN per month.\n\n• UX Engineering & Monetization: Built a highly responsive web application using Next.js and Tailwind CSS, utilizing Skeleton UIs to eliminate hardware friction on mobile devices, which represent 99.3% of the target market. Architected an idempotent, tiered subscription engine integrated with Stripe webhooks to process three premium tiers (Express, Preparación, and Semestral) to effectively maximize upfront cash flow.",
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
      "Tailwind CSS",
      "GitHub Actions",
      "pgvector",
      "LLMs"
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
