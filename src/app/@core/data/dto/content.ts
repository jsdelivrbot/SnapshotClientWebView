/**
 *
 */
export interface Content {
  Id: number;
  Name: string;
  IdentifyKey: string;
  ContentHash: string;
  ThumbnailImageSrcUrl: string;
  ThumbnailKey: string;
  Caption: string;
  Comment: string;
  ArchiveFlag: Boolean;
  ReadableCount: number;
  ReadableFlag: Boolean;
  ReadableDate: Date;
  StarRating: number;
  LastReadDate: Date;
}
