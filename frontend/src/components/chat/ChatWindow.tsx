'use client';

import { useQueryClient, useQuery } from '@tanstack/react-query';
import { IconButton, List, ListCell, ScrollArea } from '@wanteddev/wds';
import { IconTemplate, IconChat, IconSearch } from '@wanteddev/wds-icon';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { privateApi } from '@/api';
import { MultiSelectInput, type MultiSelectInputValue, type NodeOption, type UserOption } from '@/components/commons/custom-input/MultiSelectInput';
import { useCreateChatSession, useSendMessage, useGetAllChatSessions, useGetChatSessionDetail, useGetReferenceNodes, useAddChatNode, useRemoveChatNode } from '@/queries/chat';
import { chatKeys } from '@/queries/keys/chatKeys';
import { ChatListItem } from './ChatListItem';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<MultiSelectInputValue>({
    text: '',
    mentions: [],
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);
  const [isNodeSidebarOpen, setIsNodeSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const projectId = Number(params?.projectId);
  const queryClient = useQueryClient();

  // NodeSidebar 너비 계산
  useEffect(() => {
    const updateSidebarWidth = () => {
      const width = window.innerWidth * 0.4;
      setSidebarWidth(width);
    };

    updateSidebarWidth();
    window.addEventListener('resize', updateSidebarWidth);
    return () => window.removeEventListener('resize', updateSidebarWidth);
  }, []);

  // NodeSidebar 열림 상태 감지
  useEffect(() => {
    const checkSidebar = () => {
      const sidebarState = sessionStorage.getItem('node_sidebar_open');
      setIsNodeSidebarOpen(!!sidebarState);
    };

    checkSidebar();
    const interval = setInterval(checkSidebar, 100);
    return () => clearInterval(interval);
  }, []);

  // 채팅 목록 조회
  const { data: chatSessionsData } = useGetAllChatSessions({
    projectId,
    size: 20,
  });

  const chatSessions = chatSessionsData?.data?.content || [];

  // 선택된 채팅 상세 조회
  const { data: chatDetail } = useGetChatSessionDetail({
    projectId,
    chatSessionId: selectedChatId || 0,
  });

  // 참조 가능한 노드 조회
  const { data: referenceNodesData } = useGetReferenceNodes(projectId);

  // 프로젝트 멤버 조회
  const { data: membersData } = useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: async () => {
      const response = await privateApi.projectMember.getAllMembers(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });

  // 노드 옵션 생성
  const nodes = referenceNodesData?.data?.nodes || [];
  const nodeOptions: NodeOption[] = nodes.map((node) => ({
    id: node.nodeId?.toString() || '',
    label: node.title || '',
    nodeId: node.nodeId || 0,
    number: node.number || '',
  }));

  // 사용자 옵션 생성
  const members = membersData?.data?.members || [];
  const userOptions: UserOption[] = members.map((member) => ({
    id: member.userId?.toString() || '',
    label: member.nickname || member.email || '',
    profileImageUrl: member.profileImageUrl,
  }));

  const addChatNodeMutation = useAddChatNode();
  const removeChatNodeMutation = useRemoveChatNode();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 서버에서 로드된 채팅 메시지 (이전 채팅 조회용)
  const serverMessages: Message[] = !chatDetail?.data?.messages
    ? []
    : chatDetail.data.messages.map((msg) => ({
        id: msg.messageId?.toString() || '',
        role: msg.messageType === 'USER' ? 'user' : 'assistant',
        content: msg.content || '',
        timestamp: msg.createdAt || new Date().toISOString(),
      }));

  // 현재 세션 ID
  const currentChatSessionId = selectedChatId ?? chatSessionId;

  // 화면에 표시할 메시지
  const visibleMessages = selectedChatId && selectedChatId !== chatSessionId ? serverMessages : messages;

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  const createChatMutation = useCreateChatSession();

  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (!chatSessionId && projectId && !createChatMutation.isPending) {
      createChatMutation.mutate(
        {
          projectId,
          title: '새 채팅',
        },
        {
          onSuccess: (data) => {
            if (data.data?.chatSessionId) {
              setChatSessionId(data.data.chatSessionId);
              setMessages([]);
            }
          },
        }
      );
    }
  }, [projectId, chatSessionId, createChatMutation]);

  const handleSend = (value: MultiSelectInputValue) => {
    if (!value.text.trim() || sendMessageMutation.isPending || !currentChatSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value.text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue({ text: '', mentions: [] });

    // mentions에서 노드와 사용자 ID 추출
    const referenceNodeIds = value.mentions
      .filter((mention) => mention.type === 'node')
      .map((mention) => Number(mention.id));
    const referenceUserIds = value.mentions
      .filter((mention) => mention.type === 'user')
      .map((mention) => Number(mention.id));

    sendMessageMutation.mutate(
      {
        projectId,
        chatSessionId: currentChatSessionId,
        content: value.text.trim(),
        referenceNodeIds: referenceNodeIds.length > 0 ? referenceNodeIds : undefined,
        referenceUserIds: referenceUserIds.length > 0 ? referenceUserIds : undefined,
      },
      {
        onSuccess: (data) => {
          // AI 응답 추가
          if (data.data) {
            const assistantMessage: Message = {
              id: data.data.messageId?.toString() || Date.now().toString(),
              role: 'assistant',
              content: data.data.content || '',
              timestamp: data.data.createdAt || new Date().toISOString(),
              isStreaming: true,
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }
        },
        onError: () => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const handleNewChat = () => {
    createChatMutation.mutate(
      {
        projectId,
        title: '새 채팅',
      },
      {
        onSuccess: (data) => {
          if (data.data?.chatSessionId) {
            setChatSessionId(data.data.chatSessionId);
            setSelectedChatId(data.data.chatSessionId);
            setMessages([]);
            setInputValue({ text: '', mentions: [] });

            // 채팅 목록 새로고침
            void queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
          }
        },
        onError: () => {},
      }
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-35"
        onClick={onClose}
        aria-label="채팅 닫기"
      />

      <div
        className={`fixed bottom-6 z-50 pointer-events-auto ${isSidebarOpen ? 'shadow-normal-small' : ''}`}
        style={{
          right: isNodeSidebarOpen ? 24 + sidebarWidth : 24,
          transition: 'right 0.25s ease',
        }}
      >
        <div className="relative w-96 h-[563px]">
          {/* 채팅 목록 사이드바 */}
          <div className={`absolute right-full top-0 w-44 h-full px-4 bg-white rounded-l-xl border-r border-line-normal-normal flex flex-col gap-1 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="py-5 flex justify-end items-center">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-7 h-7 bg-transparent border-0 p-0 flex items-center justify-center"
              aria-label="사이드바 닫기"
            >
              <IconTemplate width={20} height={20} className="text-label-alternative" />
            </button>
          </div>

          <List>
            <ListCell
              onClick={handleNewChat}
              leadingContent={<IconChat width={16} height={16} />}
              verticalPadding="small"
              sx={{ cursor: 'pointer', alignItems: 'center' }}
            >
              <span className="text-caption-1 font-regular">새 채팅</span>
            </ListCell>
            <ListCell
              leadingContent={<IconSearch width={16} height={16} />}
              verticalPadding="small"
              sx={{ cursor: 'pointer', alignItems: 'center' }}
            >
              <span className="text-caption-1 font-regular">채팅 검색</span>
            </ListCell>
          </List>

          <div className="self-stretch pt-3 pb-1">
            <p className="text-caption-1 font-medium text-label-alternative">최근</p>
          </div>

          <ScrollArea
            size="small"
            sx={{ flex: 1, overflowX: 'hidden', marginLeft: '-16px', marginRight: '-16px', padding: '4px' }}
          >
            <List>
                {chatSessions.map((chat) => (
                  <ChatListItem
                    key={chat.chatSessionId}
                    chat={chat}
                    projectId={projectId}
                    selectedChatId={selectedChatId}
                    hoveredChatId={hoveredChatId}
                    menuOpenChatId={menuOpenChatId}
                    currentChatSessionId={chatSessionId}
                    onSelect={setSelectedChatId}
                    onHoverChange={setHoveredChatId}
                    onMenuOpenChange={setMenuOpenChatId}
                    onCurrentChatClear={() => {
                      setChatSessionId(null);
                      setMessages([]);
                    }}
                  />
                ))}
            </List>
          </ScrollArea>
          </div>

          {/* 채팅 */}
          <div className={`relative w-full h-full bg-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'rounded-r-xl' : 'rounded-xl shadow-normal-small'}`}>
        {/* 채팅 헤더 */}
        <div className={`px-5 py-4 flex justify-between items-center ${isSidebarOpen ? 'rounded-tr-xl' : 'rounded-t-xl'}`}>
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <IconButton
                onClick={() => setIsSidebarOpen(true)}
                variant="background"
                aria-label="채팅 목록 열기"
                sx={{ width: '28px', height: '28px', padding: 0 }}
              >
                <IconTemplate width={20} height={20} />
              </IconButton>
            )}
            <div className="flex flex-col">
              <p className="text-caption-1 font-medium">플로밋 AI 에이전트</p>
              <p className="text-caption-2 font-regular text-interaction-inactive">새 대화를 시작하세요</p>
            </div>
          </div>
        </div>

        {/* 채팅 메시지 부분 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
          {visibleMessages.length === 0 && !sendMessageMutation.isPending ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-60 inline-flex flex-col justify-start items-center gap-3">
                <div className="h-12 relative flex flex-col justify-center items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <IconChat width={44} height={44} className="text-label-assistive" />
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-center items-center gap-1">
                  <div className="text-label-alternative text-body-1 font-medium">
                    새 채팅을 시작해 보세요
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {visibleMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  isStreaming={message.isStreaming}
                />
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start mb-4">
                  <div className="bg-fill-alternative px-4 py-2 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-label-alternative rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-label-alternative rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-label-alternative rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 메시지 */}
        <div className="w-96 py-4 inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch h-px bg-line-normal-normal" />
          <div className="self-stretch px-5">
            <MultiSelectInput
              placeholder="@로 사용자나 노드를 참조할 수 있어요."
              userOptions={userOptions}
              nodeOptions={nodeOptions}
              value={inputValue}
              autoFocus
              onChange={(newValue) => {
                const addedNodes = newValue.mentions.filter(
                  (mention) =>
                    mention.type === 'node' &&
                    !inputValue.mentions.some((prev) => prev.id === mention.id && prev.type === 'node')
                );

                const removedNodes = inputValue.mentions.filter(
                  (mention) =>
                    mention.type === 'node' &&
                    !newValue.mentions.some((next) => next.id === mention.id && next.type === 'node')
                );

                if (currentChatSessionId) {
                  addedNodes.forEach((node) => {
                    addChatNodeMutation.mutate({
                      projectId,
                      chatSessionId: currentChatSessionId,
                      nodeId: Number(node.id),
                    });
                  });

                  removedNodes.forEach((node) => {
                    removeChatNodeMutation.mutate({
                      projectId,
                      chatSessionId: currentChatSessionId,
                      nodeId: Number(node.id),
                    });
                  });
                }

                setInputValue(newValue);
              }}
              onSubmit={handleSend}
            />
          </div>
        </div>
      </div>
        </div>
      </div>
    </>
  );
}