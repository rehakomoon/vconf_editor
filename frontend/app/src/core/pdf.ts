type PdfCreateRequest = {
  title: string;
  author: string;
  abstract: string;
  body: PdfCreateRequestSection[];
  teaser?: PdfCreateRequestTeaser;
  figure: PdfCreateRequestFigure[];
  reference: PdfCreateRequestRefarence[];
};

type PdfCreateRequestSection = {
  title: string;
  text: string;
};

type PdfCreateRequestTeaser = {
  caption: string;
};

type PdfCreateRequestFigure = {
  section_index: number;
  caption: string;
  position?: string;
};

type PdfCreateRequestRefarence = {
  value: string;
};
