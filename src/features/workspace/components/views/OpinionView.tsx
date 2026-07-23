import { Button } from "../../../../shared/components/Button";
import SectionBlock from "../blocks/SectionBlock";
import type { WorkspaceSection } from "../../constants/sections";

interface OpinionViewProps {
  section: WorkspaceSection;
}

const OpinionView = ({ section }: OpinionViewProps) => {
  return (
    <>
      <SectionBlock>
        <p className="mb-4 text-gray-600">섹션: {section.title}</p>
        <br />
        <p className="mb-4">이 섹션블럭 블럭 이용해서 구현해주세요!</p>
        <Button type="outline"> 버튼은 이거 사용해주세요! </Button>
        <Button type="main"> main </Button>
        <Button type="red"> red </Button>
        <Button type="green"> green </Button>
      </SectionBlock>
    </>
  );
};

export default OpinionView;
