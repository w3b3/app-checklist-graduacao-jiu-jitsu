export interface RequirementsData {
  belts: {
    id: string;
    name: string;
    color: string;
    textColor: string;
    lightColor: string;
    categories: { name: string; items: { id: string; name: string }[] }[];
  }[];
}
