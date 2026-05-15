export type User = {
  id: string;
  name: string;
  email: string;
};

export type Note = {
  note_id: string;
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string | null;
  archived: boolean;
  is_public: boolean;
  share_id: string | null;
  summary: string | null;
  action_items: string[];
  suggested_title: string | null;
  updated_at: string;
  created_at: string;
};

export type Insights = {
  total_notes: number;
  archived_count: number;
  recently_edited: Note[];
  most_used_tags: { tag: string; count: number }[];
  ai_usage: { total: number; this_week: number };
  weekly_activity: {
    notes_edited: number;
    ai_generations: number;
    summary: string;
  };
};
