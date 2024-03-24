import { useState,
  ChangeEventHandler,
  FormEventHandler, } from 'react'

function TextFormSection({
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

function ImageFormSection({
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
        <input
          id={id}
          type="file"
          accept="image/*,.png,.jpg,.jpeg,.gif"
          onChange={onChange}
        />
      </div>
    </>
  );
}

function App() {
  const [image1, setImage1] = useState<File | undefined>(undefined);
  const [image2, setImage2] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [section1, setSection1] = useState("");
  const [section2, setSection2] = useState("");

  const getImage1: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    setImage1(img);
  };
  const getImage2: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    setImage2(img);
  };

  const Submit = async () => {
    const formdata = new FormData();
    if (image1 !== undefined) {
      formdata.append("files", image1);
    }
    if (image2 !== undefined) {
      formdata.append("files", image2);
    }

    formdata.append("title", title);
    formdata.append("section1", section1);
    formdata.append("section2", section2);
    const requestOptions = {
      method: "POST",
      body: formdata,
    };
    await fetch("http://localhost:8000/typeset", requestOptions);
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    Submit();
  };

  return (
    <div>
      <form className="box" onSubmit={handleSubmit}>
        <TextFormSection
          label="タイトル"
          id="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <br />
        <TextFormSection
          label="セクション1"
          id="section1"
          onChange={(e) => {
            setSection1(e.target.value);
          }}
        />
        <ImageFormSection 
          label="画像1"
          id="img1"
          onChange={getImage1}
        />
        <br />
        <TextFormSection
          label="セクション2"
          id="section2"
          onChange={(e) => {
            setSection2(e.target.value);
          }}
        />
        <ImageFormSection 
          label="画像2"
          id="img2"
          onChange={getImage2}
        />
        <br />
        <button className="button is-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App
