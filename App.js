import React from 'react';
import { View} from 'react-native';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {Navigator} from './src/lib/appNavigator';
import Home from './src/components/Home';

const client = new ApolloClient({
  uri: 'https://sg-ants-server.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
};

export default App;
