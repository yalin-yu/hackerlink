import { useState, useEffect, useCallback } from 'react';

// Onboarding
import WelcomeScreen from './components/onboarding/WelcomeScreen';
import RoleSelectionScreen from './components/onboarding/RoleSelectionScreen';
import SubRoleSelectionScreen from './components/onboarding/SubRoleSelectionScreen';
import Question1Screen from './components/onboarding/Question1Screen';
import Question4Screen from './components/onboarding/Question4Screen';
import TwinReadyScreen from './components/onboarding/TwinReadyScreen';

// API
import { createProfile, getProfile } from '../api/profile';
import { api } from '../api/client';
import type { SoulData } from '../api/twin';

// Main Tabs
import MyTabEmpty from './components/main/MyTabEmpty';
import ChatsTabEmpty from './components/main/ChatsTabEmpty';

// Explore Flow
import ExploreModal from './components/main/ExploreModal';
import TwinDepartureTransition from './components/main/TwinDepartureTransition';
import SoulSliceGrid from './components/main/SoulSliceGrid';
import SoulSliceDetail from './components/main/SoulSliceDetail';
import SoulSliceGridWithSelection from './components/main/SoulSliceGridWithSelection';

// Messages & Meeting
import MessagesTab from './components/main/MessagesTab';
import TwinChatConversation from './components/main/TwinChatConversation';
import MeetOfflineInvitation from './components/main/MeetOfflineInvitation';
import MeetingInvitationReceiver from './components/main/MeetingInvitationReceiver';
import PostMeetingFeedback from './components/main/PostMeetingFeedback';

// Network
import NetworkTabFirstNode from './components/main/NetworkTabFirstNode';
import NetworkTabWithGraph from './components/main/NetworkTabWithGraph';
import RelationDetailCard from './components/main/RelationDetailCard';

// Global Components
import FloatingActionButton from './components/main/FloatingActionButton';

type Role = 'builder' | 'backer' | 'organizer';
type SubRole = 'code' | 'product' | 'business' | 'investor' | 'consulting' | 'content' | 'corporate' | 'organizer';

type Screen =
  | 'welcome' | 'role-selection' | 'sub-role-selection' | 'question1' | 'question4' | 'twin-ready'
  | 'my-tab-empty' | 'chats-tab-empty'
  | 'explore-modal' | 'twin-departure'
  | 'soul-grid' | 'soul-detail' | 'soul-grid-selected'
  | 'messages-tab' | 'twin-chat'
  | 'meet-invitation' | 'meet-receiver'
  | 'post-meeting' | 'network-tab' | 'network-graph';

function getUserId(): string {
  const stored = localStorage.getItem('hackerlink_userId');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('hackerlink_userId', id);
  return id;
}

