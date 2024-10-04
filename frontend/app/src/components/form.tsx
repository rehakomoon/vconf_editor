import {
  Button,
  FormLabel,
  Grid2,
  IconButton,
  OutlinedInput,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import React from "react";

export function TitleForm({
  title,
  onChangeTitle,
}: {
  title?: Title;
  onChangeTitle: (value: Title) => void;
}): JSX.Element {
  return (
    <Grid2 size={12}>
      <FormLabel
        className="label"
        htmlFor="title"
        required
        style={{ fontSize: "1.5rem", fontWeight: 700 }}
      >
        タイトル
      </FormLabel>
      <OutlinedInput
        type="text"
        id="title"
        value={title?.text ?? ""}
        size="small"
        required
        fullWidth
        onChange={(e) => {
          onChangeTitle({ text: e.target.value } as Title);
        }}
      />
    </Grid2>
  );
}

export function AuthorForm({
  author,
  onChangeAuthor,
}: {
  author?: Author;
  onChangeAuthor: (value: Author) => void;
}): JSX.Element {
  return (
    <Grid2 size={12}>
      <FormLabel
        className="label"
        htmlFor="author"
        required
        style={{ fontSize: "1.5rem", fontWeight: 700 }}
      >
        著者
      </FormLabel>
      <Typography color="gray" fontSize="0.8rem">
        筆頭著者には 名前の後にアスタリクス(*) をつけてください
      </Typography>
      <OutlinedInput
        type="text"
        id="author"
        value={author?.text ?? ""}
        size="small"
        required
        fullWidth
        onChange={(e) => {
          onChangeAuthor({ text: e.target.value } as Author);
        }}
      />
    </Grid2>
  );
}

export function TeaserForm({
  teaser,
  onChangeTeaser,
}: {
  teaser?: Teaser;
  onChangeTeaser: (value?: Teaser) => void;
}): JSX.Element {
  return (
    <Grid2 container size={12} spacing={2}>
      <Grid2 size={12}>
        <FormLabel
          className="label"
          htmlFor="teaser"
          style={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          ティザー画像
        </FormLabel>
      </Grid2>
      {teaser ? (
        <Grid2 container size={12} sx={{ p: 1, border: "1px dashed grey" }}>
          <Grid2
            container
            size={12}
            spacing={2}
            display="flex"
            alignItems="center"
          >
            <Grid2
              container
              size={6}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <FormLabel
                className="label"
                htmlFor="figure"
                style={{ fontSize: "1.0rem", fontWeight: 700 }}
              >
                ティザー画像
              </FormLabel>
            </Grid2>
            <Grid2
              container
              size={6}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <IconButton
                onClick={() => {
                  onChangeTeaser(undefined);
                }}
              >
                <RemoveCircleOutlineIcon color="error" />
              </IconButton>
            </Grid2>
          </Grid2>
          <Grid2 size={12}>
            <FormLabel
              className="label"
              htmlFor="figure"
              style={{ fontSize: "1.0rem" }}
            >
              キャプション
            </FormLabel>
            <OutlinedInput
              type="text"
              id="teaser_caption"
              value={teaser?.caption ?? ""}
              size="small"
              fullWidth
              onChange={(e) => {
                onChangeTeaser({
                  caption: e.target.value,
                  image: teaser?.image,
                } as Teaser);
              }}
            />
          </Grid2>
          <Grid2 size={12}>
            <FormLabel
              className="label"
              htmlFor="figure"
              required
              style={{ fontSize: "1.0rem" }}
            >
              画像ファイル
            </FormLabel>
          </Grid2>
          <Grid2 size={12}>
            <input
              id="teaser_image"
              type="file"
              accept="image/*,.png,.jpg,.jpeg,.gif"
              required
              onChange={(e) => {
                if (!e.target.files) return;
                const img = e.target.files[0];
                onChangeTeaser({ caption: teaser?.caption ?? "", image: img });
              }}
            />
          </Grid2>
        </Grid2>
      ) : (
        <Grid2
          container
          size={12}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ border: "1px dashed grey" }}
        >
          <Button
            fullWidth
            onClick={(e) => {
              e.preventDefault();
              const newTeaser = { caption: "" } as Teaser;
              onChangeTeaser(newTeaser);
            }}
          >
            <AddCircleOutlineIcon color="primary" />
          </Button>
        </Grid2>
      )}
    </Grid2>
  );
}

