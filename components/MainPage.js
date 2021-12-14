import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  View,
  Text,
  Picker,
} from 'react-native'
import ListItem from './ListItem'
import Chart from './Chart'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { getMarketData } from '../services/cryptoService'
import ListHeader from './ListHeader'

function MainPage() {
  // data coiniv
  const [data, setData] = useState([])

  //
  const [selectedCoinData, setSelectedCoinData] = useState(null)

  // state для фільру
  const [selectedValue, setSelectedValue] = useState('')

  // загрузка з коин геко
  const fetchMarketData = async () => {
    const marketData = await getMarketData()
    setData(marketData)
  }
  // після запуску
  useEffect(() => {
    fetchMarketData()
  }, [])

  // sort po selectedValue
  useEffect(() => {
    if (selectedValue === 'default') {
      handleChangeDef()
    }
    if (selectedValue === 'high') {
      handleChangeHight()
    }
    if (selectedValue === 'low') {
      handleChangeLow()
    }
  }, [selectedValue])
  // [значення] - відлідковує значенням

  const bottomSheetModalRef = useRef(null)

  const snapPoints = useMemo(() => ['55%'], [])

  const openModal = (item) => {
    setSelectedCoinData(item)
    bottomSheetModalRef.current?.present()
  }

  const handleChangeLow = useCallback(async () => {
    Alert.alert('Data changed to low!') // alert modal
    const marketData = await getMarketData()
    setData(marketData.sort((a, b) => a.current_price - b.current_price))
  }, [])

  const handleChangeHight = useCallback(async () => {
    Alert.alert('Data changed to hight!')
    const marketData = await getMarketData()
    setData(
      marketData.sort((a, b) => a.current_price - b.current_price).reverse()
    )
  }, [])

  const handleChangeDef = useCallback(async () => {
    Alert.alert('Data changed to default!')
    const marketData = await getMarketData()
    setData(marketData)
  }, [])

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <ListHeader search={true} />
        <View style={styles.fixToText}>
          <Text style={styles.price}>Price:</Text>
          {/* кнопки для фільтру */}
          <Picker
            style={{
              height: 50,
              width: '100%',
              color: '#324797',
            }}
            selectedValue={selectedValue}
            onValueChange={(value) => setSelectedValue(value)}
          >
            <Picker.Item label="Default" value="default" />
            <Picker.Item label="High" value="high" />
            <Picker.Item label="Low" value="low" />
          </Picker>
        </View>
        <View style={styles.divider} />

        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
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
          ListHeaderComponent={<></>}
        />
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
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginHorizontal: 16,
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dedede',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 10,
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
  moon: {
    marginRight: 3,
    width: 35,
    height: 35,
  },
  fixToText: {
    marginTop: 10,
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: { color: '#fff', fontSize: 16 },
})

export default MainPage
