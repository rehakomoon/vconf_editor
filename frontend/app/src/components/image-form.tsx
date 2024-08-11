export default function ImageForm({
  id,
  onChange,
}: {
  id: number;
  onChange?: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <>
      <label className="label" htmlFor={`img${id}`}>
        画像{id + 1}
      </label>
      <div>
        <input
          id={`img${id}`}
          type="file"
          accept="image/*,.png,.jpg,.jpeg,.gif"
          onChange={(e) => {
            if (onChange === undefined) return;
            onChange(id, e);
          }}
        />
      </div>
    </>
  );
}
