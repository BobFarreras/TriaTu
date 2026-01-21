'use client';

import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';

export default function SentryTestPage() {
  const [status, setStatus] = useState({
    clientMessage: { state: 'idle', eventId: '' },
    clientError: { state: 'idle', eventId: '' },
    serverMessage: { state: 'idle', eventId: '' },
    serverError: { state: 'idle', eventId: '' }
  });

  const sendClientError = () => {
    const eventId = Sentry.captureException(new Error('Sentry client test'));
    setStatus((prev) => ({ ...prev, clientError: { state: 'sent', eventId: eventId || '' } }));
  };

  const sendClientMessage = () => {
    const eventId = Sentry.captureMessage('Sentry client test');
    setStatus((prev) => ({ ...prev, clientMessage: { state: 'sent', eventId: eventId || '' } }));
  };

  const sendServerError = async () => {
    try {
      const response = await fetch('/api/sentry-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'error' })
      });
      const data = await response.json().catch(() => ({}));
      setStatus((prev) => ({
        ...prev,
        serverError: { state: response.ok ? 'ok' : 'fail', eventId: data?.eventId || '' }
      }));
    } catch {
      setStatus((prev) => ({ ...prev, serverError: { state: 'fail', eventId: '' } }));
    }
  };

  const sendServerMessage = async () => {
    try {
      const response = await fetch('/api/sentry-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'message' })
      });
      const data = await response.json().catch(() => ({}));
      setStatus((prev) => ({
        ...prev,
        serverMessage: { state: response.ok ? 'ok' : 'fail', eventId: data?.eventId || '' }
      }));
    } catch {
      setStatus((prev) => ({ ...prev, serverMessage: { state: 'fail', eventId: '' } }));
    }
  };

  const sendAllTests = async () => {
    sendClientMessage();
    sendClientError();
    await sendServerMessage();
    await sendServerError();
  };

  return (
    <main className="min-h-dvh w-full flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="w-full max-w-md space-y-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-lg font-bold">Sentry Tests</h1>
        <p className="text-sm text-slate-400">
          Proves de client i servidor. Cal `SENTRY_TEST_ENABLED=true` per a server.
        </p>
        <div className="text-xs text-slate-400 space-y-1">
          <div>Client message: {status.clientMessage.state} {status.clientMessage.eventId && `(id: ${status.clientMessage.eventId})`}</div>
          <div>Client error: {status.clientError.state} {status.clientError.eventId && `(id: ${status.clientError.eventId})`}</div>
          <div>Server message: {status.serverMessage.state} {status.serverMessage.eventId && `(id: ${status.serverMessage.eventId})`}</div>
          <div>Server error: {status.serverError.state} {status.serverError.eventId && `(id: ${status.serverError.eventId})`}</div>
        </div>
        <div className="grid gap-3">
          <button
            type="button"
            onClick={sendClientError}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 font-semibold"
          >
            Client: Error
          </button>
          <button
            type="button"
            onClick={sendClientMessage}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-semibold"
          >
            Client: Message
          </button>
          <button
            type="button"
            onClick={sendServerError}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold"
          >
            Server: Error
          </button>
          <button
            type="button"
            onClick={sendServerMessage}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold"
          >
            Server: Message
          </button>
          <button
            type="button"
            onClick={sendAllTests}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold"
          >
            Prova-ho tot
          </button>
        </div>
      </div>
    </main>
  );
}
