import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { CheckBox, Input, Button, Text } from '@rneui/themed';

export default function App() {
  const [tasks, setTasks] = useState([
    {
      key: '1',
      description: 'Finish portfolio homepage',
      completed: false,
      date: 'Mar 4',
    },
    {
      key: '2',
      description: 'Sketch gig poster concepts',
      completed: false,
      date: 'Mar 5',
    },
    {
      key: '3',
      description: 'Upload class assignment',
      completed: true,
      date: 'Mar 2',
    },
  ]);

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('All');

  const toggleTask = (key) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.key === key ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    const trimmedTask = newTask.trim();
    if (!trimmedTask) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const taskToAdd = {
      key: Date.now().toString(),
      description: trimmedTask,
      completed: false,
      date: formattedDate,
    };

    setTasks((prevTasks) => [taskToAdd, ...prevTasks]);
    setNewTask('');
  };

  const filteredTasks = useMemo(() => {
    let visibleTasks = tasks;

    if (filter === 'Active') {
      visibleTasks = tasks.filter((task) => !task.completed);
    } else if (filter === 'Completed') {
      visibleTasks = tasks.filter((task) => task.completed);
    }

    return [
      {
        key: 'spacer-row',
        description: '',
        completed: false,
        date: '',
        isSpacer: true,
      },
      ...visibleTasks,
    ];
  }, [tasks, filter]);

  const renderItem = ({ item }) => {
    if (item.isSpacer) {
      return <View style={{ height: 6 }} />;
    }

    return (
      <View style={styles.taskCard}>
        <CheckBox
          title={item.description}
          checked={item.completed}
          onPress={() => toggleTask(item.key)}
          checkedColor="#6f8466"
          uncheckedColor="#b8b8b8"
          containerStyle={styles.taskCheckRow}
          textStyle={[
            styles.taskText,
            item.completed && styles.completedTaskText,
          ]}
        />

        <View style={styles.pillRow}>
          <View style={styles.datePill}>
            <Text style={styles.pillText}>📅 {item.date}</Text>
          </View>

          <View
            style={[
              styles.statusPill,
              item.completed ? styles.completedPill : styles.activePill,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                item.completed
                  ? styles.completedPillText
                  : styles.activePillText,
              ]}
            >
              {item.completed ? '✓ Completed' : 'Active'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.brandRow}>
          <Text style={styles.sunIcon}>☼</Text>
          <View>
            <Text style={styles.brandTitle}>Daylist</Text>
            <Text style={styles.brandSubtitle}>
              gentle reminders for your day
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>TODAY</Text>

        <View style={styles.inputCard}>
          <Input
            placeholder="Add a new task"
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
          />
          <Button
            title="Add"
            onPress={addTask}
            buttonStyle={styles.addButton}
            titleStyle={styles.addButtonText}
          />
        </View>

        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          extraData={tasks}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={false}
        />

        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'All' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('All')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'All' && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'Active' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('Active')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'Active' && styles.filterTextActive,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'Completed' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('Completed')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'Completed' && styles.filterTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sunIcon: {
    fontSize: 28,
    color: '#d96d3a',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3f3027',
  },
  brandSubtitle: {
    fontSize: 15,
    color: '#6f6258',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6b5b4e',
    marginBottom: 12,
  },
  inputCard: {
    backgroundColor: '#fbf8f4',
    borderRadius: 26,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e7dacb',
  },
  inputWrapper: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    borderRadius: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd4c9',
    minHeight: 54,
  },
  inputText: {
    color: '#3f3027',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#d96d3a',
    borderRadius: 18,
    paddingVertical: 14,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 18,
  },
  taskCard: {
    backgroundColor: '#fbf8f4',
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e7dacb',
  },
  taskCheckRow: {
    padding: 0,
    margin: 0,
    marginBottom: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  taskText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#342922',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: '#8a8178',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginLeft: 40,
  },
  datePill: {
    backgroundColor: '#f7e6df',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#edd5cc',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  activePill: {
    backgroundColor: '#e8eadf',
    borderColor: '#d7dcc7',
  },
  completedPill: {
    backgroundColor: '#f5f1ed',
    borderColor: '#dfd7cf',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activePillText: {
    color: '#62724f',
  },
  completedPillText: {
    color: '#574c45',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#fbf8f4',
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e7dacb',
    marginTop: 8,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd4c9',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b5b4e',
  },
  filterTextActive: {
    color: '#342922',
  },
});
