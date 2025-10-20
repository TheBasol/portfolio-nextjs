
export const Contact = () => {
  return (
    <section id="contact" className="my-40 flex flex-col justify-center items-center px-4">
      <h2 className="text-3xl font-bold">Contact Me</h2>
      <div className="bg-[#3545d4] w-14 h-1 my-4"></div>
      <p className="text-gray-400 mt-4">Get in touch</p>
      <h3 className="text-white text-lg mt-2 mb-10 hidden md:block">Interested to work together? - Let's talk</h3>
      
      <form id="form" className="mt-8 flex flex-col items-center justify-center w-full max-w-3xl gap-5">
        <div className="flex flex-col md:flex-row w-full md:w-4/5 gap-5">
          <input type="text" placeholder="Your Name" name="name" required className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-2 w-full focus:outline-none focus:border-[#818bd4]"/>
          <input type="email" placeholder="Your email" name="email" required className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-2 w-full focus:outline-none focus:border-[#818bd4]"/>
        </div>
        <input type="text" placeholder="Subject" name="subject" required className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-2 w-full md:w-4/5 focus:outline-none focus:border-[#818bd4]"/>
        <textarea name="message" placeholder="Your Message" required className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-2 w-full md:w-4/5 h-28 focus:outline-none focus:border-[#818bd4]"></textarea>
        <button className="flex justify-center items-center w-48 h-12 text-white bg-[#482ebb] rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors">
            Send Message
        </button>
      </form>
    </section>
  );
};