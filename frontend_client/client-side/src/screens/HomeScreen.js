import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenseSummary } from '../store/slices/expenseSlice';
import { logout } from '../store/slices/authSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { summary } = useSelector(state => state.expenses);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchExpenseSummary());
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => dispatch(logout()) },
      ]
    );
  };

  const categories = [
    { name: 'Food', color: '#FF6B6B' },
    { name: 'Transport', color: '#4ECDC4' },
    { name: 'Entertainment', color: '#FFD166' },
    { name: 'Utilities', color: '#06D6A0' },
    { name: 'Healthcare', color: '#118AB2' },
    { name: 'Shopping', color: '#073B4C' },
    { name: 'Other', color: '#9D4EDD' },
  ];

  const totalExpenses = Object.values(summary).reduce((sum, amount) => sum + amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Expenses</Text>
          <Text style={styles.totalAmount}>
            ${totalExpenses.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {categories.map(category => {
          const amount = summary[category.name] || 0;
          const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
          
          return (
            <View key={category.name} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View 
                    style={[styles.colorDot, { backgroundColor: category.color }]} 
                  />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>
                  ${amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      backgroundColor: category.color,
                      width: `${percentage}%`
                    }
                  ]} 
                />
              </View>
              <Text style={styles.percentage}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          );
        })}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Expenses')}
          >
            <Text style={styles.actionButtonText}>View All Expenses</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate('AddExpense')}
          >
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
              Add New Expense
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  percentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  actions: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#fff',
  },
});

export default HomeScreen;