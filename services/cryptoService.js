import axios from 'axios'
import moment from 'moment'

export const formatDate = (date) => moment(date).format('HH:mm, MMM D, YYYY')

const formatSparkline = (numbers) => {
  let formattedSparkline = numbers.map((item) => {
    console.log(item[0])
    return {
      x: item[0],
      y: item[1],
    }
  })

  return formattedSparkline
}

export const formatMarketData = (item, spark) => {
  const formattedItem = {
    ...item,
    sparkline_in_7d: {
      price: formatSparkline(spark),
    },
  }

  return formattedItem
}

export const getMarketData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d'
    )
    const data = response.data
    return data
  } catch (error) {
    console.log(error.message)
  }
}

export const getCoinHistoryPrice = async (id) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
    )
    const data = response.data
    return data
  } catch (error) {
    console.log(error.message)
  }
}