export default function App() {
  const [userId] = useState<string>(getUserId);
  const [eventId, setEventId] = useState<string>('');
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  // Onboarding state
  const [userRole, setUserRole] = useState<Role>('builder');
  const [subRole, setSubRole] = useState<SubRole>('code');
  const [q1, setQ1] = useState<string>('');
  const [q4, setQ4] = useState<string>('');

  // Twin search state
  const [soulResults, setSoulResults] = useState<SoulData[]>([]);

  // FAB state
  const [hasMet, setHasMet] = useState(false);

  // Bookkeeping
  const [previousScreen, setPreviousScreen] = useState<Screen>('my-tab-empty');

  // [API] On mount: check if onboarding done, fetch event
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Check onboarding
      try {
        const profileRes = await getProfile(userId);
        if (!cancelled && profileRes.onboardingComplete && profileRes.profile) {
          setUserRole(profileRes.profile.role as Role);
          setSubRole(profileRes.profile.sub_role as SubRole);
          setQ1(profileRes.profile.q1);
          setQ4(profileRes.profile.q4);
          setScreen('my-tab-empty');
        }
      } catch { /* no profile yet */ }

      // Get event
      try {
        const eventsRes = await api.get<{ events: { id: string; name: string }[] }>('/api/events');
        if (!cancelled && eventsRes.events?.length > 0) {
          setEventId(eventsRes.events[0].id);
        }
      } catch { /* no events yet */ }
    }

    init();
    return () => { cancelled = true; };
  }, [userId]);

  // [API] Onboarding complete → POST /api/profiles + join event
  const handleOnboardingComplete = async () => {
    try {
      await createProfile({ userId, role: userRole, subRole, q1, q4 });

      // Join event
      if (eventId) {
        try {
          await api.post('/api/twin-config', {
            userId, eventId, selectedCards: [], customInput: '',
          });
        } catch { /* may already exist */ }
      }
    } catch (err) {
      console.error('[API] onboarding complete failed:', err);
    }
    setScreen('my-tab-empty');
  };

  // [API] Explore → go to departure screen (search + poll happens inside TwinDepartureTransition)
  const handleExploreStart = useCallback((_selectedCards: number[], _customInput: string) => {
    setScreen('twin-departure');
  }, []);

  // [API] Twin search complete → go to results
  const handleTwinResults = useCallback((results: SoulData[]) => {
    setSoulResults(results);
    setScreen('soul-grid');
  }, []);

  const goToNetworkGraph = () => {
    setSelectedNodeId(null);
    setScreen('network-graph');
  };

  // FAB state machine
  const getFABState = (): 'new-event' | 'hidden' => {
    const showFABScreens: Screen[] = ['my-tab-empty', 'chats-tab-empty', 'messages-tab', 'network-graph'];
    if (!showFABScreens.includes(screen)) return 'hidden';
    if (!hasMet) return 'new-event';
    return 'hidden';
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setScreen('role-selection')} />;
      case 'role-selection':
        return <RoleSelectionScreen onNext={(role) => { setUserRole(role); setScreen('sub-role-selection'); }} />;
      case 'sub-role-selection':
        return <SubRoleSelectionScreen role={userRole} onNext={(sr) => { setSubRole(sr); setScreen('question1'); }} />;
      case 'question1':
        return <Question1Screen role={userRole} onNext={(text) => { setQ1(text); setScreen('question4'); }} />;
      case 'question4':
        return <Question4Screen role={userRole} onNext={(text) => { setQ4(text); setScreen('twin-ready'); }} onSkip={() => setScreen('twin-ready')} />;
      case 'twin-ready':
        return <TwinReadyScreen q1={q1} q4={q4} onNext={handleOnboardingComplete} />;

      case 'my-tab-empty':
        return <MyTabEmpty userRole={userRole} onTabChange={(tab) => {
          if (tab === 'chats') setScreen('chats-tab-empty');
          if (tab === 'network') goToNetworkGraph();
        }} />;
      case 'chats-tab-empty':
        return <ChatsTabEmpty userId={userId} eventId={eventId} onTabChange={(tab) => {
          if (tab === 'me') setScreen('my-tab-empty');
          if (tab === 'network') goToNetworkGraph();
        }} />;

      case 'explore-modal':
        return <ExploreModal onStart={handleExploreStart} onClose={() => setScreen(previousScreen)} />;
      case 'twin-departure':
        return <TwinDepartureTransition
          userId={userId}
          eventId={eventId}
          onResults={handleTwinResults}
          onGoBack={() => setScreen(previousScreen)}
        />;

      case 'soul-grid':
        return <SoulSliceGrid
          souls={soulResults}
          userRole={userRole}
          userId={userId}
          eventId={eventId}
          onBack={() => setScreen('my-tab-empty')}
        />;
      case 'soul-detail':
        return <SoulSliceDetail onBack={() => setScreen('soul-grid')} onMeet={() => setScreen('soul-grid-selected')} />;
      case 'soul-grid-selected':
        return <SoulSliceGridWithSelection userRole={userRole} onGoToMessages={() => {
          setHasMet(true);
          setScreen('messages-tab');
        }} onBack={() => setScreen('soul-grid')} />;

      case 'messages-tab':
        return <MessagesTab userId={userId} eventId={eventId} onMeetOffline={() => setScreen('meet-invitation')} onContinueChat={() => setScreen('twin-chat')} onTabChange={(tab) => {
          if (tab === 'me') setScreen('my-tab-empty');
          if (tab === 'network') goToNetworkGraph();
        }} />;
      case 'twin-chat':
        return <TwinChatConversation onBack={() => setScreen('messages-tab')} />;
      case 'meet-invitation':
        return <MeetOfflineInvitation onSend={() => setScreen('messages-tab')} onBack={() => setScreen('messages-tab')} />;
      case 'meet-receiver':
        return <MeetingInvitationReceiver onConfirm={() => setScreen('post-meeting')} onBack={() => setScreen('messages-tab')} />;
      case 'post-meeting':
        return <PostMeetingFeedback onSave={goToNetworkGraph} onBack={() => setScreen('messages-tab')} />;
      case 'network-tab':
        return <NetworkTabFirstNode onTabChange={(tab) => {
          if (tab === 'me') setScreen('my-tab-empty');
          if (tab === 'messages') setScreen('messages-tab');
        }} />;
      case 'network-graph':
        return (
          <>
            <NetworkTabWithGraph
              onNodeClick={(nodeId) => setSelectedNodeId(nodeId)}
              onTabChange={(tab) => {
                if (tab === 'me') setScreen('my-tab-empty');
                if (tab === 'messages') setScreen('messages-tab');
              }}
            />
            {selectedNodeId !== null && (
              <RelationDetailCard
                relationId={selectedNodeId}
                onClose={() => setSelectedNodeId(null)}
                onChat={() => {
                  setSelectedNodeId(null);
                  setScreen('twin-chat');
                }}
              />
            )}
          </>
        );

      default:
        return <WelcomeScreen onNext={() => setScreen('question1')} />;
    }
  };

  return (
    <div className="size-full">
      {renderScreen()}

      <FloatingActionButton
        state={getFABState()}
        onPress={() => {
          const fabState = getFABState();
          if (fabState === 'new-event') {
            setPreviousScreen(screen);
            setScreen('explore-modal');
          }
        }}
      />
    </div>
  );
}
