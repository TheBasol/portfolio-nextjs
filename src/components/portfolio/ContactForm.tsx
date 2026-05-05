'use client';

import { useContactEngine } from "@/hooks/useContactEngine";

interface ContactFormProps {
  compact?: boolean;
  className?: string;
}

export const ContactForm = ({ compact = false, className = "" }: ContactFormProps) => {
  const { formData, status, handleInputChange, handleSubmit } = useContactEngine();

  const rowClass = compact
    ? "flex flex-col w-full gap-4"
    : "flex flex-col md:flex-row w-full md:w-4/5 gap-5";
  const fieldClass = compact ? "w-full" : "w-full md:w-4/5";

  return (
    <div className={className}>
      {status.message && (
        <div
          className={`mt-4 p-4 rounded-lg text-center w-full ${
            compact ? "max-w-none" : "max-w-3xl"
          } ${
            status.type === "success"
              ? "bg-green-900/50 border border-green-500 text-green-300"
              : status.type === "error"
              ? "bg-red-900/50 border border-red-500 text-red-300"
              : "bg-blue-900/50 border border-blue-500 text-blue-300"
          }`}
        >
          {status.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`mt-6 flex flex-col items-center justify-center w-full gap-5 ${
          compact ? "max-w-none" : "max-w-3xl"
        }`}
      >
        <div className={rowClass}>
          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={status.type === "loading"}
            className="bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-3 w-full focus:outline-none focus:border-[#818bd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="email"
            placeholder="Your Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={status.type === "loading"}
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
          disabled={status.type === "loading"}
          className={`bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-3 ${
            fieldClass
          } focus:outline-none focus:border-[#818bd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleInputChange}
          required
          disabled={status.type === "loading"}
          className={`bg-[#2E324F] rounded-md border-2 border-[#AAB2FF] text-gray-300 p-3 ${
            fieldClass
          } h-32 resize-none focus:outline-none focus:border-[#818bd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="flex justify-center items-center gap-2 w-48 h-12 text-white bg-[#482ebb] rounded-lg cursor-pointer hover:bg-opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#482ebb]"
        >
          {status.type === "loading" ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
