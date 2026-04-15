import { SegmentedControl, SegmentedControlItem } from '@wanteddev/wds';
import { Box } from '@wanteddev/wds-engine';

export type ProjectViewTypes = 'node-flow' | 'list' | 'kanban';

interface ProjectViewTabsProps {
    activeView: ProjectViewTypes;
    onViewChange: (view: ProjectViewTypes) => void;
}

const PROJECT_VIEW_OPTIONS: Array<{
    label: string;
    value: ProjectViewTypes;
}> = [
    { label: '노드 플로우', value: 'node-flow' },
    { label: '리스트', value: 'list' },
    { label: '칸반', value: 'kanban' },
];

export const ProjectViewTabs = ({ activeView, onViewChange }: ProjectViewTabsProps) => {
    return (
        <Box
            className="inline-flex shrink-0 w-[300px] rounded-md bg-fill-normal"
            sx={{
                '& button': {
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'center',
                    color: 'var(--color-label-alternative)',
                    fontSize: 'var(--typography---label2---font-size)',
                    lineHeight: 'var(--typography---label2---line-height)',
                    letterSpacing: 'var(--typography---label2---letter-spacing)',
                    fontFamily: 'var(--font-pretendard)',
                },
                '& button[data-state="on"]': {
                    backgroundColor: 'var(--color-background-elevated-normal)',
                    color: 'var(--color-label-normal)',
                },
            }}
        >
            <SegmentedControl
                size="small"
                value={activeView}
                onValueChange={(value) => onViewChange(value as ProjectViewTypes)}
            >
                {PROJECT_VIEW_OPTIONS.map(({ label, value }) => (
                    <SegmentedControlItem
                        key={value}
                        value={value}
                        className="h-8 px-3"
                    >
                        {label}
                    </SegmentedControlItem>
                ))}
            </SegmentedControl>
        </Box>
    );
};