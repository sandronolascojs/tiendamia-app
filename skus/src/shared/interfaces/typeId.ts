export type typeId<TKey extends number | string, TValue> = {
  [key in TKey]: TValue;
};
