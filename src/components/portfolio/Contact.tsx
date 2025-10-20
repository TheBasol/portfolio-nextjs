
'use client';

import { useContactEngine } from "@/hooks/useContactEngine";

export const Contact = () => {
  const {
    formData,
    status,
    handleInputChange,
    handleSubmit
  } = useContactEngine();

  return (
    <section id="contact" className="my-40 flex flex-col justify-center items-center px-4">
      <h2 className="text-3xl font-bold">Contact Me</h2>
      <div className="bg-[#3545d4] w-14 h-1 my-4"></div>
      <p className="text-gray-400 mt-4">Get in touch</p>
      <h3 className="text-white text-lg mt-2 mb-10 hidden md:block">Interested to work together? - Let&apos;s talk</h3>
      
      {/* Mensaje de estado */}
      {status.message && (
        <div className={`mt-4 p-4 rounded-lg text-center max-w-3xl w-full ${
          status.type === 'success' 
            ? 'bg-green-900/50 border border-green-500 text-green-300' 
            : status.type === 'error'
            ? 'bg-red-900/50 border border-red-500 text-red-300'
            : 'bg-blue-900/50 border border-blue-500 text-blue-300'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center justify-center w-full max-w-3xl gap-5">
        <div className="flex flex-col md:flex-row w-full md:w-4/5 gap-5">
          <input 
            type="text" 
            placeholder="Your Name" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            required 
            disabled={status.type === 'loading'}
            className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-3 w-full focus:outline-none focus:border-[#818bd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            name="email" 
            value={formData.email}
            onChange={handleInputChange}
            required 
            disabled={status.type === 'loading'}
            className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-3 w-full focus:outline-none focus:border-[#818bd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <input 
          type="text" 
          placeholder="Subject" 
          name="subject" 
          value={formData.subject}
          onChange={handleInputChange}
          required 
          disabled={status.type === 'loading'}
          className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-3 w-full md:w-4/5 focus:outline-none focus:border-[#818bd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <textarea 
          name="message" 
          placeholder="Your Message" 
          value={formData.message}
          onChange={handleInputChange}
          required 
          disabled={status.type === 'loading'}
          className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-3 w-full md:w-4/5 h-32 resize-none focus:outline-none focus:border-[#818bd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit"
          disabled={status.type === 'loading'}
          className="flex justify-center items-center gap-2 w-48 h-12 text-white bg-[#482ebb] rounded-lg cursor-pointer hover:bg-opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#482ebb]"
        >
          {status.type === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </>
          )}
        </button>
      </form>
    </section>
  );
};