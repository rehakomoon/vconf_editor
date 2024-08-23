import { useState } from "react";
import {
  AbstractForm,
  AuthorForm,
  FiguresForm,
  ReferenceFrom,
  SectionsForm,
  TeaserForm,
  TitleForm,
} from "./components/form";

const CreateFormData = ({
  title,
  author,
  abstract,
  teaser,
  sections,
  figures,
  reference,
}: {
  title?: Title;
  author?: Author;
  abstract?: Abstract;
  teaser?: Teaser;
  figures: Figure[];
  sections: Section[];
  reference?: Reference;
}): FormData => {
  const formdata = new FormData();
  const references: PdfCreateRequestRefarence[] = reference
    ? reference.text.split("\n").map((ref) => {
        return { value: ref };
      })
    : [];
  const json: PdfCreateRequest = {
    title: title?.text ?? "",
    author: author?.text ?? "",
    abstract: abstract?.text ?? "",
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

  figures.forEach((figure: Figure) => {
    if (figure.image === undefined) {
      formdata.append("files", new Blob());
    } else {
      formdata.append("files", figure.image);
    }
  });

  if (formdata.get("files") === null) {
    formdata.append("files", new Blob());
  }

  // ティザー画像指定
  if (teaser?.image !== undefined) {
    formdata.append("teaser", teaser.image);
  } else {
    formdata.append("teaser", new Blob());
  }

  return formdata;
};

function App() {
  // input
  const [title, setTitle] = useState<Title | undefined>(undefined);
  const [author, setAuthor] = useState<Author | undefined>(undefined);
  const [teaser, setTeaser] = useState<Teaser | undefined>(undefined);
  const [abstract, setAbstract] = useState<Abstract | undefined>(undefined);
  const [figures, setFigures] = useState<Figure[]>(Array(5).fill({} as Figure));
  const [sections, setSections] = useState<Section[]>(
    Array(5).fill({} as Section)
  );
  const [reference, setReference] = useState<Reference | undefined>(undefined);

  // output
  const [pdfUrl, setPdfUrl] = useState("");

  const Submit = async () => {
    const formdata = CreateFormData({
      title,
      author,
      teaser,
      abstract,
      figures,
      sections,
      reference,
    });
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
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    Submit();
  };

  return (
    <div>
      <form className="box" onSubmit={handleSubmit}>
        <TitleForm title={title} onChangeTitle={setTitle} />
        <AuthorForm author={author} onChangeAuthor={setAuthor} />
        <TeaserForm teaser={teaser} onChangeTeaser={setTeaser} />
        <AbstractForm abstract={abstract} onChangeAbstract={setAbstract} />
        <FiguresForm figures={figures} onChangeFigures={setFigures} />
        <SectionsForm sections={sections} onChangeSections={setSections} />
        <ReferenceFrom reference={reference} onChangeReference={setReference} />
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
