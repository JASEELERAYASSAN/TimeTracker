import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { storeTimer, storeCompletedTimer } from '../utils/storage';
import ProgressBar from 'react-native-progress/Bar';

const TimerCard = ({ timer, setTimers, timers }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [status, setStatus] = useState(timer.status);
  const [halfwayAlertTriggered, setHalfwayAlertTriggered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let interval;
    if (status === 'Running') {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStatus('Completed');
            setShowModal(true);
            storeCompletedTimer({ name: timer.name, completionTime: Date.now() });
            return 0;
          }
          
          const newTime = prev - 1;

          // Halfway alert
          if (!halfwayAlertTriggered && newTime === Math.floor(timer.duration / 2)) {
            setHalfwayAlertTriggered(true);
            Alert.alert("Halfway Alert", `${timer.name} has reached the halfway mark!`);
          }

          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, halfwayAlertTriggered]);

  const handleStart = () => {
    setStatus('Running');
    setHalfwayAlertTriggered(false);
    updateTimerStatus('Running');
  };

  const handlePause = () => {
    setStatus('Paused');
    updateTimerStatus('Paused');
  };

  const handleReset = () => {
    setRemainingTime(timer.duration);
    setStatus('Paused');
    setHalfwayAlertTriggered(false);
    setShowModal(false);
    updateTimerStatus('Paused');
  };

  const updateTimerStatus = (newStatus) => {
    setTimers(timers.map((t) => {
      if (t.name === timer.name) {
        t.status = newStatus;
        t.remainingTime = remainingTime;
      }
      return t;
    }));
    storeTimer(timers.find((t) => t.name === timer.name));
  };

  const progress = 1 - remainingTime / timer.duration;
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.timerName}>{timer.name}</Text>
      <Text style={styles.timeText}>{remainingTime} seconds remaining</Text>

      <ProgressBar
        progress={progress}
        width={null}
        height={10}
        color="#4caf50"
        unfilledColor="#e0e0e0"
        borderWidth={0}
        style={{ marginTop: 10 }}
      />
      <Text style={styles.percentageText}>{percentage}% completed</Text>

      {status === 'Completed' && <Text style={styles.completedText}>Completed</Text>}

      <View style={styles.buttonContainer}>
        {status === 'Paused' && <Button title="Start" onPress={handleStart} color="#4CAF50" />}
        {status === 'Running' && <Button title="Pause" onPress={handlePause} color="#FF9800" />}
        <Button title="Reset" onPress={handleReset} color="#F44336" />
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Timer Completed!</Text>
            <Text style={styles.modalText}>{timer.name} has finished!</Text>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  timerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  percentageText: {
    fontSize: 14,
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 5,
  },
  completedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimerCard;