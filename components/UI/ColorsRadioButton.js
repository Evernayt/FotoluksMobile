import React, { useState } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import { COLORS } from '../../constants';

const ColorsRadioButton = ({ params, parentId, setSelectedParams }) => {
  const [value, setValue] = useState('');

  const selectParam = param => {
    setValue(param.value);
    setSelectedParams(prevState => {
      return prevState.map(state =>
        state.featureId == parentId
          ? { ...state, paramId: param.id, paramValue: param.value }
          : state,
      );
    });
  };

  const renderColors = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          height: 46,
          width: 46,
          borderRadius: 24,
          borderWidth: value === item.value ? 3 : 2,
          borderColor: value === item.value ? COLORS.secondary : COLORS.border,
          backgroundColor: `#${item.value}`,
          marginRight: 10,
        }}
        onPress={() => selectParam(item)}
      />
    );
  };

  return (
    <FlatList
      data={params}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => `${item.id}`}
      renderItem={renderColors}
      contentContainerStyle={{
        paddingLeft: 24,
        paddingRight: 14,
      }}
    />
  );
};

export default ColorsRadioButton;
