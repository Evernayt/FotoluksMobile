const groupBy = (arr, key) => {
  const groupedArr = [];
  const reducedArr = arr.reduce((rv, x) => {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      rv.push({
        key: v,
        values: [x],
      });
    }

    return rv;
  }, []);

  for (let i = 0; i < reducedArr.length; i++) {
    groupedArr.push(reducedArr[i].values);
  }

  return groupedArr;
};

export default groupBy;
