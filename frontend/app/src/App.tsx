import React, { useState, ChangeEventHandler, FormEventHandler } from "react";

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

function MultiTextFormSection({
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
  const [images, setImages] = useState<(File | undefined)[]>([]);
  const [teaser, setTeaser] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [abstract, setAbstract] = useState("");
  const [section1, setSection1] = useState("");
  const [section2, setSection2] = useState("");
  const [section3, setSection3] = useState("");
  const [section4, setSection4] = useState("");
  const [section5, setSection5] = useState("");
  const [reference, setReference] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const onChangeImages = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const img = e.target.files[0];
    const newImages = Array(Math.max(index + 1, images.length)).fill(undefined);

    images.forEach((v: File | undefined, i: number) => {
      newImages[i] = v;
    });
    newImages[index] = img;
    setImages(newImages);
  };

  const getTeaser: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    setTeaser(img);
  };

  const Submit = async () => {
    const formdata = new FormData();
    const references: PdfCreateRequestRefarence[] = reference
      .split("\n")
      .map((ref) => {
        return { value: ref };
      });
    const json: PdfCreateRequest = {
      title: title,
      author: author,
      abstract: abstract,
      body: [
        {
          title: "section1",
          text: "このセクション1では....",
        },
        {
          title: "section2",
          text: "このセクション2では....",
        },
      ],
      teaser: {
        caption: "teaser キャプション",
      },
      figure: [
        {
          section_index: 1,
          caption: "fig caption 1",
          position: "top",
        },
        {
          section_index: 1,
          caption: "fig caption 2",
          position: "bottom",
        },
        {
          section_index: 2,
          caption: "fig caption 3",
          position: "here",
        },
        {
          section_index: 2,
          caption: "fig caption 4",
        },
      ],
      reference: references,
    };
    const json_data = JSON.stringify(json);
    formdata.append("data", json_data);

    images.forEach((image: File | undefined) => {
      if (image === undefined) {
        formdata.append("files", new Blob());
      } else {
        formdata.append("files", image);
      }
    });

    if (formdata.get("files") === null) {
      formdata.append("files", new Blob());
    }

    // ティザー画像指定
    if (teaser !== undefined) {
      formdata.append("teaser", teaser);
    } else {
      formdata.append("teaser", new Blob());
    }

    const requestOptions = {
      method: "POST",
      body: formdata,
    };
    const response = await fetch(
      `http://` + import.meta.env.VITE_HOSTNAME + `:8000/v1/pdf/create`,
      requestOptions
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      console.log(url);
    } else {
      throw new Error("response was not ok");
    }
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
          label="著者"
          id="author"
          onChange={(e) => {
            setAuthor(e.target.value);
          }}
        />
        <br />
        <TextFormSection
          label="要旨"
          id="abstract"
          onChange={(e) => {
            setAbstract(e.target.value);
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
          onChange={(e) => onChangeImages(0, e)}
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
          onChange={(e) => onChangeImages(1, e)}
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
          onChange={(e) => onChangeImages(2, e)}
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
          onChange={(e) => onChangeImages(3, e)}
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
          onChange={(e) => onChangeImages(4, e)}
        />
        <ImageFormSection
          label="ティザー画像"
          id="teaser"
          onChange={getTeaser}
        />
        <MultiTextFormSection
          label="リファレンス(複数行可)"
          id="reference"
          onChange={(e) => {
            setReference(e.target.value);
          }}
        />
        <br />
        <button className="button is-primary" type="submit">
          Submit
        </button>
      </form>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          style={{ width: "100%", height: "500px" }}
        ></iframe>
      )}
    </div>
  );
}

export default App;
