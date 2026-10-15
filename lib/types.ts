export interface Subtopic {
  num: number;
  title_en?: string;
  title_ar?: string;
  takeaway_en?: string;
  takeaway_ar?: string;
  keywords_en?: string[];
  keywords_ar?: string[];
  // Fallback fields
  title?: string;
  takeaway?: string;
  keywords?: string[];
}

export interface Article {
  id: number;
  slug: string;
  url: string;
  published_date: string;
  cluster_id: string;
  category_en: string;
  category_ar: string;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  subtopics_en: Subtopic[];
  subtopics_ar: Subtopic[];
  content_en_path: string;
  content_ar_path: string;
  word_count?: number;
  // Legacy / fallback fields
  category?: string;
  summary?: string;
  subtopics?: Subtopic[];
}

export interface Cluster {
  id: string;
  cluster_num: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  top_terms: string[];
  article_count: number;
}
