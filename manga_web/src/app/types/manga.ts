interface MangaAttributes {
  title: { [key: string]: string };
  altTitles: { [key: string]: string }[];
  description: { [key: string]: string };
  status: string;
  year: number;
  contentRating: string;
  tags: {
    id: string;
    type: string;
    attributes: {
      name: { [key: string]: string };
      group: string;
    };
  }[];
}

export interface MangaDetail {
  id: string;
  type: string;
  attributes: MangaAttributes;
}

export interface MangaResponse {
  result: string;
  response: string;
  data: MangaDetail;
}
