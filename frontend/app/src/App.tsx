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
  const [image3, setImage3] = useState<File | undefined>(undefined);
  const [image4, setImage4] = useState<File | undefined>(undefined);
  const [image5, setImage5] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [section1, setSection1] = useState("");
  const [section2, setSection2] = useState("");
  const [section3, setSection3] = useState("");
  const [section4, setSection4] = useState("");
  const [section5, setSection5] = useState("");

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
  const getImage3: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    setImage3(img);
  };
  const getImage4: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    setImage4(img);
  };
  const getImage5: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    setImage5(img);
  };

  const Submit = async () => {
    const formdata = new FormData();
    const json = `{
      "title" : "バーチャル学会2023",
      "author": "はこつき (Twitter: @rehakomoon)*, Lcamu (Twitter: @ogtonvr180426)",
      "abstract": "hogehoge",
      "body": [
      {
          "title": "section1",
          "text": "このセクション1では...."
      },
      {
          "title": "section2",
          "text": "このセクション2では...."
      }
      ],
      "figure": [
              {
                  "section_index": 1,
                  "caption": "fig caption 1",
                  "position": "top"
              },
              {
                  "section_index": 1,
                  "caption": "fig caption 2",
                  "position": "bottom"
              },
              {
                  "section_index": 2,
                  "caption": "fig caption 3",
                  "position": "here"
              },
              {
                  "section_index": 2,
                  "caption": "fig caption 4"
              }
      ]
  }`
    formdata.append("data", json.toString());

    if (image1 !== undefined) {
      formdata.append("file1", image1);
    }
    if (image2 !== undefined) {
      formdata.append("file2", image2);
    }
    if (image3 !== undefined) {
      formdata.append("file3", image3);
    }
    if (image4 !== undefined) {
      formdata.append("file4", image4);
    }
    if (image5 !== undefined) {
      formdata.append("file5", image5);
    }

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
        <TextFormSection
          label="セクション3"
          id="section3"
          onChange={(e) => {
            setSection3(e.target.value);
          }}
        />
        <ImageFormSection 
          label="画像3"
          id="img3"
          onChange={getImage3}
        />
        <TextFormSection
          label="セクション4"
          id="section4"
          onChange={(e) => {
            setSection4(e.target.value);
          }}
        />
        <ImageFormSection 
          label="画像4"
          id="img4"
          onChange={getImage4}
        />
        <TextFormSection
          label="セクション5"
          id="section5"
          onChange={(e) => {
            setSection5(e.target.value);
          }}
        />
        <ImageFormSection 
          label="画像5"
          id="img5"
          onChange={getImage5}
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
