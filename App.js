import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Button, Text, View, SafeAreaView, TextInput, Image, Modal,
  TouchableOpacity, TouchableWithoutFeedback, Keyboard, Switch
} from 'react-native';
import React, { useState } from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {

  const [current, setCurrent] = useState('Home');   // navigation
  const [searchText, setSearchText] = useState(''); // search bar
  // const [searchCategory, setSearchCategory] = useState('All'); // search bar
  // const [searchTime, setSearchTime] = useState(null); // events within 1 hour, 1 day, 1 week, 1 month, 1 year, all time
  const [search, setSearch] = useState({
    text: '',
    category: 'All',
    time: null,  // events within 1 hour, 1 day, 1 week, 1 month, 1 year, all time
  });
  const [poi, setPoi] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    public: false,
    location: { latitude: 32.88123691352959, longitude: -117.23760781304348 },  // G馆
    datetime: new Date((new Date()).getTime() + 1000 * 2 * 60 * 60),    // 2小时后
  });

  // ----------------- Fake Backend -----------------
  const [events, setEvents] = useState([]);
  // ------------------------------------------------

  const onPress = (e) => {
    console.log("onPress ++++++++");
    console.log(e.nativeEvent.coordinate);
    // console.log(e.placeId, e.name, e.coordinate);  // undefined x3 
    // 需要后端：(经度、纬度) --> 从已创建的events中找到最近的event(groups)。
    // If there's are event(s) here around, show them as popup(s)
    setPoi(e.nativeEvent);
  }


  const handleSearchTextChange = (text) => {
    // setSearchText(text);
    // console.log(searchText);
    setSearch({ ...search, text: text });
    console.log(search);

    // todo: send text to backend, receive matching events (async)
  }

  const handleCategoryChange = (category) => {
    // setSearchCategory(category);
    // console.log(searchCategory, category);
    setSearch({ ...search, category: category });
    console.log(search);

    // todo: filter events by category
  }

  const handleTimeChange = (timeFrame) => {
    setSearch({ ...search, timeFrame: timeFrame });
    console.log(search.timeFrame);
  }

  const submitForm = () => {
    // Check if form is valid
    if (form.title == '' || form.category == '') {
      alert('Your event must have a title and a category :)');
      return;
    }
    console.log('-----------submitForm-----------');
    console.log(form);
    console.log();

    // TODO: send form to backend
    setEvents([...events, form]);

    // If sent correctly, close modal, reset form
    setForm({
      title: '',
      description: '',
      category: '',
      public: false,
      location: { latitude: 32.88123691352959, longitude: -117.23760781304348 },  // G馆
      datetime: new Date((new Date()).getTime() + 1000 * 2 * 60 * 60),    // 2小时后
    });
    setModalVisible(false);
  }

  const HomeScreen = (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      {/* Search Component */}
      <View style={searchStyles.container}>
        <TextInput
          style={searchStyles.searchBar}
          value={searchText}
          placeholder="Search for events"
          onChangeText={handleSearchTextChange}
        />
        <View style={searchStyles.buttonContainer}>
          <TouchableOpacity
            style={search.category == 'All' ? { ...searchStyles.button, backgroundColor: '#D3F5E4' } : searchStyles.button}
            onPress={() => handleCategoryChange('All')}>
            <Text style={searchStyles.buttonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={search.category == 'Eat' ? { ...searchStyles.button, backgroundColor: '#FFD580' } : searchStyles.button}
            onPress={() => handleCategoryChange('Eat')}>
            <Text style={searchStyles.buttonText}>Eat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={search.category == 'Study' ? { ...searchStyles.button, backgroundColor: 'yellow' } : searchStyles.button}
            onPress={() => handleCategoryChange('Study')}>
            <Text style={searchStyles.buttonText}>Study</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={search.category == 'Hangout' ? { ...searchStyles.button, backgroundColor: 'green' } : searchStyles.button}
            onPress={() => handleCategoryChange('Hangout')}>
            <Text style={searchStyles.buttonText}>Hgout</Text>
          </TouchableOpacity>



        </View>
      </View>

      {/* Map Component */}
      <MapView style={styles.map}
        //template for region I guess
        initialRegion={{
          latitude: 32.8815919,
          longitude: -117.2379339,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={e => onPress(e)}>
        {poi && (
          <Marker coordinate={poi.coordinate}>
            <Callout>
              <View>
                <Text>Place Id: {poi.placeId}</Text>
                <Text>Name: {poi.name}</Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>



      {/* Create Event button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Create Event"
          color="white"
          onPress={() => setModalVisible(true)}

        ></Button>
      </View>

      {/* Create Event Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <BlurView style={{ flex: 1 }} intensity={60}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1 }}>
              <Text style={styles.title}> Create your event </Text>

              <Text style={styles.label}> Title </Text>
              <TextInput style={styles.input} placeholder="Event name"
                value={form.title}
                onChangeText={txt => setForm({ ...form, title: txt })} />

              <Text style={styles.labelSmall}> Description (optional) </Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="What this event is about/ how to find it"
                value={form.description}
                onChangeText={txt => setForm({ ...form, description: txt })} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text style={styles.label}> Category </Text>
                <Text style={{ ...styles.labelSmall, marginRight: 30, }}> Public </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 30 }}>

                <TouchableOpacity
                  style={form.category == 'Food' ? { ...styles.button, backgroundColor: '#FFD580' } : styles.button}
                  onPress={e => setForm({ ...form, category: 'Food' })}>
                  <Text style={styles.buttonText}>Food</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={form.category == 'Study' ? { ...styles.button, backgroundColor: '#FFD580' } : styles.button}
                  onPress={e => setForm({ ...form, category: 'Study' })}>
                  <Text style={styles.buttonText}>Stdy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={form.category == 'Hangout' ? { ...styles.button, backgroundColor: '#FFD580' } : styles.button}
                  onPress={e => setForm({ ...form, category: 'Hangout' })}>
                  <Text style={styles.buttonText}>Hgout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={form.category == 'Other' ? { ...styles.button, backgroundColor: '#FFD580' } : styles.button}
                  onPress={e => setForm({ ...form, category: 'Other' })}>
                  <Text style={styles.buttonText}>Other</Text>
                </TouchableOpacity>

                <Switch
                  style={{ marginRight: 10, marginTop: 12, alignSelf: 'auto' }}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={form.public ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  value={form.public}
                  onValueChange={() => setForm({ ...form, public: !form.public })}
                />

              </View>

              <Text style={styles.label}> Location </Text>

              <TextInput style={styles.inputSmall} placeholder="Search for location" />


              <MapView
                style={styles.mapSmall}
                initialRegion={{ latitude: form.location.latitude, longitude: form.location.longitude, latitudeDelta: 0.0007, longitudeDelta: 0.0007, }}
              >
                <Marker
                  coordinate={form.location}
                >
                  <Image
                    source={require('./testdata/avatar1.jpeg')}
                    style={styles.avatar}
                  >
                  </Image>

                </Marker>
              </MapView>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 35 }}>

                <View>
                  <Text style={{ ...styles.label, marginLeft: 0, marginBottom: 3 }}>Date</Text>
                  <DateTimePicker
                    testID="datePicker"
                    value={form.datetime}
                    onChange={(e, selectedDate) => { setForm({ ...form, datetime: selectedDate }); }}
                    mode={'date'}
                    display="compact"
                    style={{ marginRight: 30, maxWidth: 300 }}
                  />

                </View>


                <View>
                  <Text style={{ ...styles.label, marginLeft: 0, marginBottom: 3 }}>Time</Text>
                  <DateTimePicker
                    testID="timePicker"
                    value={form.datetime}
                    onChange={(e, selectedDate) => setForm({ ...form, datetime: selectedDate })}
                    mode={'time'}
                    display="compact"
                    style={{ marginRight: 50, maxWidth: 200, position: 'fixed' }}
                  />
                </View>

              </View>


              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20 }}>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ ...styles.controlButton, backgroundColor: '#5CC392' }}
                  onPress={submitForm}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white' }}>Create</Text>
                </TouchableOpacity>

              </View>

            </SafeAreaView>
          </TouchableWithoutFeedback>
        </BlurView>
      </Modal>
    </View>




  );

  return HomeScreen


}

const searchStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '8%',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  searchBar: {
    backgroundColor: 'white',
    height: 40,
    width: '85%',
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    borderColor: '#F3F3F3',
    borderWidth: 2,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  buttonHighlighted: {
    backgroundColor: '#D3F5E4',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 12,
  },
})

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'orange',
  },
  title: {
    fontSize: 37,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'left',
    marginLeft: 30,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventPost: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'left',
    marginLeft: 30,

    fontSize: 19,
  },
  labelSmall: {
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'left',
    marginLeft: 30,

    fontSize: 15,
  },
  input: {
    // width: 300,
    height: 40,
    marginHorizontal: 30,
    marginTop: 5,
    paddingHorizontal: 20,
    // borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'stretch',

    backgroundColor: '#fff',
    borderColor: 'green',


    fontSize: 19,
  },
  inputSmall: {
    height: 35,
    marginHorizontal: 30,
    marginTop: 5,
    paddingHorizontal: 20,
    // borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'stretch',

    backgroundColor: '#fff',
    borderColor: 'green',

    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,

  },
  buttonHighlighted: {
    backgroundColor: '#FFD580',
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  mapSmall: {
    height: 180,
    marginVertical: 10,
    marginHorizontal: 30,
  },

  controlButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 35,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Create Event button
  buttonContainer: {
    backgroundColor: '#5CC399',
    padding: 10,
    width: 235,
    height: 77,
    position: 'absolute',
    top: 721,
    left: 78,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
  }
});

const GMapSearchBarStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,

  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
  },
  listView: {
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    elevation: 1,
    zIndex: 1,
  },
  poweredContainer: {
    height: 0,
    opacity: 0,
  },
});