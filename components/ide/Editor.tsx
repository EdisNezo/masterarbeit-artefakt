"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useIdeStore } from "@/lib/store";
import { useRef, useEffect } from "react";
// We'll import constrained-editor-plugin dynamically or assume it's available if we want to use it.
// For now, let's just get Monaco working.
// import constrainedEditor from "constrained-editor-plugin";

export function CodeEditor() {
  const { activeFile, files, updateFile } = useIdeStore();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const content = files[activeFile] || "";

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Example of how we would use constrained editor later:
    // const constrainedInstance = constrainedEditor(monaco);
    // constrainedInstance.initializeIn(editor);
    // constrainedInstance.addRestrictionsTo(currentModel, [{ range: ... }]);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFile(activeFile, value);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e]">
      <div className="flex items-center bg-[#2d2d2d] px-4 py-2 text-xs border-b border-[#3e3e3e] text-gray-300">
        <span className="opacity-80">{activeFile}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>
    </div>
  );
}
