import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch, Alert, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: () => logout(), style: "destructive" }
      ]
    );
  };

  const SettingsItem = ({ icon, title, subtitle, onPress, value, gradientColors, showArrow = true }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.itemLeft}>
        <LinearGradient
          colors={gradientColors || ['rgba(100,126,234,0.15)', 'rgba(118,75,162,0.15)']}
          style={styles.itemIconContainer}
        >
          <Icon name={icon} size={20} color="#8888cc" />
        </LinearGradient>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.itemRight}>
        {value !== undefined && (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: 'rgba(255,255,255,0.08)', true: 'rgba(100,126,234,0.4)' }}
            thumbColor={value ? '#667eea' : '#555'}
          />
        )}
        {showArrow && value === undefined && <Icon name="chevron-right" size={20} color="#3333aa" />}
      </View>
    </TouchableOpacity>
  );

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-back" size={22} color="#e0e0ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileAvatar}
          >
            <Text style={styles.profileAvatarText}>{user?.avatar || 'U'}</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.username || 'Your Name'}</Text>
            <Text style={styles.profileStatus}>{user?.email || 'Available'}</Text>
          </View>
          <View style={styles.qrButton}>
            <Icon name="qr-code" size={20} color="#8888cc" />
          </View>
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.sectionCard}>
            <SettingsItem
              icon="privacy-tip"
              title="Privacy"
              subtitle="Phone number, last seen, profile photo"
              onPress={() => {}}
              gradientColors={['rgba(240,147,251,0.15)', 'rgba(245,87,108,0.15)']}
            />
            <SettingsItem
              icon="security"
              title="Security"
              subtitle="Security notifications, code change"
              onPress={() => {}}
              gradientColors={['rgba(79,172,254,0.15)', 'rgba(0,242,254,0.15)']}
            />
            <SettingsItem
              icon="verified-user"
              title="Two-step verification"
              subtitle="Add extra layer of security"
              onPress={() => {}}
              gradientColors={['rgba(67,233,123,0.15)', 'rgba(56,249,215,0.15)']}
            />
            <SettingsItem
              icon="backup"
              title="Chat backup"
              subtitle="Back up to cloud"
              onPress={() => {}}
              gradientColors={['rgba(250,112,154,0.15)', 'rgba(254,225,64,0.15)']}
            />
            <SettingsItem
              icon="translate"
              title="App language"
              subtitle="English"
              onPress={() => {}}
              gradientColors={['rgba(161,140,209,0.15)', 'rgba(251,194,235,0.15)']}
            />
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL</Text>
          <View style={styles.sectionCard}>
            <SettingsItem
              icon="notifications"
              title="Notifications"
              subtitle="Message, group & call tones"
              onPress={() => {}}
              gradientColors={['rgba(240,147,251,0.15)', 'rgba(245,87,108,0.15)']}
            />
            <SettingsItem
              icon="data-usage"
              title="Data and storage"
              subtitle="Network usage, auto-download"
              onPress={() => {}}
              gradientColors={['rgba(79,172,254,0.15)', 'rgba(0,242,254,0.15)']}
            />
            <SettingsItem
              icon="nightlight"
              title="Dark mode"
              subtitle="Theme settings"
              onPress={() => setDarkMode(!darkMode)}
              value={darkMode}
              gradientColors={['rgba(100,126,234,0.15)', 'rgba(118,75,162,0.15)']}
            />
            <SettingsItem
              icon="font-download"
              title="Font size"
              subtitle="Medium"
              onPress={() => {}}
              gradientColors={['rgba(67,233,123,0.15)', 'rgba(56,249,215,0.15)']}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.sectionCard}>
            <SettingsItem
              icon="help"
              title="Help"
              onPress={() => {}}
              gradientColors={['rgba(250,112,154,0.15)', 'rgba(254,225,64,0.15)']}
            />
            <SettingsItem
              icon="contact-support"
              title="Contact us"
              onPress={() => {}}
              gradientColors={['rgba(161,140,209,0.15)', 'rgba(251,194,235,0.15)']}
            />
            <SettingsItem
              icon="info"
              title="About"
              onPress={() => {}}
            />
            <SettingsItem
              icon="policy"
              title="Privacy policy"
              onPress={() => {}}
              gradientColors={['rgba(79,172,254,0.15)', 'rgba(0,242,254,0.15)']}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer}>
          <LinearGradient
            colors={['#ff416c', '#ff4b2b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButton}
          >
            <Icon name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 38,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
    marginTop: 8,
  },
  profileAvatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#e4e4f0',
    marginBottom: 2,
  },
  profileStatus: {
    fontSize: 13,
    color: '#6666aa',
    fontWeight: '500',
  },
  qrButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5555aa',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    color: '#c8c8e0',
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#5555aa',
    marginTop: 2,
    fontWeight: '400',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
