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
        id="teaser_caption"
        value={teaser?.caption ?? ""}
        onChange={(e) => {
          onChangeTeaser({ caption: e.target.value } as Teaser);
        }}
      />
      <br />
      <input
        id="teaser_image"
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.gif"
        onChange={(e) => {
          if (!e.target.files) return;
          const img = e.target.files[0];
          onChangeTeaser({ caption: teaser?.caption ?? "", image: img });
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
  index,
  onChangeFigure,
}: {
  figure: Figure;
  index: number;
  onChangeFigure: (value: Figure) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor="figure">
        {`figure${index + 1}`}
      </label>
      <br />
      <label className="label" htmlFor="figure">
        caption
      </label>
      <input
        type="text"
        id={`figure${index}_text`}
        value={figure?.caption ?? ""}
        onChange={(e) => {
          onChangeFigure({
            section_index: figure.section_index,
            caption: e.target.value,
            position: figure.position,
            image: figure.image,
          } as Figure);
        }}
      />
      <br />
      <input
        id={`figure${index}_image`}
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.gif"
        onChange={(e) => {
          if (!e.target.files) return;
          onChangeFigure({
            section_index: figure.section_index,
            caption: figure.caption,
            position: figure.position,
            image: e.target.files[0],
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
  figures: Figure[];
  onChangeFigures: (value: Figure[]) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor="figures">
        images
      </label>
      {figures.map((figure, index) => {
        return (
          <FigureForm
            figure={figure}
            index={index}
            onChangeFigure={(value) => {
              const newFigures = [...figures];
              newFigures[index] = value;
              onChangeFigures(newFigures);
            }}
          />
        );
      })}
    </div>
  );
}

function SectionForm({
  section,
  index,
  onChangeSection,
}: {
  section: Section;
  index: number;
  onChangeSection: (value: Section) => void;
}): JSX.Element {
  return (
    <div>
      <label className="label" htmlFor="section">
        {`section${index + 1}`}
      </label>
      <input
        type="text"
        id={`section${index}_title`}
        value={section?.title ?? ""}
        onChange={(e) => {
          onChangeSection({
            title: e.target.value,
            text: section.text,
          } as Section);
        }}
      />
      <textarea
        id={`section${index}_text`}
        name={`section${index}_text`}
        rows={4}
        cols={50}
        value={section?.text ?? ""}
        onChange={(e) => {
          onChangeSection({
            title: section.title,
            text: e.target.value,
          } as Section);
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
      {sections.map((section, index) => {
        return (
          <SectionForm
            section={section}
            index={index}
            onChangeSection={(value) => {
              const newSections = [...sections];
              newSections[index] = value;
              onChangeSections(newSections);
            }}
          />
        );
      })}
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
      <textarea
        id="reference"
        name="reference"
        rows={4}
        cols={50}
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
  const [figures, setFigures] = useState<Figure[]>(Array(5).fill({} as Figure));
  const [sections, setSections] = useState<Section[]>(
    Array(5).fill({} as Section)
  );
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
