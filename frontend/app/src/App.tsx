import React, { useState, ChangeEventHandler, FormEventHandler } from "react";
import SingleLineTextForm from "./components/single-line-text-form";
import MultiLineTextForm from "./components/multi-line-text-form";
import ImageForm from "./components/image-form";

function TeaserImageFormSection({
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

function App() {
  const [images, setImages] = useState<(File | undefined)[]>([]);
  const [teaser, setTeaser] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [abstract, setAbstract] = useState("");
  const [sections, setSections] = useState<String[]>([]);
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

  const onChangeSections = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSections = Array(Math.max(index + 1, sections.length)).fill("");
    sections.forEach((v: String, i: number) => {
      newSections[i] = v;
    });
    newSections[index] = e.target.value;
    setSections(newSections);
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
        <SingleLineTextForm 
          label="タイトル"
          id="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <br />
        <SingleLineTextForm
          label="著者"
          id="author"
          onChange={(e) => {
            setAuthor(e.target.value);
          }}
        />
        <br />
        <SingleLineTextForm
          label="要旨"
          id="abstract"
          onChange={(e) => {
            setAbstract(e.target.value);
          }}
        />
        <br />
        <SingleLineTextForm
          label="セクション1"
          id="section1"
          onChange={(e) => {
            onChangeSections(0, e);
          }}
        />
        <ImageForm id={0} onChange={onChangeImages} />
        <br />
        <SingleLineTextForm
          label="セクション2"
          id="section2"
          onChange={(e) => {
            onChangeSections(1, e);
          }}
        />
        <ImageForm id={1} onChange={onChangeImages} />
        <br />
        <SingleLineTextForm
          label="セクション3"
          id="section3"
          onChange={(e) => {
            onChangeSections(2, e);
          }}
        />
        <ImageForm id={2} onChange={onChangeImages} />
        <SingleLineTextForm
          label="セクション4"
          id="section4"
          onChange={(e) => {
            onChangeSections(3, e);
          }}
        />
        <ImageForm id={3} onChange={onChangeImages} />
        <SingleLineTextForm
          label="セクション5"
          id="section5"
          onChange={(e) => {
            onChangeSections(4, e);
          }}
        />
        <ImageForm id={4} onChange={onChangeImages} />
        <TeaserImageFormSection onChange={getTeaser} />
        <MultiLineTextForm
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
