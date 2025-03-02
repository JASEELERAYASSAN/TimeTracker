import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { storeTimer, getTimers } from '../utils/storage';
import TimerCard from '../components/TimeCard';
import { Dropdown } from 'react-native-element-dropdown';

const categories = [
    { label: 'Workout', value: 'Workout' },
    { label: 'Study', value: 'Study' },
    { label: 'Break', value: 'Break' },
];

const Home = () => {
    const [timers, setTimers] = useState([]);
    const [timerName, setTimerName] = useState('');
    const [timerDuration, setTimerDuration] = useState('');
    const [timerCategory, setTimerCategory] = useState('');
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchTimers();
    }, []);

    const fetchTimers = async () => {
        const storedTimers = await getTimers();
        setTimers(storedTimers || []);
    };    

    const handleAddTimer = async () => {
        if (!timerName || !timerDuration || !timerCategory) return;

        const newTimer = {
            name: timerName,
            duration: parseInt(timerDuration),
            category: timerCategory,
            status: 'Paused',
            remainingTime: parseInt(timerDuration),
        };

        await storeTimer(newTimer);
        setTimerName('');
        setTimerDuration('');
        setTimerCategory('');
        setModalVisible(false);
        fetchTimers();
    };

    const groupedTimers = timers.reduce((acc, timer) => {
        if (!acc[timer.category]) acc[timer.category] = [];
        acc[timer.category].push(timer);
        return acc;
    }, {});

    const toggleCategory = (category) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleBulkAction = async (category, action) => {
        const updatedTimers = timers.map(timer => {
            if (timer.category === category) {
                if (action === 'start') {
                    return { ...timer, status: 'Running' };
                } else if (action === 'pause') {
                    return { ...timer, status: 'Paused' };
                } else if (action === 'reset') {
                    return { ...timer, status: 'Paused', remainingTime: timer.duration };
                }
            }
            return timer;
        });
        setTimers(updatedTimers);
        await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    };    

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Timer</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Timer</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Name"
                            placeholderTextColor="#bbb"
                            value={timerName}
                            onChangeText={setTimerName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Duration (Seconds)"
                            placeholderTextColor="#bbb"
                            keyboardType="numeric"
                            value={timerDuration}
                            onChangeText={setTimerDuration}
                        />
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            containerStyle={styles.dropdownContainer}
                            itemTextStyle={styles.itemTextStyle}
                            data={categories}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Category"
                            value={timerCategory}
                            onChange={(item) => setTimerCategory(item.value)}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddTimer}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={Object.keys(groupedTimers)}
                keyExtractor={(category) => category}
                renderItem={({ item: category }) => (
                    <View>
                        <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.header}>
                            <Text style={styles.headerText}>{category}</Text>
                            <View style={styles.bulkButtonContainer}>
                                <TouchableOpacity onPress={() => handleBulkAction(category, 'start')} style={styles.bulkButton}>
                                    <Text style={styles.bulkButtonText}>Start</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleBulkAction(category, 'pause')} style={styles.bulkButton}>
                                    <Text style={styles.bulkButtonText}>Pause</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleBulkAction(category, 'reset')} style={styles.bulkButton}>
                                    <Text style={styles.bulkButtonText}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        {!collapsedCategories[category] &&
                            groupedTimers[category].map((timer) => (
                                <TimerCard key={timer.name} timer={timer} setTimers={setTimers} timers={timers} />
                            ))
                        }
                    </View>
                )}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E1E1E',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#333',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 5,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    toggleText: {
        fontSize: 18,
        color: '#FFF',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 15,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#555',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#333',
        marginBottom: 10,
        fontSize: 16,
        color: '#FFF',
    },
    dropdown: {
        height: 50,
        borderColor: '#555',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#333',
        marginBottom: 15,
        justifyContent: 'center',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#bbb',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
    dropdownContainer: {
        backgroundColor: '#444',
        borderRadius: 8,
    },
    itemTextStyle: {
        fontSize: 16,
        color: '#FFF',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bulkButtonContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    bulkButton: {
        backgroundColor: '#555',
        padding: 5,
        borderRadius: 5,
    },
    bulkButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },

});