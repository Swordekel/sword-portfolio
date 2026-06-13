import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { Send, Mail, MapPin, Clock, Github, Linkedin, Twitter, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honey?: string;
};

function WhatsAppIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const RECIPIENT_EMAIL = "swordekel@gmail.com";

const contactInfo: Array<{
  icon: typeof Mail | typeof WhatsAppIcon;
  label: string;
  value: string;
  color: string;
  href?: string;
}> = [
  { icon: Mail, label: "Email", value: RECIPIENT_EMAIL, color: "var(--accent-primary)", href: `mailto:${RECIPIENT_EMAIL}` },
  { icon: WhatsAppIcon, label: "WhatsApp", value: "+62 811-1688-303", color: "var(--accent-success)", href: "https://wa.me/628111688303?text=Halo%20Sword%2C%20saya%20tertarik%20untuk%20kolaborasi%20dari%20portfolio%20Anda." },
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data._honey) return;
    setSubmitError(null);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          _subject: `Portfolio inquiry: ${data.subject}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || (json && json.success !== "true" && json.success !== true)) {
        throw new Error(json?.message || `Request failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Gagal mengirim pesan. Coba lagi atau hubungi via WhatsApp.");
    }
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
              {contactInfo.map((info) => {
                const inner = (
                  <>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${info.color}12`, border: `1px solid ${info.color}25` }}
                    >
                      <info.icon className="w-4 h-4" style={{ color: info.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>{info.label}</div>
                      <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }} className="truncate">{info.value}</div>
                    </div>
                  </>
                );

                const baseClass = "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200";
                const baseStyle = {
                  background: "var(--bg-surface)",
                  borderColor: "rgba(var(--text-primary-rgb), 0.06)",
                };

                if (info.href) {
                  const isExternal = info.href.startsWith("http");
                  return (
                    <a
                      key={info.label}
                      href={info.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={`${baseClass} group cursor-pointer`}
                      style={baseStyle}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = `${info.color}40`;
                        el.style.boxShadow = `0 0 24px ${info.color}15`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "rgba(var(--text-primary-rgb), 0.06)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      {inner}
                    </a>
                  );
                }

                return (
                  <div key={info.label} className={baseClass} style={baseStyle}>
                    {inner}
                  </div>
                );
              })}
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
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  {...register("_honey")}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />

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

                {submitError && (
                  <div
                    className="rounded-lg border px-4 py-3"
                    style={{
                      background: "rgba(220, 38, 38, 0.08)",
                      borderColor: "rgba(220, 38, 38, 0.25)",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {submitError}{" "}
                    <a
                      href="https://wa.me/628111688303?text=Halo%20Sword%2C%20saya%20ingin%20menghubungi%20Anda%20dari%20portfolio."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent-success)", fontWeight: 600, textDecoration: "underline" }}
                    >
                      Chat via WhatsApp
                    </a>
                  </div>
                )}

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
