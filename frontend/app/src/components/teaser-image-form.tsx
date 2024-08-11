import {ChangeEventHandler} from "react";

export default function TeaserImageForm({
  onChange,
}: {
  onChange?: ChangeEventHandler<HTMLInputElement>;
}): JSX.Element {
  return (
    <>
      <label className="label" htmlFor="teaser">
        ティザー画像
      </label>
      <div>
        <input
          id="teaser"
          type="file"
          accept="image/*,.png,.jpg,.jpeg,.gif"
          onChange={onChange}
        />
      </div>
    </>
  );
}
