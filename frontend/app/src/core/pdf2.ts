type PdfCreateRequest2 = {
  title: string;
  author: string;
  abstract: string;
  body: PdfCreateRequestSection[];
  teaser?: PdfCreateRequestTeaser;
  figure: PdfCreateRequestFigure[];
  reference: PdfCreateRequestRefarence[];
};

type Title = {
  text: string;
}

type Author = {
  text: string;
}

type Abstract = {
  text: string;
}

type Section = {
  title: string;
  text: string;
};

type Teaser = {
  caption: string;
  image?: File;
};

type Figure = {
  section_index: number;
  caption: string;
  position?: string;
  image?: File;
};

type Reference = {
  text: string;
};
