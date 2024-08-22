import React, { useState } from "react";

function TitleForm({
  title,
  setTitle,
}: {
  title?: Title;
  setTitle: (value: React.SetStateAction<Title | undefined>) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">text</label>
      <input
        type="text"
        value={title?.text ?? ""}
        onChange={(e) => {
          setTitle({ text: e.target.value } as Title);
        }}
      />
    </>
  );
}

function AuthorForm({
  author,
  setAuthor,
}: {
  author?: Author;
  setAuthor: (value: React.SetStateAction<Author | undefined>) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">author</label>
      <input
        type="text"
        value={author?.text ?? ""}
        onChange={(e) => {
          setAuthor({ text: e.target.value } as Author);
        }}
      />
    </>
  );
}

function TeaserForm({
  teaser,
  setTeaser,
}: {
  teaser?: Teaser;
  setTeaser: (value: React.SetStateAction<Teaser | undefined>) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">teaser</label>
      <input
        type="text"
        value={teaser?.caption ?? ""}
        onChange={(e) => {
          setTeaser({ caption: e.target.value } as Teaser);
        }}
      />
    </>
  );
}

function AbstractForm({
  abstract,
  setAbstract,
}: {
  abstract?: Abstract;
  setAbstract: (value: React.SetStateAction<Abstract | undefined>) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">abstract</label>
      <input
        type="text"
        value={abstract?.text ?? ""}
        onChange={(e) => {
          setAbstract({ text: e.target.value } as Abstract);
        }}
      />
    </>
  );
}

function FigureForm({
  figure,
  onChangeFigure,
}: {
  figure?: Figure;
  onChangeFigure?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">image</label>
      <input
        type="text"
        value={figure?.caption ?? ""}
        onChange={onChangeFigure}
      />
    </div>
  );
}

function FiguresForm({
  figures,
  setFigures,
}: {
  figures: (Figure | undefined)[];
  setFigures: (value: React.SetStateAction<(Figure | undefined)[]>) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">images</label>
      <FigureForm
        figure={figures?.[0]}
        onChangeFigure={(e) => {
          setFigures([{ section_index: 0, caption: e.target.value } as Figure]);
        }}
      />
    </div>
  );
}

function SectionForm({
  section,
  onChangeSection,
}: {
  section: Section;
  onChangeSection?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">section</label>
      <input
        type="text"
        value={section?.title ?? ""}
        onChange={onChangeSection}
      />
    </div>
  );
}

function SectionsForm({
  sections,
  setSections,
}: {
  sections: Section[];
  setSections: (value: React.SetStateAction<Section[]>) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">sections</label>
      <SectionForm
        section={sections?.[0]}
        onChangeSection={(e) => {
          setSections([{ title: e.target.value, text: "" } as Section]);
        }}
      />
    </div>
  );
}

function ReferenceFrom({
  reference,
  setReference,
}: {
  reference?: Reference;
  setReference: (value: React.SetStateAction<Reference | undefined>) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">reference</label>
      <input
        type="text"
        value={reference?.text ?? ""}
        onChange={(e) => {
          setReference({ text: e.target.value } as Reference);
        }}
      />
    </>
  );
}

function App() {
  // input
  const [title, setTitle] = useState<Title | undefined>(undefined);
  const [author, setAuthor] = useState<Author | undefined>(undefined);
  const [teaser, setTeaser] = useState<Teaser | undefined>(undefined);
  const [abstract, setAbstract] = useState<Abstract | undefined>(undefined);
  const [figures, setFigures] = useState<(Figure | undefined)[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [reference, setReference] = useState<Reference | undefined>(undefined);

  // output
  const [pdfUrl, setPdfUrl] = useState("");

  return (
    <div>
      <TitleForm title={title} setTitle={setTitle} />
      <br />
      <AuthorForm author={author} setAuthor={setAuthor} />
      <br />
      <TeaserForm teaser={teaser} setTeaser={setTeaser} />
      <br />
      <AbstractForm abstract={abstract} setAbstract={setAbstract} />
      <br />
      <FiguresForm figures={figures} setFigures={setFigures} />
      <br />
      <SectionsForm sections={sections} setSections={setSections} />
      <br />
      <ReferenceFrom reference={reference} setReference={setReference} />
    </div>
  );
}

export default App;
