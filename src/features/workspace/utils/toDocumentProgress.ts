import type {
  DocumentProgress,
  SectionName,
} from "../../../shared/types/documentType";
import type { WorkspaceSection } from "../constants/sections";
import { toSectionStatusValue } from "./toSectionStatusValue";

export const toDocumentProgress = (
  sections: WorkspaceSection[],
): DocumentProgress =>
  sections.map((section) => ({
    section: section.title as SectionName,
    status: toSectionStatusValue(section.sectionStatus),
  }));
