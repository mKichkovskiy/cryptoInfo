import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
} from '@rainbow-me/animated-charts'
import { useSharedValue } from 'react-native-reanimated'
import { formatDate } from '../services/cryptoService'

const { width: SIZE } = Dimensions.get('window')

const Chart = ({
  last_updated,
  currentPrice,
  logoUrl,
  name,
  symbol,
  priceChangePercentage7d,
  sparkline,
  market_cap,
}) => {
  const setMarketCap = (market_cap) => {
    const res = Number.parseInt(market_cap) / 1000000000
    return '$' + res.toString().slice(0, 7) + 'B'
  }

  const latestCurrentPrice = useSharedValue(currentPrice)
  const latestTime = useSharedValue(formatDate(last_updated))
  const [chartReady, setChartReady] = useState(false)
  const priceChangeColor = priceChangePercentage7d > 0 ? '#34C759' : '#FF3B30'
  useEffect(() => {
    latestCurrentPrice.value = currentPrice
    setTimeout(() => {
      setChartReady(true)
    }, 0)
  }, [currentPrice])

  const formatUSD = (value) => {
    'worklet'
    if (value === '') {
      const formattedValue = `$${latestCurrentPrice.value.toLocaleString(
        'en-US',
        { currency: 'USD' }
      )}`
      return formattedValue
    }

    const formattedValue = `$${parseFloat(value)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
    return formattedValue
  }

  const formatTime = (value) => {
    'worklet'
    if (value === '') {
      return `Last update ${latestTime.value}`
    }

    var a = new Date(
      (Number.parseInt(value) / 1000).toString().split('.')[0] * 1000
    )
    return a.toLocaleDateString() + ', ' + a.toLocaleTimeString()
  }

  if (sparkline.length === 0) {
    return <Text>Loading...</Text>
  }

  return (
    <ChartPathProvider
      data={{ points: sparkline, smoothingStrategy: 'bezier' }}
    >
      <View style={styles.chartWrapper}>
        {/* Titles */}
        <View style={styles.titlesWrapper}>
          <View style={styles.upperTitles}>
            <View style={styles.upperLeftTitle}>
              <Image source={{ uri: logoUrl }} style={styles.image} />
              <Text style={styles.subtitle}>
                {name} ({symbol.toUpperCase()})
              </Text>
            </View>
            <Text style={styles.subtitle}>7d</Text>
          </View>
          <View style={styles.lowerTitles}>
            <ChartYLabel format={formatUSD} style={styles.boldTitle} />
            <Text style={[styles.title, { color: priceChangeColor }]}>
              {priceChangePercentage7d.toFixed(2)}%
            </Text>
          </View>
          <View>
            <ChartXLabel format={formatTime} />
          </View>
        </View>
        {/* побудова графіку */}
        {chartReady ? (
          <View style={styles.chartLineWrapper}>
            <ChartPath height={SIZE / 2} stroke="#bb86fc" width={SIZE} />
            <ChartDot style={{ backgroundColor: '#bb86fc' }} />
          </View>
        ) : null}
      </View>
      {/* market_cap */}
      <View style={styles.marketCapWrapper}>
        <Text style={styles.marketTitle}>Market Cap</Text>
        <Text style={[styles.subtitle, { marginTop: 5 }]}>
          {setMarketCap(market_cap)}
        </Text>
      </View>
    </ChartPathProvider>
  )
}

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 16,
  },
  titlesWrapper: {
    marginHorizontal: 16,
    color: '#dedede',
  },
  upperTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#dedede',
  },
  upperLeftTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#898989',
  },
  lowerTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#898989',
  },
  title: {
    fontSize: 18,
  },
  chartLineWrapper: {
    marginTop: 10,
    padding: 1,
    backgroundColor: '#1e1e1e',
  },
  marketCapWrapper: { marginLeft: 20 },
  marketTitle: { fontSize: 20, color: 'green' },
})

export default Chart
