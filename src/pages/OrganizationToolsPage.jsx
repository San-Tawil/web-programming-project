import React, { useEffect, useRef, useState } from 'react';
import { useOpportunities } from '../context/OpportunitiesContext.jsx';
import { isClosed } from '../data/dashboardDemo.js';
import { formatDate } from '../data/opportunities.js';
import OrganizationOpportunityForm from '../components/OrganizationOpportunityForm.jsx';
import { WorkspacePage, StatusBadge, buttonClass, primaryClass, fieldClass } from '../components/OpportunityUI.jsx';

export default function OrganizationToolsPage() {
  const { opportunities, organization, saveOpportunity, removeOpportunity } = useOpportunities();
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [status, setStatus] = useState('All');
  const [message, setMessage] = useState('');
  const heading = useRef(null);
  const addButton = useRef(null);
  const deleteDialog = useRef(null);
  const mine = opportunities.filter(item => item.organizationId === organization.id).map(item => ({ ...item, status: item.displayStatus }));
  const visible = mine.filter(item => status === 'All' || item.status === status);
  useEffect(() => { document.title = 'Organization tools | AidConnect'; }, []);
  useEffect(() => { if (editor) heading.current?.focus(); }, [editor]);
  useEffect(() => { if (pendingDelete) deleteDialog.current?.showModal(); }, [pendingDelete]);
  function closeEditor() { setEditor(null); addButton.current?.focus(); }
  function save(values, id) {
    saveOpportunity(values, id);
    setMessage(`“${values.title}” ${id ? 'updated' : 'created'} as ${values.status.toLowerCase()}.`);
    setStatus('All');
    closeEditor();
  }
  function cancelDelete() { deleteDialog.current?.close(); setPendingDelete(null); }
  function confirmDelete() {
    removeOpportunity(pendingDelete.id);
    setMessage(`“${pendingDelete.title}” deleted from demo data.`);
    if (editor?.id === pendingDelete.id) setEditor(null);
    cancelDelete();
    addButton.current?.focus();
  }
  return <WorkspacePage>
    <header className="mb-8 flex flex-wrap items-end justify-between gap-5"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-(--primary)">{organization.name} · Demo workspace</p><h1>Organization tools</h1><p className="mb-0 text-lg text-(--muted)">Bring people together. Create a role, share the details, and manage your opportunities in one place.</p></div><button ref={addButton} className={primaryClass} onClick={() => setEditor({})}>+ New opportunity</button></header>
    <p className="rounded-lg border border-(--line) px-4 py-3 text-sm text-(--muted)">Practice workspace with sample organizations. Changes are shared across these pages and reset when you refresh.</p>
    <dl className="my-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{['All', 'Published', 'Draft', 'Closed'].map(value => <div key={value} className="rounded-xl border border-(--line) bg-(--panel) p-5"><dt className="text-sm text-(--muted)">{value === 'All' ? 'Total opportunities' : value}</dt><dd className="m-0 mt-2 text-3xl font-bold">{value === 'All' ? mine.length : mine.filter(item => item.status === value).length}</dd></div>)}</dl>
    <p role="status" className="min-h-6 text-sm font-semibold">{message}</p>
    {editor && <section aria-labelledby="editor-title" className="mb-8 rounded-2xl border border-(--primary) bg-(--panel) p-5 sm:p-8"><h2 id="editor-title" ref={heading} tabIndex={-1}>{editor.id ? 'Edit opportunity' : 'Create an opportunity'}</h2><OrganizationOpportunityForm key={editor.id || 'new'} opportunity={editor.id ? editor : undefined} onSave={save} onCancel={closeEditor} /></section>}
    <section aria-labelledby="manage-title"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="manage-title" className="mb-0">Your opportunities</h2><label className="text-sm font-bold">Filter by status<select aria-label="Filter by status" className={fieldClass} value={status} onChange={event => setStatus(event.target.value)}>{['All', 'Published', 'Draft', 'Closed'].map(value => <option key={value}>{value}</option>)}</select></label></div>
      {visible.length ? <ul className="m-0 grid list-none gap-4 p-0">{visible.map(item => <li key={item.id}><article className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-(--line) bg-(--aid-surface) p-5"><div className="min-w-0 flex-1 basis-64"><div className="mb-3 flex flex-wrap items-center gap-3"><StatusBadge status={item.status} /><span className="text-sm text-(--muted)">{item.cause}</span></div><h3 className="break-words">{item.title}</h3><p className="mb-0 text-sm text-(--muted)">{item.city || item.location} · <time dateTime={item.date}>{item.date ? formatDate(item.date) : 'Flexible schedule'}</time> · {item.capacity} volunteers</p></div><div className="flex flex-wrap gap-2"><button className={buttonClass} disabled={isClosed({ ...item, status: 'Published' })} aria-label={`Edit ${item.title}`} onClick={() => setEditor(item)}>Edit</button><button className={buttonClass} disabled={isClosed({ ...item, status: 'Published' })} aria-label={`${item.status === 'Published' ? 'Close' : 'Publish'} ${item.title}`} onClick={() => { const nextStatus = item.status === 'Published' ? 'Closed' : 'Published'; saveOpportunity({ status: nextStatus }, item.id); if (editor?.id === item.id) setEditor(null); setMessage(`“${item.title}” is now ${nextStatus.toLowerCase()}.`); }}>{item.status === 'Published' ? 'Close role' : 'Publish'}</button><button className={`${buttonClass} text-red-700! dark:text-red-300!`} aria-label={`Delete ${item.title}`} onClick={() => setPendingDelete(item)}>Delete</button></div></article></li>)}</ul> : <div className="rounded-xl border border-dashed border-(--line) p-8 text-center"><h3>No {status === 'All' ? '' : status.toLowerCase()} opportunities yet</h3><p className="mb-0 text-(--muted)">Create a new opportunity or choose another status.</p></div>}
    </section>
    <dialog ref={deleteDialog} onCancel={cancelDelete} aria-labelledby="delete-title" aria-describedby="delete-description" className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-(--line) bg-(--panel) p-6 text-(--text) backdrop:bg-black/60"><h2 id="delete-title">Delete opportunity?</h2><p id="delete-description">Remove “{pendingDelete?.title}” from this demo? Related shifts and reservations will also be removed. This cannot be undone during this session.</p><div className="flex flex-wrap gap-3"><button autoFocus className={buttonClass} onClick={cancelDelete}>Keep opportunity</button><button className={`${buttonClass} bg-red-700! text-white!`} onClick={confirmDelete}>Delete opportunity</button></div></dialog>
  </WorkspacePage>;
}
