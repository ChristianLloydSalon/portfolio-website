import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, SendHorizontal } from 'lucide-react';
import { scrollToSection } from '@/animations/scroll';
import { openProject } from '@/sections/Projects/openProject';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { markRead, phoneStore } from '../phoneStore';
import { matchKeywords, script, type Action, type NodeId } from '../script';

/**
 * Scripted chat. Walks the `script` map: shows "typing…", then each text in turn, then
 * the node's links and reply chips. The thread lives at module level, so closing and
 * reopening the phone picks up where the visitor left off (until the page reloads).
 */

type Entry = { id: number; from: 'them' | 'me'; text: string } | { id: number; from: 'actions'; actions: Action[] };

let saved: { log: Entry[]; node: NodeId | null } = { log: [], node: null };
let nextId = 0;

export function MessagesApp({ onNavigate }: { onNavigate: () => void }) {
  const [log, setLog] = useState<Entry[]>(saved.log);
  const [node, setNode] = useState<NodeId | null>(saved.node);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const threadRef = useRef<HTMLOListElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    saved = { log, node };
  }, [log, node]);

  /** Christian "types" each line of a node, then offers its replies. */
  const run = (id: NodeId) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setNode(null);
    const n = script[id];
    const reduced = prefersReducedMotion();
    let at = reduced ? 150 : 350;
    n.says.forEach((text, i) => {
      timers.current.push(window.setTimeout(() => setTyping(true), at));
      at += reduced ? 250 : Math.min(450 + text.length * 14, 1400);
      timers.current.push(
        window.setTimeout(() => {
          setLog((l) => [...l, { id: nextId++, from: 'them', text }]);
          if (i < n.says.length - 1) setTyping(false);
        }, at),
      );
      at += 120;
    });
    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        if (n.actions?.length) setLog((l) => [...l, { id: nextId++, from: 'actions', actions: n.actions! }]);
        setNode(id);
      }, at),
    );
  };

  // First open: the first text arrives (and the unread badge clears). A conversation cut off
  // by closing the phone mid-reply carries on from the menu when it reopens.
  useEffect(() => {
    markRead();
    if (!saved.log.length) run('start');
    else if (!saved.node) setNode('menu');
    return () => timers.current.forEach(clearTimeout);
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [log, typing, node]);

  const say = (text: string, next: NodeId) => {
    setLog((l) => [...l, { id: nextId++, from: 'me', text }]);
    run(next);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    say(text, matchKeywords(text));
  };

  const doAction = (a: Action) => {
    if ('app' in a) phoneStore.set({ app: a.app });
    else if ('project' in a) {
      onNavigate();
      window.setTimeout(() => openProject(a.project), 450);
    } else if ('section' in a) {
      onNavigate();
      // Let the phone slide away and unlock scrolling first.
      window.setTimeout(() => scrollToSection(a.section), 450);
    }
  };

  const replies = node ? script[node].replies : [];

  return (
    <div className="msg">
      <ol ref={threadRef} className="msg__thread" aria-live="polite" aria-label="Conversation with Christian">
        <li className="msg__note">Today · replies are pre-written, not AI</li>
        {log.map((m) =>
          m.from === 'actions' ? (
            <li key={m.id} className="msg__actions">
              {m.actions.map((a) =>
                'href' in a ? (
                  <a key={a.label} className="msg__link" href={a.href} {...(a.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                    {a.label} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <button key={a.label} type="button" className="msg__link" onClick={() => doAction(a)}>
                    {a.label} <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                ),
              )}
            </li>
          ) : (
            <li key={m.id} className={`msg__bubble msg__bubble--${m.from}`}>
              <span className="sr-only">{m.from === 'me' ? 'You: ' : 'Christian: '}</span>
              {m.text}
            </li>
          ),
        )}
        {typing && (
          <li className="msg__bubble msg__bubble--them msg__typing" aria-label="Christian is typing">
            <span />
            <span />
            <span />
          </li>
        )}
      </ol>

      <div className="msg__compose">
        {replies.length > 0 && (
          <div className="msg__chips" role="group" aria-label="Quick replies">
            {replies.map((r) => (
              <button key={r.label} type="button" className="msg__chip" onClick={() => say(r.label, r.next)}>
                {r.label}
              </button>
            ))}
          </div>
        )}
        <form className="msg__form" onSubmit={send}>
          <label className="sr-only" htmlFor="phone-msg">
            Message
          </label>
          <input
            id="phone-msg"
            className="msg__input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Text Christian…"
            autoComplete="off"
            enterKeyHint="send"
            maxLength={200}
          />
          <button type="submit" className="msg__send" aria-label="Send" disabled={!draft.trim()}>
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
