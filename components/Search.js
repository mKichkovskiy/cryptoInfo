import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native'
import ListHeader from './ListHeader'
import ListItem from './ListItem'
import Chart from './Chart'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'

import {
  getCoinHistoryPrice,
  formatMarketData,
} from '../services/cryptoService'

import { getMarketData } from '../services/cryptoService'

function Search() {
  // ввод значення
  const [value, setValue] = useState('')

  // list
  const [data, setData] = useState([])

  // modal window states
  const [selectedCoinData, setSelectedCoinData] = useState(null)
  const bottomSheetModalRef = useRef(null)

  const snapPoints = useMemo(() => ['55%'], [])

  const fetchMarketData = async () => {
    const marketData = await getMarketData()
    setData(marketData)
  }

  // open modal and fetch data prices 7d
  const openModal = useCallback(
    async (item) => {
      await getCoinHistoryPrice(item.id).then((res) =>
        setSelectedCoinData(formatMarketData(item, res.prices))
      )
      bottomSheetModalRef.current?.present()
      return () => setSelectedCoinData(null)
    },
    [bottomSheetModalRef]
  )
  useEffect(() => {
    fetchMarketData()
    return () => setData([])
  }, [])

  const handleSearch = useCallback(
    (data) => {
      return data.filter((row) => row.name.toLowerCase().indexOf(value) > -1)
    },
    [value]
  )

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
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
          ) : handleSearch(data).length === 0 ? (
            <View style={styles.noText}>
              <Text style={styles.noTextTitle}>No coins!</Text>
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
                  onPress={() => openModal(item)}
                />
              )}
            />
          )}
        </View>
      </SafeAreaView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      >
        {/* перевірка данних графіку */}
        {selectedCoinData ? (
          <Chart
            last_updated={selectedCoinData.last_updated}
            market_cap={selectedCoinData.market_cap}
            currentPrice={selectedCoinData.current_price}
            logoUrl={selectedCoinData.image}
            name={selectedCoinData.name}
            symbol={selectedCoinData.symbol}
            priceChangePercentage7d={
              selectedCoinData.price_change_percentage_7d_in_currency
            }
            sparkline={selectedCoinData?.sparkline_in_7d.price}
          />
        ) : null}
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
