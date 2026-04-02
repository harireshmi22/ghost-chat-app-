import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Animated, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const ROOM_GRADIENTS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
];

const CHAT_ROOMS = [
  {
    id: '1',
    name: 'The Study',
    description: 'A cavernous library of silent thought. Perfect for deep research and architectural planning.',
    icon: 'book',
    gradientIndex: 0,
    members: 12,
    memberLabel: 'Active Echoes',
    isActive: true,
    hasImage: false,
  },
  {
    id: '2',
    name: 'The Workshop',
    description: 'Rough drafts and kinetic energy. Where spirits build the future.',
    icon: 'wrench',
    gradientIndex: 2,
    members: 4,
    memberLabel: 'Ghosts',
    isActive: false,
    hasImage: true,
  },
  {
    id: '3',
    name: 'The Archive',
    description: 'Reviewing the patterns of the past. Cold storage and data seances.',
    icon: 'film',
    gradientIndex: 1,
    members: 0,
    memberLabel: 'Empty',
    isActive: false,
    hasImage: false,
  },
  {
    id: '4',
    name: 'The Ether',
    description: 'A space for purely vocal collaboration and fleeting ideas that vanish after dawn.',
    icon: 'cloud',
    gradientIndex: 3,
    members: 8,
    memberLabel: 'Highly Resonant',
    isActive: true,
    hasImage: true,
  },
  {
    id: '5',
    name: 'The Lounge',
    description: 'Casual conversations and chill vibes. Where ghosts come to unwind.',
    icon: 'coffee',
    gradientIndex: 4,
    members: 15,
    memberLabel: 'Spirits Present',
    isActive: true,
    hasImage: false,
  },
  {
    id: '6',
    name: 'The Vault',
    description: 'Encrypted whispers and classified echoes. Top-level clearance only.',
    icon: 'shield',
    gradientIndex: 5,
    members: 3,
    memberLabel: 'Locked',
    isActive: false,
    hasImage: false,
  },
];

