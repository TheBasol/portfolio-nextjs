
export const About = () => {
  return (
    <section id="about" className="mb-24 px-4">
      <h2 className="text-3xl font-bold text-center">About Me</h2>
      <div className="bg-[#3545d4] w-14 h-1 my-4 mx-auto mb-20"></div>

      <div className="flex flex-col justify-center items-center gap-10">

        <div className="max-w-3xl text-center leading-7">
          <p>
            I am a software developer with a great curiosity for technology and software. My main experience lies in full-stack development, using Next.js and React to build modern and efficient user interfaces, and ASP.Net Core and Python for backend development of my projects. I am also passionate about the world of computer graphics, which has led me to develop 3D visualization projects with Three.js.
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