
export function SelectableImageButton({ selected, onClick, src }: { selected: any, onClick: any, src: any }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? "2px solid #008060" : "1px solid #dfe3e8",
        borderRadius: "6px",
        padding: "4px",
        cursor: "pointer",
        transition: "0.15s",
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <img
        src={src}
        alt="option"
        style={{
          width: 90,
          height: 80,
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