// Direct Messages data
const DIRECT_MESSAGES = [
  {
    id: 1,
    name: "Hari",
    lastMessage: "Hello 👋",
    time: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
    avatar: "H",
    gradientIndex: 0,
  },
  {
    id: 2,
    name: "John",
    lastMessage: "Hi bro",
    time: "9:45 AM",
    unreadCount: 0,
    isOnline: false,
    avatar: "J",
    gradientIndex: 1,
  },
  {
    id: 3,
    name: "Jane",
    lastMessage: "How are you doing?",
    time: "Yesterday",
    unreadCount: 1,
    isOnline: true,
    avatar: "J",
    gradientIndex: 2,
  },
  {
    id: 4,
    name: "Mike",
    lastMessage: "See you tomorrow!",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    avatar: "M",
    gradientIndex: 3,
  },
  {
    id: 5,
    name: "Sarah",
    lastMessage: "Thanks for the help!",
    time: "Monday",
    unreadCount: 3,
    isOnline: true,
    avatar: "S",
    gradientIndex: 4,
  },
];

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fabScale = useRef(new Animated.Value(1)).current;

  const filteredRooms = CHAT_ROOMS.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDMs = DIRECT_MESSAGES.filter(dm =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dm.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToChat = (item) => {
    navigation.navigate("Chat", {
      user: {
        ...item,
        lastSeen: item.isOnline ? 'Online' : 'Last seen recently',
      },
      currentUser: user?.username || "You"
    });
  };

  const goToRoom = (room) => {
    navigation.navigate("Chat", {
      user: {
        name: room.name,
        avatar: room.name.charAt(0),
        isOnline: room.isActive,
        lastSeen: room.isActive ? `${room.members} active` : room.memberLabel,
        gradientIndex: room.gradientIndex,
      },
      currentUser: user?.username || "You"
    });
  };

  const handleFabPressIn = () => {
    Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const renderRoomCard = (room) => {
    const gradient = ROOM_GRADIENTS[room.gradientIndex % ROOM_GRADIENTS.length];

    return (
      <View key={room.id} style={styles.roomCard}>
        <View style={styles.roomCardHeader}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.roomIcon}
          >
            <FontAwesome name={room.icon} size={18} color="#fff" />
          </LinearGradient>

          <View style={styles.roomMemberInfo}>
            {room.isActive && <View style={styles.activeDot} />}
            <Text style={styles.memberLabel}>
              {room.members > 0 ? `${room.members} ${room.memberLabel}` : room.memberLabel}
            </Text>
          </View>
        </View>

        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomDescription}>{room.description}</Text>

        {room.hasImage && (
          <View style={styles.roomImagePlaceholder}>
            <LinearGradient
              colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
              style={styles.roomImageGradient}
            >
              <FontAwesome name={room.icon} size={28} color="rgba(255,255,255,0.1)" />
            </LinearGradient>
          </View>
        )}

        <View style={styles.roomActions}>
          <TouchableOpacity
            onPress={() => goToRoom(room)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.joinButton}
            >
              <Text style={styles.joinButtonText}>MANIFEST PRESENCE</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.observeButton}
            onPress={() => goToRoom(room)}
          >
            <Text style={styles.observeButtonText}>OBSERVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDMItem = (item) => {
    const gradient = ROOM_GRADIENTS[item.gradientIndex % ROOM_GRADIENTS.length];

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.dmItem}
        onPress={() => goToChat(item)}
        activeOpacity={0.6}
      >
        <View style={styles.dmAvatarContainer}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dmAvatar}
          >
            <Text style={styles.dmAvatarText}>{item.avatar}</Text>
          </LinearGradient>
          {item.isOnline && (
            <View style={styles.onlineIndicatorOuter}>
              <View style={styles.onlineIndicator} />
            </View>
          )}
        </View>

        <View style={styles.dmContent}>
          <View style={styles.dmHeader}>
            <Text style={styles.dmName}>{item.name}</Text>
            <Text style={[styles.dmTime, item.unreadCount > 0 && styles.dmTimeUnread]}>
              {item.time}
            </Text>
          </View>
          <View style={styles.dmFooter}>
            <Text style={styles.dmLastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.unreadBadge}
              >
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

      {/* Header */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoRow}>
              <FontAwesome name="bars" size={14} color="#667eea" style={{ marginRight: 8 }} />
              <Text style={styles.brandText}>SPECTRAL</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => {
                setSearchVisible(!searchVisible);
                setSearchQuery('');
              }}
            >
              <FontAwesome name="search" size={16} color="#e0e0ff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerAvatarBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.headerAvatar}
              >
                <Text style={styles.headerAvatarText}>
                  {user?.avatar || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {searchVisible && (
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={14} color="#5555aa" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search rooms & messages..."
              placeholderTextColor="#4444aa"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setSearchVisible(false); setSearchQuery(''); }}>
              <FontAwesome name="times" size={16} color="#5555aa" />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>ATMOSPHERE · ACTIVE</Text>
          <Text style={styles.heroTitle}>
            Enter the{'\n'}
            <Text style={styles.heroHighlight}>Workspace</Text> of{'\n'}
            Echoes.
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rooms' && styles.activeTab]}
            onPress={() => setActiveTab('rooms')}
          >
            <FontAwesome
              name="th-large"
              size={14}
              color={activeTab === 'rooms' ? '#667eea' : '#5555aa'}
            />
            <Text style={[styles.tabText, activeTab === 'rooms' && styles.activeTabText]}>
              Chat Rooms
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'dms' && styles.activeTab]}
            onPress={() => setActiveTab('dms')}
          >
            <FontAwesome
              name="comments"
              size={14}
              color={activeTab === 'dms' ? '#667eea' : '#5555aa'}
            />
            <Text style={[styles.tabText, activeTab === 'dms' && styles.activeTabText]}>
              Direct Messages
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'rooms' ? (
          <View style={styles.roomsList}>
            {filteredRooms.map(renderRoomCard)}
            {filteredRooms.length === 0 && searchQuery && (
              <View style={styles.emptyState}>
                <FontAwesome name="search" size={32} color="#3333aa" />
                <Text style={styles.emptyText}>No rooms found</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.dmsList}>
            {filteredDMs.map(renderDMItem)}
            {filteredDMs.length === 0 && searchQuery && (
              <View style={styles.emptyState}>
                <FontAwesome name="search" size={32} color="#3333aa" />
                <Text style={styles.emptyText}>No messages found</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={() => setActiveTab('rooms')}>
          <FontAwesome name="home" size={20} color={activeTab === 'rooms' ? '#667eea' : '#3333aa'} />
          <Text style={[styles.bottomTabText, activeTab === 'rooms' && styles.bottomTabActive]}>
            HOME
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => {
          setSearchVisible(true);
        }}>
          <FontAwesome name="search" size={18} color="#3333aa" />
          <Text style={styles.bottomTabText}>SEARCH</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => setActiveTab('dms')}>
          <FontAwesome name="comments-o" size={20} color={activeTab === 'dms' ? '#667eea' : '#3333aa'} />
          <Text style={[styles.bottomTabText, activeTab === 'dms' && styles.bottomTabActive]}>
            GHOSTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="cog" size={20} color="#3333aa" />
          <Text style={styles.bottomTabText}>PORTAL</Text>
        </TouchableOpacity>
      </View>

      {/* FAB */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          onPress={() => { }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <FontAwesome name="plus" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#e0e0ff',
    letterSpacing: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerAvatarBtn: {},
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#667eea',
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e4e4f0',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroHighlight: {
    color: '#667eea',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(102, 126, 234, 0.12)',
    borderColor: 'rgba(102, 126, 234, 0.25)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5555aa',
  },
  activeTabText: {
    color: '#667eea',
  },
  roomsList: {
    paddingHorizontal: 20,
  },
  roomCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 24,
    marginBottom: 16,
  },
  roomCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roomIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
  },
  memberLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5555aa',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  roomName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e4e4f0',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  roomDescription: {
    fontSize: 14,
    color: '#6666aa',
    lineHeight: 21,
    marginBottom: 16,
    fontWeight: '400',
  },
  roomImagePlaceholder: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  roomImageGradient: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  roomActions: {
    flexDirection: 'row',
    gap: 10,
  },
  joinButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  observeButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  observeButtonText: {
    color: '#8888cc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  dmsList: {
    paddingHorizontal: 12,
  },
  dmItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginVertical: 3,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  dmAvatarContainer: {
    marginRight: 14,
    position: 'relative',
  },
  dmAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dmAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  onlineIndicatorOuter: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ade80',
  },
  dmContent: {
    flex: 1,
    justifyContent: 'center',
  },
  dmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dmName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e4e4f0',
  },
  dmTime: {
    fontSize: 11,
    color: '#4444aa',
    fontWeight: '500',
  },
  dmTimeUnread: {
    color: '#8b7bf7',
  },
  dmFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dmLastMessage: {
    fontSize: 13,
    color: '#5555aa',
    flex: 1,
    marginRight: 12,
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 14,
    backgroundColor: '#0d0d1a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  bottomTab: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  bottomTabText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3333aa',
    letterSpacing: 1,
  },
  bottomTabActive: {
    color: '#667eea',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 72,
    right: 20,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#5555aa',
    fontWeight: '600',
  },
});