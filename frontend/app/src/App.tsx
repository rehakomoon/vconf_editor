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
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";

const ConvertReference = (
  reference: Reference | undefined
): PdfCreateRequestRefarence[] => {
  if (reference === undefined) return [];
  return reference.text.split("\n").map((ref) => {
    return { value: ref };
  });
};

const ConvertTeaser = (
  teaser: Teaser | undefined
): PdfCreateRequestTeaser | undefined => {
  if (teaser === undefined) return undefined;
  return {
    caption: teaser.caption,
  };
};

const ConvertSection = (section: Section): PdfCreateRequestSection => {
  return {
    title: section.title,
    text: section.text,
  };
};

const ConvertFigure = (figure: Figure): PdfCreateRequestFigure => {
  return {
    section_index: figure.section_index,
    caption: figure.caption,
    position: figure?.position,
  };
};

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
  const json: PdfCreateRequest = {
    title: title?.text ?? "",
    author: author?.text ?? "",
    abstract: abstract?.text ?? "",
    body: sections.map(ConvertSection),
    teaser: ConvertTeaser(teaser),
    figure: figures.map(ConvertFigure),
    reference: ConvertReference(reference),
  };
  const json_data = JSON.stringify(json);
  formdata.append("data", json_data);

  // 画像を添付
  figures.forEach((figure: Figure) => {
    if (figure.image === undefined) {
      formdata.append("files", new Blob());
    } else {
      formdata.append("files", figure.image);
    }
  });

  // 一枚も画像がなくても、空の画像が最低1枚必要
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
  const [figures, setFigures] = useState<Figure[]>([]);
  const [sections, setSections] = useState<Section[]>(
    Array(1).fill({ title: "", text: "" } as Section)
  );
  const [reference, setReference] = useState<Reference | undefined>(undefined);

  // output
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const Submit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

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
    setLoading(false);

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      console.log(url);
    } else {
      throw new Error("response was not ok");
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    Submit();
  };

  return (
    <div>
      <Grid2 container spacing={4} display="flex" flexDirection="row">
        <Grid2
          display="flex"
          flexDirection="column"
          container
          size={{ xs: 12, md: 6 }}
        >
          <Box component="form" className="box" onSubmit={handleSubmit}>
            <Grid2 container spacing={4}>
              <TitleForm title={title} onChangeTitle={setTitle} />
              <AuthorForm author={author} onChangeAuthor={setAuthor} />
              <TeaserForm teaser={teaser} onChangeTeaser={setTeaser} />
              <AbstractForm
                abstract={abstract}
                onChangeAbstract={setAbstract}
              />
              <SectionsForm
                sections={sections}
                onChangeSections={setSections}
              />
              <FiguresForm figures={figures} onChangeFigures={setFigures} />
              <ReferenceFrom
                reference={reference}
                onChangeReference={setReference}
              />
              <Button
                className="button is-primary"
                color="primary"
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                    }}
                  />
                )}
                pdf出力
              </Button>
            </Grid2>
          </Box>
        </Grid2>
        <Grid2
          container
          size={{ xs: 12, md: 6 }}
          display="flex"
          flexDirection="column"
        >
          <Grid2 size={12}>
            <Typography>pdf出力結果</Typography>
          </Grid2>
          <Grid2 size={12} minHeight={"800px"}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                style={{ width: "100%", height: "100%" }}
              ></iframe>
            ) : (
              <Typography color="info">出力結果がありません</Typography>
            )}
          </Grid2>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default App;
