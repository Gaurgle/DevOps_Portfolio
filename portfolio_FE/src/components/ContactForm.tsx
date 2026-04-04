import {useState} from "react";
import type {ChangeEvent, FormEvent} from "react";

const API_BASE = import.meta.env.PUBLIC_API_BASE ?? "http://localhost:8080";

export default function ContactForm() {
    const [form, setForm] = useState({name: "", email: "", message: ""});
    const [status, setStatus] = useState<{loading: boolean; ok: boolean | null; error: string}>({
        loading: false, ok: null, error: ""
    });
    const [robot, setRobot] = useState("");

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({...f, [e.target.name]: e.target.value}));

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (robot) return;
        setStatus({loading: true, ok: null, error: ""});
        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP error ${res.status}`);
            }
            setStatus({loading: false, ok: true, error: ""});
            setForm({name: "", email: "", message: ""});
        } catch (err: any) {
            const msg = err.message === "Failed to fetch"
                ? "backend offline — try larsnilsandreas@pm.me instead"
                : err.message || "something went wrong";
            setStatus({loading: false, ok: false, error: msg});
        }
    };

    const inputClass = `w-full px-3 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white text-sm
        placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600
        transition-colors duration-200`;

    return (
        <div className="max-w-xl mx-auto">
            <p className="font-mono text-sm text-zinc-300 mb-4">
                <span className="text-ctp-peach">$</span> mail -s &quot;hello&quot; andreas
            </p>
            <p className="font-mono text-xs text-zinc-400 mb-6">
                or reach me at{' '}
                <a href="mailto:larsnilsandreas@pm.me" className="text-zinc-300 hover:text-white transition-colors">
                    larsnilsandreas@pm.me
                </a>
            </p>

            <div className="terminal-card">
                <div className="terminal-bar">
                    <span className="terminal-dot bg-ctp-red/80"></span>
                    <span className="terminal-dot bg-ctp-yellow/80"></span>
                    <span className="terminal-dot bg-ctp-green/80"></span>
                    <span className="font-mono text-xs text-zinc-300 ml-2">compose</span>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    <input
                        name="company"
                        autoComplete="off"
                        className="hidden"
                        tabIndex={-1}
                        value={robot}
                        onChange={(e) => setRobot(e.target.value)}
                    />

                    <label className="block">
                        <span className="font-mono text-xs text-zinc-300 mb-1.5 block">
                            <span className="text-ctp-peach/60">$</span> name
                        </span>
                        <input
                            name="name"
                            required
                            value={form.name}
                            onChange={onChange}
                            className={inputClass}
                            placeholder="Your name"
                        />
                    </label>

                    <label className="block">
                        <span className="font-mono text-xs text-zinc-300 mb-1.5 block">
                            <span className="text-ctp-peach/60">$</span> email
                        </span>
                        <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={onChange}
                            className={inputClass}
                            placeholder="your@email.com"
                        />
                    </label>

                    <label className="block">
                        <span className="font-mono text-xs text-zinc-300 mb-1.5 block">
                            <span className="text-ctp-peach/60">$</span> message
                        </span>
                        <textarea
                            name="message"
                            required
                            rows={5}
                            value={form.message}
                            onChange={onChange}
                            className={`${inputClass} resize-none`}
                            placeholder="What's on your mind?"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full py-2.5 px-4 rounded-lg bg-white/[0.03] border border-zinc-800 text-sm font-mono text-white
                                   hover:bg-white/[0.08] hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-300"
                    >
                        {status.loading ? "> sending..." : "> send"}
                    </button>

                    {status.ok && (
                        <p className="font-mono text-sm text-ctp-green">
                            &#10003; message sent successfully
                        </p>
                    )}
                    {status.ok === false && (
                        <p className="font-mono text-sm text-ctp-red">
                            &#10007; {status.error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
