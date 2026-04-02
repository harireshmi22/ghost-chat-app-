import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Your Name');
  const [status, setStatus] = useState('Available');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [email, setEmail] = useState('your.email@example.com');

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const InfoItem = ({ icon, label, value, editValue, onChangeText }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={20} color="#8888cc" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={editValue}
            onChangeText={onChangeText}
            placeholder={label}
            placeholderTextColor="#4444aa"
          />
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
    </View>
  );

  const MenuItem = ({ icon, title, gradientColors }) => (
    <TouchableOpacity style={styles.menuItem}>
      <LinearGradient
        colors={gradientColors || ['rgba(100,126,234,0.15)', 'rgba(118,75,162,0.15)']}
        style={styles.menuIconContainer}
      >
        <Icon name={icon} size={20} color="#8888cc" />
      </LinearGradient>
      <Text style={styles.menuItemText}>{title}</Text>
      <Icon name="chevron-right" size={20} color="#3333aa" />
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={isEditing ? handleSave : handleEdit} style={styles.headerBtn}>
          <Icon name={isEditing ? "check" : "edit"} size={22} color="#e0e0ff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.cameraButton}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.cameraGradient}
              >
                <Icon name="camera-alt" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor="#4444aa"
              />
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileStatus}>{status}</Text>
            </>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL INFO</Text>
          <View style={styles.sectionCard}>
            <InfoItem icon="phone" label="Phone" value={phone} editValue={phone} onChangeText={setPhone} />
            <InfoItem icon="email" label="Email" value={email} editValue={email} onChangeText={setEmail} />
            <InfoItem icon="info" label="Status" value={status} editValue={status} onChangeText={setStatus} />
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="notifications" title="Notifications" gradientColors={['rgba(240,147,251,0.15)', 'rgba(245,87,108,0.15)']} />
            <MenuItem icon="security" title="Privacy" gradientColors={['rgba(79,172,254,0.15)', 'rgba(0,242,254,0.15)']} />
            <MenuItem icon="storage" title="Data and Storage" gradientColors={['rgba(67,233,123,0.15)', 'rgba(56,249,215,0.15)']} />
            <MenuItem icon="chat" title="Chat History" gradientColors={['rgba(250,112,154,0.15)', 'rgba(254,225,64,0.15)']} />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="help" title="Help" />
            <MenuItem icon="info" title="About" />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <LinearGradient
            colors={['#ff416c', '#ff4b2b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
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
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  cameraGradient: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0a0a1a',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e4e4f0',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileStatus: {
    fontSize: 14,
    color: '#6666aa',
    fontWeight: '500',
  },
  editContainer: {
    alignItems: 'center',
  },
  nameInput: {
    width: 220,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#e0e0ff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 14,
    color: '#8888cc',
    fontWeight: '600',
  },
  saveText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  infoIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#5555aa',
    marginBottom: 2,
    fontWeight: '600',
  },
  infoInput: {
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#e0e0ff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  infoValue: {
    fontSize: 15,
    color: '#c8c8e0',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: '#c8c8e0',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutGradient: {
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
