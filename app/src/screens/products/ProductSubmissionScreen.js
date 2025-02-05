import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  HelperText,
  useTheme,
  Portal,
  Dialog
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApi } from '../../hooks/useApi';
import { productApi } from '../../services/api';
import SyncService from '../../services/sync';
import { useOfflineData } from '../../hooks/useOfflineData';
import { STORAGE_KEYS } from '../../services/storage';

const ProductSubmissionScreen = () => {
  const theme = useTheme();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [submission, setSubmission] = useState({
    productId: '',
    quantity: '',
    comments: '',
    defects: ''
  });

  const { execute: submitProduct } = useApi(productApi.submitProduct);

  const { data: assignments, isOnline } = useOfflineData(
    STORAGE_KEYS.ASSIGNMENTS,
    productApi.getAssignments
  );

  const handleSubmit = async () => {
    if (!submission.productId || !submission.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isOnline) {
        // Online submission
        const result = await submitProduct(submission);
        if (result) {
          Alert.alert('Success', 'Product submitted successfully');
          setSubmission({
            productId: '',
            quantity: '',
            comments: '',
            defects: ''
          });
        }
      } else {
        // Offline submission
        await SyncService.addPendingSubmission(submission);
        Alert.alert(
          'Success',
          'Product saved for submission when online connection is available'
        );
        setSubmission({
          productId: '',
          quantity: '',
          comments: '',
          defects: ''
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Icon name="package-variant" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge" style={styles.title}>Submit Products</Text>
          </View>

          <TextInput
            mode="outlined"
            label="Product ID *"
            value={submission.productId}
            onChangeText={(text) => setSubmission({...submission, productId: text})}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Quantity Completed *"
            value={submission.quantity}
            onChangeText={(text) => setSubmission({...submission, quantity: text})}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Comments"
            value={submission.comments}
            onChangeText={(text) => setSubmission({...submission, comments: text})}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Defects (if any)"
            value={submission.defects}
            onChangeText={(text) => setSubmission({...submission, defects: text})}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={() => setShowConfirm(true)}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Submit Products
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={showConfirm} onDismiss={() => setShowConfirm(false)}>
          <Dialog.Title>Confirm Submission</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to submit the following?</Text>
            <Text style={styles.confirmText}>
              Product ID: {submission.productId}
            </Text>
            <Text style={styles.confirmText}>
              Quantity: {submission.quantity}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirm(false)}>Cancel</Button>
            <Button onPress={handleSubmit}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
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
  input: {
    marginBottom: 15
  },
  button: {
    marginTop: 10
  },
  confirmText: {
    marginTop: 10,
    opacity: 0.7
  }
});

export default ProductSubmissionScreen; 