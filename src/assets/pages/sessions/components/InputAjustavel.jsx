import React, { useRef, useLayoutEffect, useState } from "react";

// Componente InputAjustavel
function InputAjustavel({ value, onChange, style = {}, ...props }) {
  const spanRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(20); // largura mínima

  useLayoutEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.scrollWidth + 5); // +5 para "folga"
    }
  }, [value]);

  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        style={{
          ...style,
          width: `${inputWidth}px`,
          minWidth: "20px",
          transition: "width .1s",
        }}
        {...props}
      />
      {/* O ESPAN é invisível, serve só para medir o tamanho do texto */}
      <span
        ref={spanRef}
        style={{
          // estilos iguais ao input para medir corretamente:
          visibility: "hidden",
          position: "absolute",
          left: 0,
          top: 0,
          whiteSpace: "pre",
          fontFamily: style.fontFamily || "inherit",
          fontSize: style.fontSize || "inherit",
          fontWeight: style.fontWeight || "inherit",
          padding: style.padding || "2px 5px"
        }}
        aria-hidden="true"
      >
        {value || props.placeholder || ""}
      </span>
    </span>
  );
}

export default InputAjustavel;