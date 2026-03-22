import { X } from "lucide-react";

export default function Modal({ isOpen, title, description, children, footer, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-2xl rounded-[28px] p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[color:var(--text)]">{title}</h3>
            {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition hover:bg-slate-900/5 hover:text-[color:var(--text)] dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6">{children}</div>

        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

