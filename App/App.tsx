import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  AsyncStorage
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import TaskList from "./src/components/TaskList";

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([]);

  const [input, setInput] = useState("");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem("@task");

      if (taskStorage) {
        setTask(JSON.parse(taskStorage));
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTasks() {
      await AsyncStorage.setItem("@task", JSON.stringify(task));
    }

    saveTasks();
  }, [task]);

  function handleAdd() {
    if (input === "") return;

    const data = {
      id: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    setInput("");
  }

  const handleDelete = useCallback(
    data => {
      const find = task.filter(r => r.id !== data.id);
      setTask(find);
    },
    [task]
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar backgroundColor="#171d31" barStyle="light-content" />

      <View>
        <Text style={s.title}>Minhas tarefas</Text>
      </View>

      <FlatList
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TaskList data={item} handleDelete={handleDelete} />
        )}
      />

      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={s.modal}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons
                name="md-arrow-back"
                size={40}
                color="#fff"
                style={{ marginLeft: 5, marginRight: 5 }}
              />
            </TouchableOpacity>
            <Text style={s.modalTitle}>Nova tarefa</Text>
          </View>

          <Animatable.View
            animation="fadeInUp"
            useNativeDriver
            style={s.modalBody}
          >
            <TextInput
              placeholder="O que precisa para hoje?"
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              value={input}
              onChangeText={text => setInput(text)}
              style={s.input}
            />

            <TouchableOpacity onPress={handleAdd} style={s.handleAdd}>
              <Text style={{ fontSize: 20 }}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <AnimatedBtn
        onPress={() => setOpen(true)}
        useNativeDriver
        animation="bounceInUp"
        duration={1500}
        style={s.fab}
      >
        <Ionicons name="ios-add" size={35} color="#fff" />
      </AnimatedBtn>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171d31"
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 25,
    textAlign: "center",
    color: "#fff"
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#0094ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    right: 25,
    bottom: 26,
    elevation: 3,
    zIndex: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  modal: {
    flex: 1,
    backgroundColor: "#171d31"
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 23,
    color: "#fff"
  },
  modalBody: {
    marginTop: 15
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 5,
    height: 85,
    textAlignVertical: "top",
    color: "#000",
    borderRadius: 5
  },
  handleAdd: {
    backgroundColor: "#fff",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    height: 40,
    borderRadius: 5
  }
});
