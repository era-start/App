import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
  Alert
} from 'react-native';
import {
  Text,
  Card,
  Button,
  DataTable,
  useTheme,
  Portal,
  Modal
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FileManager from '../../services/fileManager';
import NetworkManager from '../../services/networkManager';
import NotificationService from '../../services/notifications';

const SalaryDetailsScreen = () => {
  const theme = useTheme();
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch updated salary data here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const downloadInvoice = async (month) => {
    try {
      setLoading(true);
      
      // Check network connection
      if (!await NetworkManager.checkConnectivity()) {
        Alert.alert('Error', 'No internet connection');
        return;
      }

      // Get download URL from API
      const response = await salaryApi.getInvoiceUrl(month);
      
      // Download and cache the file
      const filePath = await FileManager.downloadInvoice(month, response.url);
      
      // Show success notification
      NotificationService.showNotification('DOWNLOAD_COMPLETE', {
        body: 'Invoice downloaded successfully'
      });

      // Share the file
      await FileManager.shareInvoice(filePath);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Icon name="cash" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge" style={styles.title}>Salary Details</Text>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Month</DataTable.Title>
              <DataTable.Title numeric>Basic</DataTable.Title>
              <DataTable.Title numeric>Net</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>

            {[...Array(3)].map((_, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>Jan 2024</DataTable.Cell>
                <DataTable.Cell numeric>₹{user?.salary || 0}</DataTable.Cell>
                <DataTable.Cell numeric>
                  ₹{(user?.salary || 0) - (user?.advances || 0)}
                </DataTable.Cell>
                <DataTable.Cell>
                  <View style={styles.actionButtons}>
                    <Button
                      mode="text"
                      compact
                      onPress={() => {
                        setSelectedInvoice({
                          month: 'January 2024',
                          amount: (user?.salary || 0) - (user?.advances || 0)
                        });
                        setShowInvoice(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      mode="text"
                      compact
                      onPress={() => downloadInvoice('2024-01')}
                    >
                      Download
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={showInvoice}
          onDismiss={() => setShowInvoice(false)}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Text variant="titleLarge" style={styles.modalTitle}>
              Salary Invoice - {selectedInvoice?.month}
            </Text>

            <View style={styles.invoiceSection}>
              <View style={styles.employeeDetails}>
                <Text variant="titleMedium">Employee Details</Text>
                <Text>Name: {user?.name}</Text>
                <Text>ID: {user?.id}</Text>
                <Text>Type: {user?.type}</Text>
              </View>

              <View style={styles.invoiceDetails}>
                <Text variant="titleMedium">Invoice Details</Text>
                <Text>Month: {selectedInvoice?.month}</Text>
                <Text>Date: {new Date().toLocaleDateString()}</Text>
              </View>
            </View>

            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Basic Salary</DataTable.Cell>
                <DataTable.Cell numeric>₹{user?.salary || 0}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Advances</DataTable.Cell>
                <DataTable.Cell numeric>-₹{user?.advances || 0}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Net Payable</DataTable.Cell>
                <DataTable.Cell numeric>₹{selectedInvoice?.amount}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>

            <View style={styles.signatures}>
              <View style={styles.signature}>
                <Text>Employee Signature</Text>
                <View style={styles.signatureLine} />
              </View>
              <View style={styles.signature}>
                <Text>Authorized Signature</Text>
                <View style={styles.signatureLine} />
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15
  },
  card: {
    marginBottom: 15
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    marginLeft: 10
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%'
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20
  },
  invoiceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  employeeDetails: {
    flex: 1
  },
  invoiceDetails: {
    flex: 1,
    alignItems: 'flex-end'
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 20
  },
  signature: {
    alignItems: 'center'
  },
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: '#000',
    marginTop: 40
  }
});

export default SalaryDetailsScreen; 