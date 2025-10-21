
export const About = () => {
  return (
    <section id="about" className="mb-24 px-4">
      <h2 className="text-3xl font-bold text-center">About Me</h2>
      <div className="bg-[#3545d4] w-14 h-1 my-4 mx-auto mb-20"></div>

      <div className="flex flex-col justify-center items-center gap-10">

        <div className="max-w-3xl text-center leading-7">
          <p>
            Soy un desarrollador de software con una profunda curiosidad por la intersección entre la tecnología y la creatividad. Mi experiencia principal se encuentra en el desarrollo full-stack, utilizando Next.js y React para construir interfaces de usuario modernas y eficientes, y con Next.js y Python (con ApiFast) para el desarrollo del backend de mis proyectos, también me apasiona el mundo de los gráficos por computadora, lo que me ha llevado a desarrollar proyectos de visualización 3D con Three.js.
          </p>
        </div>
        <div>
          <a href="/portfolio/CV - enriquevazquez.pdf" download="CV-Enrique-Vazquez.pdf" className="flex justify-center items-center w-48 h-12 text-white bg-[#482ebb] rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors">
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
};