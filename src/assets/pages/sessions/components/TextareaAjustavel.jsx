import React, { useRef, useEffect } from "react";

function TextareaAjustavel({ value, onChange, style = {}, ...props }) {
  const textareaRef = useRef(null);

  function handleInput(e) {
    // Ajusta a altura automaticamente:
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
    onChange && onChange(e);
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onInput={handleInput} // Usar onInput para uma resposta mais fluida
      style={{
        ...style,
        overflow: "hidden",
        minHeight: "20px",
        resize: "none", // Se quiser impedir o resize manual pelo usuário
        transition: "height 0.13s",
      }}
      {...props}
    />
  );
}

export default TextareaAjustavel;
