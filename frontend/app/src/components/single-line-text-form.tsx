import {ChangeEventHandler} from "react";

export default function SingleLineTextForm({
  label,
  id,
  onChange,
}: {
  label: string;
  id: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}): JSX.Element {
  return (
    <>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div>
        <input id={id} type="text" required onChange={onChange} />
      </div>
    </>
  );
}
