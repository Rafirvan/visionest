import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { type Editor as TinyMCEEditor } from 'tinymce';



interface textEditorProps {
  formData: string;
  setFormData: (input: string) => void;
}


function TextEditor({ formData, setFormData }: textEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleEditorChange = (content: string) => {
    setFormData(content);
  }

  return (
    <>
      <Editor

        onInit={(evt, editor) => editorRef.current = editor}
        apiKey='if38s6jkec44dnzpo4kr297g8fa1qb6z4w1h2fnahy04mzoy'
        init={{
          height: 500,
          menubar: false,
          plugins: 'lists'
          ,
          toolbar: 'undo redo | ' +
            'bold italic underline | forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist | ' +
            'removeformat |',
          content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:14px }'
        }}
        value={formData}
        onEditorChange={handleEditorChange}
      />
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
}

export default TextEditor