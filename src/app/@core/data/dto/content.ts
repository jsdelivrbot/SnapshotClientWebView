/**
 *
 */
export interface Content {
  id: number;
  name: string;
  identifyKey: string;
  contentHash: string;
  thumbnailKey: string;
  caption: string;
  comment: string;
  archiveFlag: Boolean;
  readableCount: number;
  readableFlag: Boolean;
  readableDate: Date;
  starRating: number;
  lastReadDate: Date;
}
