import { Label } from "./label";

/**
 *
 */
export interface Category {
  id: number;
  name: string;
  hasLinkSubCategoryFlag: boolean;
  labels: Array<Label>;
  artworkThumbnailKey: string;
  albumFlag: boolean;
  nextDisplayContentId: number;
}
