import React, { useRef, useState } from 'react';
import { causes } from '../data/opportunities.js';
import { buttonClass, fieldClass, primaryClass } from './OpportunityUI.jsx';

const emptyForm = { title: '', cause: '', city: '', location: '', date: '', hours: '', capacity: '', description: '', requirements: '', status: 'Draft' };

export default function OpportunityForm({ opportunity, onSave, onCancel }) {
  const [values, setValues] = useState(opportunity || emptyForm);
  const [errors, setErrors] = useState({});
  const form = useRef(null);
  function submit(event) {
    event.preventDefault();
    const clean = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
    const nextErrors = {};
    for (const [key, label, minimum] of [['title', 'Title', 5], ['city', 'City', 2], ['location', 'Meeting point', 3], ['description', 'Description', 20], ['requirements', 'Volunteer guidance', 10]]) {
      if (clean[key].length < minimum) nextErrors[key] = `${label} must contain at least ${minimum} characters.`;
    }
    if (!causes.includes(clean.cause)) nextErrors.cause = 'Choose a cause.';
    if (!clean.date || !Number.isFinite(Date.parse(`${clean.date}T12:00:00`))) nextErrors.date = 'Choose a valid event date.';
    if (!Number.isFinite(Number(clean.hours)) || Number(clean.hours) < 0.5 || Number(clean.hours) > 24 || Number(clean.hours) % 0.5 !== 0) nextErrors.hours = 'Enter 0.5 to 24 hours, in half-hour steps.';
    if (!Number.isInteger(Number(clean.capacity)) || Number(clean.capacity) < 1 || Number(clean.capacity) > 500) nextErrors.capacity = 'Enter a whole number from 1 to 500.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.current.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    onSave({ ...clean, hours: Number(clean.hours), capacity: Number(clean.capacity) }, opportunity?.id);
  }
  function field(name, label, props = {}) {
    const { multiline, options, ...inputProps } = props;
    const common = { id: `op-${name}`, name, value: values[name], onChange: event => setValues(current => ({ ...current, [name]: event.target.value })), className: fieldClass, required: true, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `error-${name}` : undefined, ...inputProps };
    return <div className={multiline ? 'sm:col-span-2' : ''}><label htmlFor={common.id} className="text-sm font-bold">{label}</label>{options ? <select {...common}>{options.map(value => <option key={value} value={value}>{value || 'Choose a cause'}</option>)}</select> : multiline ? <textarea {...common} rows={3} /> : <input {...common} />}{errors[name] && <p id={`error-${name}`} className="mt-2 mb-0 text-sm font-semibold text-red-700 dark:text-red-300">{errors[name]}</p>}</div>;
  }
  return <form ref={form} onSubmit={submit} noValidate>
    <p className="text-sm text-(--muted)">All fields are required. Published roles appear in the opportunity list.</p>
    {Object.keys(errors).length > 0 && <p role="alert" className="rounded-lg border border-red-500 p-3 text-sm">Please correct the highlighted fields before saving.</p>}
    <fieldset className="m-0 grid min-w-0 gap-4 border-0 p-0 sm:grid-cols-2"><legend className="sr-only">Opportunity information</legend>
      {field('title', 'Opportunity title', { minLength: 5, maxLength: 100 })}
      {field('cause', 'Cause', { options: ['', ...causes] })}
      {field('city', 'City', { maxLength: 60 })}
      {field('location', 'Meeting point', { maxLength: 150 })}
      {field('date', 'Event date', { type: 'date' })}
      {field('hours', 'Hours per volunteer', { type: 'number', min: 0.5, max: 24, step: 0.5 })}
      {field('capacity', 'Volunteers needed', { type: 'number', min: 1, max: 500, step: 1 })}
      {field('status', 'Visibility', { options: ['Draft', 'Published', 'Closed'] })}
      {field('description', 'What volunteers will do', { multiline: true, minLength: 20, maxLength: 1000 })}
      {field('requirements', 'What volunteers should know or bring', { multiline: true, minLength: 10, maxLength: 1000 })}
    </fieldset>
    <div className="mt-6 flex flex-wrap gap-3"><button className={primaryClass} type="submit">{opportunity ? 'Save changes' : 'Create opportunity'}</button><button className={buttonClass} type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}