export function AbstractForm({
  abstract,
  onChangeAbstract,
}: {
  abstract?: Abstract;
  onChangeAbstract: (value: Abstract) => void;
}): JSX.Element {
  return (
    <Grid2 size={12}>
      <FormLabel
        className="label"
        htmlFor="abstract"
        required
        style={{ fontSize: "1.5rem", fontWeight: 700 }}
      >
        概要
      </FormLabel>
      <OutlinedInput
        id="abstract"
        name="abstract"
        rows={3}
        multiline
        size="small"
        required
        fullWidth
        value={abstract?.text ?? ""}
        onChange={(e) => {
          onChangeAbstract({ text: e.target.value } as Abstract);
        }}
      />
    </Grid2>
  );
}

function FigureForm({
  figure,
  index,
  onChangeFigure,
  onClickRemoveButton,
}: {
  figure: Figure;
  index: number;
  onChangeFigure: (value: Figure) => void;
  onClickRemoveButton: React.MouseEventHandler<HTMLButtonElement>;
}): JSX.Element {
  return (
    <Grid2 container size={12} spacing={2} display="flex" alignItems="center">
      <Grid2 container size={12} spacing={2} display="flex" alignItems="center">
        <Grid2
          container
          size={6}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <FormLabel
            className="label"
            htmlFor="figure"
            style={{ fontSize: "1.0rem", fontWeight: 700 }}
          >
            {`図${index + 1}`}
          </FormLabel>
        </Grid2>
        <Grid2
          container
          size={6}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton onClick={onClickRemoveButton}>
            <RemoveCircleOutlineIcon color="error" />
          </IconButton>
        </Grid2>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        <FormLabel
          className="label"
          htmlFor="figure"
          required
          style={{ fontSize: "1.0rem" }}
        >
          キャプション
        </FormLabel>
        <OutlinedInput
          id={`figure${index}_text`}
          rows={2}
          multiline
          size="small"
          fullWidth
          required
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
        <Grid2 size={12}>
          <FormLabel
            className="label"
            htmlFor="figure"
            required
            style={{ fontSize: "1.0rem" }}
          >
            画像ファイル
          </FormLabel>
        </Grid2>
        <Grid2 size={12}>
          <input
            id={`figure${index}_image`}
            type="file"
            required
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
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export function FiguresForm({
  figures,
  onChangeFigures,
}: {
  figures: Figure[];
  onChangeFigures: (value: Figure[]) => void;
}): JSX.Element {
  /* HACK: 上限値をパラメータで制御できるようにしたほうがいい？ */
  const enableAddColumnButton = figures.length < 20;

  return (
    <Grid2 container size={12} spacing={2}>
      <FormLabel
        className="label"
        htmlFor="figures"
        style={{ fontSize: "1.5rem", fontWeight: 700 }}
      >
        添付図
      </FormLabel>
      {figures.map((figure, index) => {
        return (
          <Grid2 container size={12} sx={{ p: 1, border: "1px dashed grey" }}>
            <FigureForm
              figure={figure}
              index={index}
              onChangeFigure={(value) => {
                const newFigures = [...figures];
                newFigures[index] = value;
                onChangeFigures(newFigures);
              }}
              onClickRemoveButton={(e) => {
                e.preventDefault();
                const newFigures = [
                  ...figures.slice(0, index),
                  ...figures.slice(index + 1),
                ];
                onChangeFigures(newFigures);
              }}
            />
          </Grid2>
        );
      })}
      <Grid2
        container
        size={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ border: "1px dashed grey" }}
      >
        <Button
          fullWidth
          disabled={!enableAddColumnButton}
          onClick={(e) => {
            e.preventDefault();
            const newFigures = [
              ...figures,
              { caption: "", section_index: 0 } as Figure,
            ];
            onChangeFigures(newFigures);
          }}
        >
          <AddCircleOutlineIcon
            color={enableAddColumnButton ? "primary" : "disabled"}
          />
        </Button>
      </Grid2>
    </Grid2>
  );
}

function SectionForm({
  section,
  index,
  removable,
  onChangeSection,
  onClickRemoveButton,
}: {
  section: Section;
  index: number;
  removable: boolean;
  onChangeSection: (value: Section) => void;
  onClickRemoveButton: React.MouseEventHandler<HTMLButtonElement>;
}): JSX.Element {
  return (
    <Grid2 container size={12} spacing={2} display="flex" alignItems="center">
      <Grid2 container size={12} spacing={2} display="flex" alignItems="center">
        <Grid2
          container
          size={6}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <FormLabel
            className="label"
            htmlFor="section"
            style={{ fontSize: "1.0rem", fontWeight: 700 }}
          >
            {`セクション${index + 1}`}
          </FormLabel>
        </Grid2>
        <Grid2
          container
          size={6}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton onClick={onClickRemoveButton} disabled={!removable}>
            <RemoveCircleOutlineIcon color={removable ? "error" : "disabled"} />
          </IconButton>
        </Grid2>
      </Grid2>
      <Grid2 size={12}>
        <FormLabel
          className="label"
          htmlFor="section"
          required
          style={{ fontSize: "1.0rem" }}
        >
          タイトル
        </FormLabel>
        <OutlinedInput
          type="text"
          id={`section${index}_title`}
          value={section?.title ?? ""}
          size="small"
          required
          fullWidth
          onChange={(e) => {
            onChangeSection({
              title: e.target.value,
              text: section.text,
            } as Section);
          }}
        />
        <FormLabel
          className="label"
          htmlFor="section"
          required
          style={{ fontSize: "1.0rem" }}
        >
          本文
        </FormLabel>
        <OutlinedInput
          id={`section${index}_text`}
          name={`section${index}_text`}
          rows={3}
          multiline
          size="small"
          fullWidth
          required
          value={section?.text ?? ""}
          onChange={(e) => {
            onChangeSection({
              title: section.title,
              text: e.target.value,
            } as Section);
          }}
        />
      </Grid2>
    </Grid2>
  );
}

export function SectionsForm({
  sections,
  onChangeSections,
}: {
  sections: Section[];
  onChangeSections: (value: Section[]) => void;
}): JSX.Element {
  /* HACK: 上限値をパラメータで制御できるようにしたほうがいい？ */
  const enableAddColumnButton = sections.length < 20;

  return (
    <Grid2 container size={12} spacing={2}>
      <FormLabel
        className="label"
        htmlFor="section"
        required
        style={{ fontSize: "1.5rem", fontWeight: 700 }}
      >
        本文
      </FormLabel>
      {sections.map((section, index) => {
        return (
          <Grid2 container size={12} sx={{ p: 1, border: "1px dashed grey" }}>
            <SectionForm
              section={section}
              index={index}
              removable={sections.length > 1}
              onChangeSection={(value) => {
                const newSections = [...sections];
                newSections[index] = value;
                onChangeSections(newSections);
              }}
              onClickRemoveButton={(e) => {
                e.preventDefault();
                const newSections = [
                  ...sections.slice(0, index),
                  ...sections.slice(index + 1),
                ];
                onChangeSections(newSections);
              }}
            />
          </Grid2>
        );
      })}
      <Grid2
        container
        size={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ border: "1px dashed grey" }}
      >
        <Button
          fullWidth
          disabled={!enableAddColumnButton}
          onClick={(e) => {
            e.preventDefault();
            const newSections = [
              ...sections,
              { title: "", text: "" } as Section,
            ];
            onChangeSections(newSections);
          }}
        >
          <AddCircleOutlineIcon
            color={enableAddColumnButton ? "primary" : "disabled"}
          />
        </Button>
      </Grid2>
    </Grid2>
  );
}

export function ReferenceFrom({
  reference,
  onChangeReference,
}: {
  reference?: Reference;
  onChangeReference: (value: Reference) => void;
}): JSX.Element {
  return (
    <Grid2 size={12}>
      <FormLabel
        className="label"
        htmlFor="reference"
        style={{ fontSize: "1.5rem", fontWeight: 700 }}
      >
        参考文献
      </FormLabel>
      <OutlinedInput
        id="reference"
        name="reference"
        rows={3}
        multiline
        size="small"
        fullWidth
        value={reference?.text ?? ""}
        onChange={(e) => {
          onChangeReference({ text: e.target.value } as Reference);
        }}
      />
    </Grid2>
  );
}
