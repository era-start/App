import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  List,
  Switch,
  Divider,
  Portal,
  Dialog,
  useTheme
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { darkMode } = useSelector(state => state.theme);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Text 
            size={80} 
            label={getInitials(user?.name)}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text variant="headlineSmall">{user?.name}</Text>
            <Text variant="bodyMedium">ID: {user?.id}</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
              {user?.type === 'product-based' ? 'Product Based' : 'Salary Based'}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Settings</List.Subheader>
            
            <List.Item
              title="Dark Mode"
              left={() => <Icon name="theme-light-dark" size={24} color={theme.colors.primary} />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={() => dispatch(toggleTheme())}
                />
              )}
            />

            <List.Item
              title="Notifications"
              left={() => <Icon name="bell-outline" size={24} color={theme.colors.primary} />}
              onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon.')}
            />

            <Divider style={styles.divider} />

            <List.Subheader>Support</List.Subheader>
            
            <List.Item
              title="Help & FAQ"
              left={() => <Icon name="help-circle-outline" size={24} color={theme.colors.primary} />}
              onPress={() => Alert.alert('Coming Soon', 'Help section will be available soon.')}
            />

            <List.Item
              title="Contact Support"
              left={() => <Icon name="message-outline" size={24} color={theme.colors.primary} />}
              onPress={() => Alert.alert('Coming Soon', 'Support chat will be available soon.')}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="Logout"
              left={() => <Icon name="logout" size={24} color={theme.colors.error} />}
              titleStyle={{ color: theme.colors.error }}
              onPress={() => setShowLogoutDialog(true)}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog
          visible={showLogoutDialog}
          onDismiss={() => setShowLogoutDialog(false)}
        >
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button onPress={handleLogout}>Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  profileCard: {
    margin: 15,
    marginBottom: 10
  },
  settingsCard: {
    margin: 15,
    marginTop: 5
  },
  avatarContainer: {
    padding: 20,
    alignItems: 'center'
  },
  avatar: {
    marginBottom: 10
  },
  userInfo: {
    alignItems: 'center'
  },
  divider: {
    marginVertical: 10
  }
});

export default ProfileScreen; 