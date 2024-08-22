import { useState } from "react";

function TitleForm({
  title,
  onChangeTitle,
}: {
  title?: Title;
  onChangeTitle: (value: Title) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor="title">
        title
      </label>
      <input
        type="text"
        id="title"
        value={title?.text ?? ""}
        onChange={(e) => {
          onChangeTitle({ text: e.target.value } as Title);
        }}
      />
    </div>
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
    <div>
      <label className="label" htmlFor="author">
        author
      </label>
      <input
        type="text"
        id="author"
        value={author?.text ?? ""}
        onChange={(e) => {
          onChangeAuthor({ text: e.target.value } as Author);
        }}
      />
    </div>
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
    <div>
      <label className="label" htmlFor="teaser">
        teaser
      </label>
      <input
        type="text"
        id="teaser"
        value={teaser?.caption ?? ""}
        onChange={(e) => {
          onChangeTeaser({ caption: e.target.value } as Teaser);
        }}
      />
    </div>
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
    <div>
      <label className="label" htmlFor="abstract">
        abstract
      </label>
      <input
        type="text"
        id="abstract"
        value={abstract?.text ?? ""}
        onChange={(e) => {
          onChangeAbstract({ text: e.target.value } as Abstract);
        }}
      />
    </div>
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
      <label className="label" htmlFor="figure">
        image
      </label>
      <input
        type="text"
        id="figure"
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
      <label className="label" htmlFor="figures">
        images
      </label>
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
      <label className="label" htmlFor="section">
        section
      </label>
      <input
        type="text"
        id="section"
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
      <label className="label" htmlFor="sections">
        sections
      </label>
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
    <div>
      <label className="label" htmlFor="reference">
        reference
      </label>
      <input
        type="text"
        id="reference"
        value={reference?.text ?? ""}
        onChange={(e) => {
          onChangeReference({ text: e.target.value } as Reference);
        }}
      />
    </div>
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
      <form className="box">
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
    </div>
  );
}

export default App;
