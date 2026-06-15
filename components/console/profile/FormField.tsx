"use client";

import React from "react";

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

interface InputProps extends BaseProps, React.InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface SelectProps extends BaseProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  as: "select";
  options: { value: string; label: string }[];
}

interface TextareaProps extends BaseProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

type FormFieldProps = InputProps | SelectProps | TextareaProps;

export function FormField(props: FormFieldProps) {
  const { label, error, required, hint, as = "input", ...rest } = props;
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="form-field">
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      {hint && <p className="field-hint">{hint}</p>}

      {as === "select" ? (
        <select
          id={id}
          className={`field-input ${error ? "field-error" : ""}`}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          <option value="">Select {label}</option>
          {(props as SelectProps).options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          className={`field-input field-textarea ${error ? "field-error" : ""}`}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={`field-input ${error ? "field-error" : ""} ${
            (rest as InputProps).disabled ? "field-disabled" : ""
          }`}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="field-error-msg">{error}</p>}
    </div>
  );
}

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="form-section">
      <h3 className="section-title">{title}</h3>
      <div className="section-grid">{children}</div>
    </section>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="toggle-row">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`toggle ${checked ? "toggle-on" : ""} ${disabled ? "toggle-disabled" : ""}`}
      >
        <span className="toggle-thumb" />
      </button>
      <span className="toggle-label">{label}</span>
    </div>
  );
}