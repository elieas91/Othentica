import React, { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder = "Enter text...", height = "200px" }) => {
  const [QuillComponent, setQuillComponent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    import('react-quill').then((mod) => {
      if (isMounted) {
        setQuillComponent(() => mod.default);
      }
    }).catch(() => {
      // Swallow import errors to avoid breaking the page; caller can handle missing editor
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'align': [] }],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'align'
  ];

  if (!QuillComponent) {
    return (
      <div className="rich-text-editor" style={{ height }} />
    );
  }

  const ReactQuill = QuillComponent;

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: height }}
      />
    </div>
  );
};

export default RichTextEditor;
