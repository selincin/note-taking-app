export class Note {
  id: string;
  title: string;
  text: string;
  tags: string[];
  created_at: string;
  edited_at: string;
  archived: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.text = data.text;
    this.tags = data.tags ?? [];
    this.created_at = data.created_at;
    this.edited_at = data.edited_at;
    this.archived = data.archived ?? false;
  }
}