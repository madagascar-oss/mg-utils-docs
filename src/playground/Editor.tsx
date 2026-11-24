// CodeMirror 6 editor: language and theme can change without losing the text or cursor.
import { javascript } from '@codemirror/lang-javascript';
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';
import type { LanguageId } from './types.ts';

interface Props {
  readonly value: string;
  readonly language: LanguageId;
  readonly dark: boolean;
  readonly onChange: (value: string) => void;
  readonly onRun: () => void;
}

const typescript = javascript({ typescript: true });

/** The PHP grammar (with embedded HTML, CSS and JS) is large, so it loads only when needed. */
async function languageOf(language: LanguageId): Promise<Extension> {
  if (language !== 'php') return typescript;
  const { php } = await import('@codemirror/lang-php');
  return php({ plain: false });
}

const lightTheme = EditorView.theme({
  '&': { backgroundColor: 'transparent' },
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none' },
});

export default function Editor({ value, language, dark, onChange, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const languageSlot = useRef(new Compartment());
  const themeSlot = useRef(new Compartment());
  const callbacks = useRef({ onChange, onRun });
  callbacks.current = { onChange, onRun };

  useEffect(() => {
    if (host.current === null) return undefined;
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                callbacks.current.onRun();
                return true;
              },
            },
          ]),
          basicSetup,
          EditorView.lineWrapping,
          languageSlot.current.of(language === 'php' ? [] : typescript),
          themeSlot.current.of(dark ? oneDark : lightTheme),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) callbacks.current.onChange(update.state.doc.toString());
          }),
          EditorView.contentAttributes.of({ 'aria-label': 'Code editor' }),
        ],
      }),
    });
    view.current = editor;
    return () => {
      editor.destroy();
    };
    // The editor is created once; later changes go through the effects below.
  }, []);

  useEffect(() => {
    const editor = view.current;
    if (editor === null || editor.state.doc.toString() === value) return;
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
  }, [value]);

  useEffect(() => {
    let current = true;
    void languageOf(language).then((extension) => {
      if (current) view.current?.dispatch({ effects: languageSlot.current.reconfigure(extension) });
    });
    return () => {
      current = false;
    };
  }, [language]);

  useEffect(() => {
    view.current?.dispatch({ effects: themeSlot.current.reconfigure(dark ? oneDark : lightTheme) });
  }, [dark]);

  return (
    <div
      ref={host}
      className="h-full overflow-auto text-sm [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono"
    />
  );
}
