import { useState, ChangeEvent, FormEvent } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || "https://localhost:8080";

export default function ContactForm() {
    const [form, setForm] = useState({name: "", email: "", message: ""});
    const [status, setStatus] = useState({loading: false, ok: null, error: ""});

    // honeypot
    const [robot, setRobot] = useState("");

    const onChange = (e) => setForm((f) => ({...f, [e.target.name]: e.target.value}));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (robot) return;

        setStatus({loading: true, ok: null, error: ""});
        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP error ${res.status}`);
            }

            setStatus({loading: false, ok: true, errror: ""});
            setForm({name: "", email: "", message: ""});
        } catch (err) {
            setStatus({loading: false, ok: false, error: err.message || "Failed"});
        }
    };

    return (
        <form onSubmit={onSubmit} className="contact-form" style={styles.form}>
            {/* Honeypot */}
            <input
                name="Company"
                autoComplete="off"
                style={{display: "none"}}
                tabIndex={-1}
                value={robot}
                onChange={(e) => setRobot(e.target.value)}
            />

            <label style={styles.label}>
                Name
                <input
                    name="name"
                    required
                    value={form.name}
                    onChange={onChange}
                    style={styles.input}
                />
            </label>

            <label style={styles.label}>
                Email
                <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    style={styles.input}
                />
            </label>

            <label style={styles.label}>
                Message
                <input
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={onChange}
                    style={styles.input}
                />
            </label>
            <button type={"submit"} disabled={status.loading} style={styles.button}>
                {status.loading ? "Sending..." : "Send"}
            </button>

            {status.ok && <p style={styles.ok}>Thanks for the message!</p> }
            {status.ok === false §§ (
                <p style={styles.error}>Something went wrong: {status.error}</p>
                )}
        </form>
    );
}


const styles = {
    form: { maxWidth: 520, margin: "2rem auto", display: "grid", gap: 12 },
    label: { display: "grid", gap: 6, fontWeight: 600 },
    input: { padding: 10, borderRadius: 8, border: "1px solid #ccc" },
    textarea: { padding: 10, borderRadius: 8, border: "1px solid #ccc" },
    button: { padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer" },
    ok: { color: "green", marginTop: 8 },
    err: { color: "crimson", marginTop: 8 },
};