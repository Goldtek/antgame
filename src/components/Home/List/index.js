import React, {useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import Store from './store';
import AntCard from '../AntCard.js/index.js';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

import {useQuery} from '@apollo/react-hooks';
import {Spinner} from '../../../custom';
import {GET_ALL_ANTS} from './query';

const List = () => {
  const [state, setState] = useState({
    loading: false,
    ants: [],
    calculating: false,
    antsListStatus: 'Care to make a Blind Bet?',
    err: {},
  });
  const calculated = 0;

  const {data: antsData} = useQuery(GET_ALL_ANTS);
  const atDetails = antsData?.ants;

  const calculateOdds = () => {
    let promises = [];
    let newState = {...state};
    let ants = state.ants;

    setState({
      calculated: true,
      antsListStatus: 'Calculating...',
    });

    // Loop through ants to create promises
    ants.forEach((ant, index) => {
      // promise returns ant with likelihood
      const tinyPromise = new Promise((res, rej) => {
        generateAntWinLikelihoodCalculator()(res);
      }).then(likelihood => {
        // make an ant with likelihood and return it
        let newAnt = {...ant};

        newAnt.winLikelihood = Math.round(likelihood * 100);
        newAnt.status = 'complete';

        newState.ants[index] = newAnt;

        setState({
          ants: newState.ants,
          antsListStatus: 'The Morning Line is in',
          calculated: true,
        });
        return newAnt;
      });

      promises.push(tinyPromise);
    });

    Promise.all(promises).then(antsWithLikelihood => {
      setState({ants: antsWithLikelihood});
    });
  };

  const generateAntWinLikelihoodCalculator = () => {
    const delay = 7000 + Math.random() * 7000;
    const likelihoodOfAntWinning = Math.random();

    return callback => {
      setTimeout(() => {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  };

  const reorderByWinLikelihood = antsObj => {
    let antsArr = [];
    Object.keys(antsObj).forEach(idx => {
      antsArr.push(antsObj[idx]);
    });

    let bla = Object.values(antsObj);

    antsArr.sort(function (a, b) {
      return b.winLikelihood - a.winLikelihood;
    });

    let newAntsObj = {};
    for (let i = 0; i < antsArr.length; i++) {
      newAntsObj[i] = antsArr[i];
    }
    return newAntsObj;
  };

  const reset = () => {
    const ants = state.ants;
    Object.keys(ants).forEach(idx => {
      ants[idx].winLikelihood = 0;
    });

    setState({
      ants: ants,
      calculating: false,
      calculated: false,
    });
    //fetch aants
  };

  const _renderItem = ({item}) => {
    let backgroundColor = item.selected ? '#000' : '#feffea';
    console.log('item', item);
    // return (
    //   <AntCard
    //     ant={item}
    //     checkMarkStyle={{backgroundColor}}
    //     onPress={ant => {
    //       // Objective: find the ant item, make it selected
    //       if (ant.selected) {
    //         let ants = state.ants;
    //         ants.forEach((a, index) => {
    //           // change object in array
    //           // replace array with new array
    //           if (a.name === ant.name) {
    //             // if a match... replace it
    //             a.selected = false;
    //             ants[index] = a;
    //             setState({ants});
    //             // this.props.selectedAnt(ants);
    //           }
    //         });
    //       } else {
    //         let ants = state.ants;
    //         ants.forEach((a, index) => {
    //           // change object in array
    //           // replace array with new array
    //           if (a.name === ant.name) {
    //             // if a match... replace it
    //             a.selected = true;
    //             ants[index] = a;
    //           } else {
    //             a.selected = false;
    //             ants[index] = a;
    //           }

    //           setState({ants});
    //           // this.props.selectedAnt(ants);
    //         });
    //       }
    //     }}
    //   />
    // );
  };

  const _keyExtractor = (item: Ant, index: number) => item.name;

  const renderAnts = () => {
    const {antsListStatus, ants} = state;

    let orderedAnts = ants.sort((a, b) => {
      return b.winLikelihood - a.winLikelihood;
    });

    if (!orderedAnts || orderedAnts.length < 1) {
      return (
        <View style={{alignSelf: 'center', marginTop: moderateScale(30)}}>
          <Text>There's a 5 ant pileup on the track</Text>
        </View>
      );
    }

    return (
      <View style={{marginTop: moderateScale(10)}}>
        <Text style={styles.statusText}>{antsListStatus}</Text>
        {/* {this.renderLoading()} */}
        <FlatList
          data={orderedAnts}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
        />
      </View>
    );
  };

  const renderLoading = () => {
    if (state.calculating) {
      return (
        <View
          style={{
            marginTop: moderateScale(35),
          }}>
          <Spinner color="#787878" />
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderAnts()}</View>;
};

const styles = ScaledSheet.create({
  container: {
    flex: 3,
  },
  statusText: {
    fontSize: '24@ms',
    textAlign: 'center',
    fontFamily: 'DamascusMedium',
  },
});

export default List;
