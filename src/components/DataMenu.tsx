import { useRef } from 'react';

interface DataMenuProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

/** "Your data" menu: backup, restore and start over. Uses <details> so it works with the keyboard for free. */
const DataMenu = ({ onExport, onImport, onReset }: DataMenuProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const close = () => detailsRef.current?.removeAttribute('open');

  return (
    <details className="data-menu" ref={detailsRef}>
      <summary>Your data</summary>
      <div className="data-menu-panel">
        <p className="data-menu-note">
          Your CV is saved in this browser only. Download a backup to move it to another device.
        </p>
        <button
          type="button"
          onClick={() => {
            onExport();
            close();
          }}
        >
          Download backup (.json)
        </button>
        <button type="button" onClick={() => fileRef.current?.click()}>
          Restore from backup…
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => {
            onReset();
            close();
          }}
        >
          Start a new CV
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = '';
            close();
          }}
        />
      </div>
    </details>
  );
};

export default DataMenu;
