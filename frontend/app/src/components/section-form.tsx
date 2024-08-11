import { ChangeEventHandler } from "react";
import SingleLineTextForm from "./single-line-text-form";

export default function SectionForm({
  label,
  id,
  onChange
}: {
  label: string;
  id: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}): JSX.Element {
  return (
    <>
      <SingleLineTextForm id={id} label={label} onChange={onChange} />
    </>
  )
}
