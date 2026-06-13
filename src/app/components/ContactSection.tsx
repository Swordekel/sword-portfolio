import { useState } from "react";
import { motion } from "motion/react";
import { Send, Mail, MapPin, Clock, Github, Linkedin, Twitter, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@swordekel.dev", color: "var(--accent-primary)" },
  { icon: MapPin, label: "Location", value: "Jakarta, Indonesia", color: "var(--accent-secondary)" },
  { icon: Clock, label: "Availability", value: "Mon–Fri, 9AM–6PM WIB", color: "var(--accent-tertiary)" },
];

const socials = [
  { icon: Github, href: "#", label: "GitHub", color: "var(--text-primary)" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "var(--accent-secondary)" },
  { icon: Twitter, href: "#", label: "Twitter / X", color: "var(--accent-tertiary)" },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Form submitted:", data);
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all duration-200 text-[var(--text-primary)] placeholder-[var(--text-muted)]";
  const inputStyle = { borderColor: "rgba(var(--text-primary-rgb), 0.08)", background: "rgba(var(--text-primary-rgb), 0.02)", fontSize: "14px" };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(var(--accent-primary-rgb), 0.06) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-primary)" }}>
            Contact
          </span>
          <h2 className="text-foreground mt-3">Let's build something<br />remarkable together.</h2>
          <p className="mt-5 max-w-xl mx-auto" style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7 }}>
            Whether you have a project in mind, want to collaborate, or just say hi — my inbox is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-col gap-5 mb-12">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: "var(--bg-surface)", borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${info.color}12`, border: `1px solid ${info.color}25` }}
                  >
                    <info.icon className="w-4 h-4" style={{ color: info.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>{info.label}</div>
                    <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>Follow me on</div>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:bg-[var(--text-primary)]/5"
                    style={{ borderColor: "rgba(var(--text-primary-rgb), 0.08)", color: "var(--text-muted)", fontSize: "13px" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = s.color; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                  >
                    <s.icon className="w-4 h-4" />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div
              className="mt-12 p-6 rounded-2xl border"
              style={{ background: "linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.05), rgba(var(--accent-secondary-rgb), 0.05))", borderColor: "rgba(var(--accent-primary-rgb), 0.1)" }}
            >
              <div style={{ fontSize: "13px", color: "var(--accent-primary)", fontWeight: 600, marginBottom: "8px" }}>
                Currently Available
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                Open to freelance projects, full-time roles, and interesting collaborations. Response time: usually within 24 hours.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border p-12 text-center"
                style={{ background: "var(--bg-surface)", borderColor: "rgba(var(--accent-primary-rgb), 0.2)" }}
              >
                <CheckCircle className="w-14 h-14 mx-auto mb-5" style={{ color: "var(--accent-primary)" }} />
                <h3 className="text-foreground mb-3" style={{ fontWeight: 700 }}>Message Sent!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border p-8 flex flex-col gap-5"
                style={{ background: "var(--bg-surface)", borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px", fontWeight: 500 }}>
                      Your Name *
                    </label>
                    <input
                      {...register("name", { required: true })}
                      placeholder="Alex Johnson"
                      className={inputClass}
                      style={{
                        ...inputStyle,
                        borderColor: errors.name ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)",
                      }}
                      onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)50"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(var(--accent-primary-rgb), 0.08)"; }}
                      onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = errors.name ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px", fontWeight: 500 }}>
                      Email Address *
                    </label>
                    <input
                      {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                      placeholder="you@example.com"
                      type="email"
                      className={inputClass}
                      style={{
                        ...inputStyle,
                        borderColor: errors.email ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)",
                      }}
                      onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)50"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(var(--accent-primary-rgb), 0.08)"; }}
                      onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = errors.email ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px", fontWeight: 500 }}>
                    Subject *
                  </label>
                  <input
                    {...register("subject", { required: true })}
                    placeholder="Project Inquiry / Collaboration / Just saying hi"
                    className={inputClass}
                    style={{ ...inputStyle, borderColor: errors.subject ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)" }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)50"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(var(--accent-primary-rgb), 0.08)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = errors.subject ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "8px", fontWeight: 500 }}>
                    Message *
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    placeholder="Tell me about your project, timeline, and budget..."
                    rows={5}
                    className={`${inputClass} resize-none`}
                    style={{ ...inputStyle, borderColor: errors.message ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)" }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)50"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(var(--accent-primary-rgb), 0.08)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = errors.message ? "var(--destructive)" : "rgba(var(--text-primary-rgb), 0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-60"
                  style={{
                    background: "var(--accent-primary)",
                    color: "var(--accent-foreground)",
                    fontSize: "15px",
                    boxShadow: "0 0 0 rgba(var(--accent-primary-rgb), 0)",
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(var(--accent-primary-rgb), 0.35)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 rgba(var(--accent-primary-rgb), 0)"; }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
