import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, StyleSheet, Text, FlatList } from 'react-native'
import ListHeader from './ListHeader'
import ListItem from './ListItem'

import { getMarketData } from '../services/cryptoService'

function Search() {
  // ввод значення
  const [value, setValue] = useState('')

  // list
  const [data, setData] = useState([])

  const fetchMarketData = async () => {
    const marketData = await getMarketData()
    setData(marketData)
  }

  useEffect(() => {
    fetchMarketData()
  }, [])

  const handleSearch = (data) =>
    data.filter((row) => row.name.toLowerCase().indexOf(value) > -1)

  return (
    <View style={styles.searchWrapper}>
      <ListHeader search={false} />
      <View style={styles.inputWrapper}>
        <Text style={styles.inputTitle}>SEARCH</Text>
        <TextInput
          style={styles.input}
          defaultValue={value}
          onChangeText={(e) => setValue(e)}
        />
      </View>
      {value.length === 0 ? (
        <View style={styles.noText}>
          <Text style={styles.noTextTitle}>Enter Text!</Text>
        </View>
      ) : (
        <FlatList
          keyExtractor={(item) => item.id}
          data={handleSearch(data)}
          renderItem={({ item }) => (
            <ListItem
              market_cap={item.market_cap}
              name={item.name}
              symbol={item.symbol}
              currentPrice={item.current_price}
              priceChangePercentage7d={
                item.price_change_percentage_7d_in_currency
              }
              logoUrl={item.image}
              onPress={null}
            />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchWrapper: {
    flex: 1,
    backgroundColor: '#121212',
  },
  inputWrapper: {
    marginHorizontal: 16,
    marginTop: 30,
  },
  inputTitle: {
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
    textAlign: 'center',
  },
  noText: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noTextTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default Search
