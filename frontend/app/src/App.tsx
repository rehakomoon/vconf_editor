import { useState } from "react";

function TitleForm({
  title,
  onChangeTitle,
}: {
  title?: Title;
  onChangeTitle: (value: Title) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">text</label>
      <input
        type="text"
        value={title?.text ?? ""}
        onChange={(e) => {
          onChangeTitle({ text: e.target.value } as Title);
        }}
      />
    </>
  );
}

function AuthorForm({
  author,
  onChangeAuthor,
}: {
  author?: Author;
  onChangeAuthor: (value: Author) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">author</label>
      <input
        type="text"
        value={author?.text ?? ""}
        onChange={(e) => {
          onChangeAuthor({ text: e.target.value } as Author);
        }}
      />
    </>
  );
}

function TeaserForm({
  teaser,
  onChangeTeaser,
}: {
  teaser?: Teaser;
  onChangeTeaser: (value: Teaser) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">teaser</label>
      <input
        type="text"
        value={teaser?.caption ?? ""}
        onChange={(e) => {
          onChangeTeaser({ caption: e.target.value } as Teaser);
        }}
      />
    </>
  );
}

function AbstractForm({
  abstract,
  onChangeAbstract,
}: {
  abstract?: Abstract;
  onChangeAbstract: (value: Abstract) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">abstract</label>
      <input
        type="text"
        value={abstract?.text ?? ""}
        onChange={(e) => {
          onChangeAbstract({ text: e.target.value } as Abstract);
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
  onChangeFigure: (value: Figure) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">image</label>
      <input
        type="text"
        value={figure?.caption ?? ""}
        onChange={(e) => {
          onChangeFigure({
            section_index: 0,
            caption: e.target.value,
          } as Figure);
        }}
      />
    </div>
  );
}

function FiguresForm({
  figures,
  onChangeFigures,
}: {
  figures: (Figure | undefined)[];
  onChangeFigures: (value: (Figure | undefined)[]) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">images</label>
      <FigureForm
        figure={figures?.[0]}
        onChangeFigure={(value) => {
          onChangeFigures([value]);
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
  onChangeSection: (value: Section) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">section</label>
      <input
        type="text"
        value={section?.title ?? ""}
        onChange={(e) => {
          onChangeSection({ title: e.target.value, text: "" } as Section);
        }}
      />
    </div>
  );
}

function SectionsForm({
  sections,
  onChangeSections,
}: {
  sections: Section[];
  onChangeSections: (value: Section[]) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label">sections</label>
      <SectionForm
        section={sections?.[0]}
        onChangeSection={(value) => onChangeSections([value])}
      />
    </div>
  );
}

function ReferenceFrom({
  reference,
  onChangeReference,
}: {
  reference?: Reference;
  onChangeReference: (value: Reference) => void;
}): JSX.Element {
  return (
    <>
      <label className="label">reference</label>
      <input
        type="text"
        value={reference?.text ?? ""}
        onChange={(e) => {
          onChangeReference({ text: e.target.value } as Reference);
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
      <TitleForm title={title} onChangeTitle={setTitle} />
      <br />
      <AuthorForm author={author} onChangeAuthor={setAuthor} />
      <br />
      <TeaserForm teaser={teaser} onChangeTeaser={setTeaser} />
      <br />
      <AbstractForm abstract={abstract} onChangeAbstract={setAbstract} />
      <br />
      <FiguresForm figures={figures} onChangeFigures={setFigures} />
      <br />
      <SectionsForm sections={sections} onChangeSections={setSections} />
      <br />
      <ReferenceFrom reference={reference} onChangeReference={setReference} />
    </div>
  );
}

export default App;
