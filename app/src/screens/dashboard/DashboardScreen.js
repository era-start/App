import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl 
} from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar,
  useTheme,
  Divider
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DashboardScreen = () => {
  const { user } = useSelector(state => state.auth);
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const isProductBased = user?.type === 'product-based';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch updated data here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statContent}>
        <Icon name={icon} size={24} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title>Welcome, {user?.name}</Title>
          <Paragraph>Employee ID: {user?.id}</Paragraph>
        </Card.Content>
      </Card>

      {isProductBased ? (
        <View>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Product Progress</Title>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text>Completed Products</Text>
                  <Text>75%</Text>
                </View>
                <ProgressBar progress={0.75} color={theme.colors.primary} />
              </View>
              
              <View style={styles.statsContainer}>
                <StatCard 
                  title="Assigned"
                  value="15"
                  icon="package-variant"
                  color={theme.colors.primary}
                />
                <StatCard 
                  title="Completed"
                  value="12"
                  icon="check-circle"
                  color={theme.colors.success}
                />
                <StatCard 
                  title="Pending"
                  value="3"
                  icon="clock"
                  color={theme.colors.warning}
                />
              </View>
            </Card.Content>
          </Card>
        </View>
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Attendance Summary</Title>
            <View style={styles.statsContainer}>
              <StatCard 
                title="Present"
                value="22"
                icon="calendar-check"
                color={theme.colors.success}
              />
              <StatCard 
                title="Half Day"
                value="2"
                icon="calendar-clock"
                color={theme.colors.warning}
              />
              <StatCard 
                title="Absent"
                value="1"
                icon="calendar-remove"
                color={theme.colors.error}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Salary Overview</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.salaryRow}>
            <Text>Basic Salary</Text>
            <Text>₹{user?.salary || 0}</Text>
          </View>
          
          <View style={styles.salaryRow}>
            <Text>Advances</Text>
            <Text style={{ color: theme.colors.error }}>
              -₹{user?.advances || 0}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.salaryRow}>
            <Text style={styles.boldText}>Net Payable</Text>
            <Text style={styles.boldText}>
              ₹{(user?.salary || 0) - (user?.advances || 0)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15
  },
  welcomeCard: {
    marginBottom: 15
  },
  card: {
    marginBottom: 15
  },
  progressContainer: {
    marginVertical: 15
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderLeftWidth: 4
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statText: {
    marginLeft: 10
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.7
  },
  divider: {
    marginVertical: 10
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  boldText: {
    fontWeight: 'bold'
  }
});

export default DashboardScreen; 