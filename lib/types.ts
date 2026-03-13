export type Paste = {
  id: number;
  title: string;
  content: string;
  slug: string;
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
};
