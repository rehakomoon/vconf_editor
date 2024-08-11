import {ChangeEventHandler} from "react";

export default function MultiLineTextForm({
  label,
  id,
  onChange,
}: {
  label: string;
  id: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}): JSX.Element {
  return (
    <>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div>
        <textarea id={id} name={label} rows={4} cols={50} onChange={onChange} />
      </div>
    </>
  );
}
