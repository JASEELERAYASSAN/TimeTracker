import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { getCompletedTimers } from '../utils/storage';

const History = () => {
  const [completedTimers, setCompletedTimers] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getCompletedTimers();
      setCompletedTimers(history);
    };
    fetchHistory();
  }, []);

  const handleCopyToClipboard = () => {
    if (completedTimers.length === 0) {
      Alert.alert("No Data", "There are no completed timers to export.");
      return;
    }

    const jsonData = JSON.stringify(completedTimers, null, 2);
    Clipboard.setString(jsonData);

    Alert.alert("Copied!", "Timer data has been copied to clipboard. Paste it anywhere.");
  };

  return (
    <View style={styles.container}>
      {completedTimers.length === 0 ? (
        <Text style={styles.emptyText}>No completed timers yet.</Text>
      ) : (
        <FlatList
          data={completedTimers}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <View style={styles.timerCard}>
              <Text style={styles.timerName}>{item.name}</Text>
              <Text style={styles.timerTime}>
                Completed on: {new Date(item.completionTime).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}

      <Button title="Export Timer Data" onPress={handleCopyToClipboard} color="#4CAF50" />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#BBB',
    marginTop: 50,
    marginBottom: 50,
    fontWeight: '500',
  },
  timerCard: {
    backgroundColor: '#292929',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  timerTime: {
    fontSize: 16,
    color: '#CCC',
  },
});
