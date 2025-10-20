import Image from 'next/image';

export const About = () => {
  return (
    <section id="about" className="mb-24 px-4">
      <h2 className="text-3xl font-bold text-center">About Me</h2>
      <div className="bg-[#3545d4] w-14 h-1 my-4 mx-auto mb-20"></div>

      <div className="flex flex-col justify-center items-center gap-10">
        <div className="w-full max-w-md h-60 relative">
          <Image src="/source/fotomia.jpg" alt="Enrique Vazquez" layout="fill" objectFit="cover" className="rounded-lg" />
        </div>
        <div className="max-w-3xl text-center leading-7">
          <p>
            Soy un desarrollador de software, tengo conocimientos en Javascript, Python, HTML/CSS.
            También se manejar algunos frameworks del lado del Frontend como React y del lado del backend he manejado node y flask.
            He trabajado en proyectos para empresas, tambien apoyando en proyectos de algunos compañeros.
          </p>
        </div>
        <div>
          <a href="/source/CV.pdf" download="CV-Enrique-Vazquez.pdf" className="flex justify-center items-center w-48 h-12 text-white bg-[#482ebb] rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors">
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
};