'use client';

import { privateApi } from '@/api';
import { MeetingItem } from '@/api/Api';
import { useEffect, useState } from 'react';
import CreateMeeting from './CreateMeeting';
import HasMeeting from './HasMeeting';

interface NodeMeetingTabProps {
  nodeId: number | null;
  projectId: number;
}

export const NodeMeetingTab = ({ nodeId, projectId }: NodeMeetingTabProps) => {
  const [hasMeeting, setHasMeeting] = useState<MeetingItem | undefined>(undefined);

  useEffect(() => {
    const fetchNodeDetail = async () => {
      try {
        if (!projectId || !nodeId) return;

        const data = await privateApi.node.getNode(projectId, nodeId);
        setHasMeeting(data.data.data?.meeting);
      } catch (error) {
        console.error('Failed to load flowchart:', error);
      }
    };
    void fetchNodeDetail();
  }, [nodeId]);

  return (
    <>
      {hasMeeting ? (
        <>
          <HasMeeting />
        </>
      ) : (
        <>
          <CreateMeeting />
        </>
      )}
    </>
  );
};

export default NodeMeetingTab;
