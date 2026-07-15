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
          role="status"
          aria-live="polite"
          className={`mt-2 p-3 sm:p-4 rounded-lg text-center w-full text-sm ${
            compact ? "max-w-none" : "max-w-3xl"
          } ${
            status.type === "success"
              ? "bg-emerald-950/50 border border-emerald-500/60 text-emerald-200"
              : status.type === "error"
                ? "bg-red-950/50 border border-red-500/60 text-red-200"
                : "bg-sky-950/50 border border-sky-500/60 text-sky-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`mt-4 sm:mt-5 flex flex-col items-stretch w-full gap-4 ${
          compact ? "max-w-none" : "max-w-3xl"
        }`}
      >
        <div className={rowClass}>
          <div className="cube-form-field">
            <label htmlFor="contact-name" className="cube-form-label cube-ui-mono">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={status.type === "loading"}
              className="cube-form-input"
            />
          </div>
          <div className="cube-form-field">
            <label htmlFor="contact-email" className="cube-form-label cube-ui-mono">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={status.type === "loading"}
              className="cube-form-input"
            />
          </div>
        </div>

        <div className={`cube-form-field ${fieldClass}`}>
          <label htmlFor="contact-subject" className="cube-form-label cube-ui-mono">
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            disabled={status.type === "loading"}
            className="cube-form-input"
          />
        </div>

        <div className={`cube-form-field ${fieldClass}`}>
          <label htmlFor="contact-message" className="cube-form-label cube-ui-mono">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            required
            disabled={status.type === "loading"}
            rows={5}
            className="cube-form-input resize-y min-h-32"
          />
        </div>

        <button
          type="submit"
          disabled={status.type === "loading"}
          className="cube-form-submit self-center sm:self-start"
        >
          {status.type === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
