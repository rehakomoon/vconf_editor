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
  Alert,
  AlertTitle,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Divider,
  GlobalStyles,
  Grid2,
  Link,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";

const Bar = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}): JSX.Element => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h4" component="div" mr={2} fontWeight={700}>
          バーチャル学会向け 要旨作成フォーム
        </Typography>
        <Button color="inherit" onClick={onClick}>
          このページについて・問い合わせ先
        </Button>
        <Box sx={{ ml: "auto" }}>
          <Link href="https://vconf.org/2024/" color="inherit" target="_blank" rel="noopener" underline="hover"> 
            バーチャル学会2024HP
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

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
  const [open, setOpen] = useState<boolean>(false);

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
  const [errorContext, setErrorContext] = useState<string | undefined>(
    undefined
  );

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
    await fetch(
      `http://` + import.meta.env.VITE_HOSTNAME + `:8000/v1/pdf/create`,
      requestOptions
    )
      .then(async (response) => {
        if (!response.ok) {
          setErrorContext(
            `${response.status}-${Date.now()}: response was not ok`
          );
          throw new Error("response was not ok");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        console.log(url);
      })
      .catch((error) => {
        setErrorContext(`000-${Date.now()}: ${error.message}`);
        throw new Error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    Submit();
  };

  return (
    <div>
      <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
      <Bar
        onClick={() => {
          setOpen(!open);
        }}
      />

      <Snackbar
        open={errorContext !== undefined}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => {
            setErrorContext(undefined);
          }}
        >
          <AlertTitle>Error</AlertTitle>
          PDF作成に失敗しました。 以下のメッセージを 問い合わせ先
          に記載の連絡先にお知らせください。
          <br />[{errorContext}]
        </Alert>
      </Snackbar>

      <Box mt={2} style={{ padding: 8, margin: 8 }}>
        <Grid2 container spacing={4} display="flex" flexDirection="row">
          {open && (
            <Grid2 size={12}>
              <Typography variant="h5">このサイトは何？</Typography>
              <Typography>
                このサイトは、有志が作成したバーチャル学会向けの要旨PDF作成フォームです(非公式です)。
                <br />
                必要な内容を入力したあと、「PDF作成」ボタンを押すと要旨の形式に沿ったPDFが作成されます。
                作成後したPDFを保存して提出してください。
                <br />
                <Link href="https://www.overleaf.com/read/ybyhrqmbyrxh#56281b" color="inherit" target="_blank" rel="noopener"> 
                  参考: 要旨の要件(LaTeX版 Overleaf)
                </Link>
              </Typography>
              <br />
              <Typography variant="h5">注意事項</Typography>
              <Typography>
                ・<b>入力した内容は保存されません！</b>
                手元で編集してから貼り付けてください。
                <br />
                ・図は 指定した順番どおりに、 図1, 図2
                と表示されます。本文中では 直接 「図1」「図2」と書いてください。
                <br />
                ・図の細かい位置は指定できません。
                <br />
                ・表はこのフォームでは作成できません。
                代わりに図を使うようにしてください。
                <br />
              </Typography>
              <br />
              <Typography variant="h5">問い合わせ先</Typography>
              <Typography
                component={Link}
                href="https://forms.gle/jQKnBL49thCK9pqF6"
                target="_blank"
                rel="noopener"
              >
                問い合わせフォーム
              </Typography>
              <Divider style={{ padding: 8 }} />
            </Grid2>
          )}
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
                  fullWidth
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
      </Box>
    </div>
  );
}

export default App;
