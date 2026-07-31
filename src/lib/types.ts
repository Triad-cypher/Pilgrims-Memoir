export const RESOURCE_TYPES = ["BOOK", "ARTICLE", "DEVOTIONAL"] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export const VISIBILITIES = ["PUBLIC", "PRIVATE"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const COMMENT_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type CommentStatus = (typeof COMMENT_STATUSES)[number];

export const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  BOOK: "Book",
  ARTICLE: "Article",
  DEVOTIONAL: "Monthly Devotion",
};

export const RESOURCE_TYPE_PATH: Record<ResourceType, string> = {
  BOOK: "books",
  ARTICLE: "articles",
  DEVOTIONAL: "devotionals",
};
