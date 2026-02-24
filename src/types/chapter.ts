export type Chapter = {
  id: string;
  title: string;
  status: "in-progress" | "not-started";
  progress: number;
  badgeText?: string;
  statusLabel: string;
  partLabel: string;
  bodyHeading: string;
  body: string[];
};

