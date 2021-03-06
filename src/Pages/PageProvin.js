/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import MyStatusBar from '../Components/MyStatusBar';
import NavbarPage from '../Components/NavbarPage';
import SearchBar from '../Components/SearchBar';
import EmptyData from '../Components/EmptyData';
import { getDataProvinsi } from '../utils/ApiService';
import Icon from 'react-native-vector-icons/Entypo';

export default class PageProvin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fullData: [],
      text: '',
      isFetching: true,
    };
  }

  componentDidMount() {
    this.getDataProvinsi();
  }

  async getDataProvinsi() {
    await getDataProvinsi()
      .then(response => {
        this.setState({ data: response.data, fullData: response.data, isFetching: false });
      })
      .catch(error => console.log(error));
  }

  onRefresh = () => {
    this.setState({ isFetching: true });
    setTimeout(() => {
      this.getDataProvinsi();
    }, 1000);
  };

  handleSearch = text => {
    const query = text.trim().toLowerCase();
    const data = this.state.fullData;
    const newData = data.filter(q => {
      return q.provinsi.toLowerCase().match(query);
    });
    this.setState({ data: newData, text: text });
  };

  renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View>
          <Text style={{ fontSize: 14, color: '#E5DDDD' }}>{item.provinsi}</Text>
          <Text style={{ fontSize: 13, color: '#FC7302' }}>Positif: {item.kasusPosi}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 140 }}>
            <Text style={{ fontSize: 13, color: '#04AD95' }}>Sembuh: {item.kasusSemb}</Text>
            <Text style={{ fontSize: 13, color: '#F82449' }}>Meninggal: {item.kasusMeni}</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
          }}>
          <Icon name="info-with-circle" color="#048AD6" size={20} />
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#171B1E' }}>
        <MyStatusBar />
        <NavbarPage title="Provinsi" />
        <View>
          <SearchBar onChangeText={this.handleSearch} placeholder="Search" />
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 150,
            }}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            keyExtractor={item => item.fid.toString()}
            data={this.state.data}
            renderItem={this.renderItem}
          />
          {this.state.data.length === 0 && !this.state.isFetching && <EmptyData />}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1B232F',
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    height: 60,
  },
});
