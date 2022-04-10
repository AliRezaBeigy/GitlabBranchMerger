export enum Sender {
  React,
  Content,
}

export enum MessageType {
  GetCurrentRepository,
}

export interface ChromeMessage {
  from: Sender;
  messageType: MessageType;
  data: any;
}

export interface Repository {
  id: string;
  url: string;
  name: string;
  group: string;
}

export enum SectionType {
  CreateMergeRequest,
  ConfirmMerge,
  ConfirmMergeWhenPipelineSucceeds,
  AutoMergeWhenPipelineSucceeds,
  Merged,
}

export interface Section {
  repositories: FetchedRepository[];
  sectionType: SectionType;
}

export interface FetchedRepository {
  data: any;
  loading?: boolean;
  repository: Repository;
  sectionType: SectionType;
}
