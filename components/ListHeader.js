import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { Link } from 'react-router-native'

function ListHeader({ search }) {
  return (
    <>
      <View style={styles.titleWrapper}>
        <View style={styles.logoWrapper}>
          {!search && (
            //лінка на головну
            <Link to="/">
              <Image
                style={styles.moon}
                source={require('../assets/backIcon.png')}
              />
            </Link>
          )}
          <Image style={styles.moon} source={require('../assets/moon.png')} />
          <Text style={styles.largeTitle}>CryptoPriceTracker</Text>
        </View>
        <View>
          {search && (
            <Link to="/search">
              <Image
                style={styles.moon}
                source={require('../assets/serchIcon.png')}
              />
            </Link>
          )}
        </View>
      </View>
      <View style={styles.divider} />
    </>
  )
}

const styles = StyleSheet.create({
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
  moon: {
    marginRight: 3,
    width: 35,
    height: 35,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default ListHeader
