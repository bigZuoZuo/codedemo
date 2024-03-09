export const totalNumber = (val?: any) => {
  let number = 0;
  if (!val) {
    return 0;
  }
  for (const key in val) {
    if (
      [
        'machinery',
        'business',
        'computer',
        'tourist',
        'agronomy',
        'nursingProfession',
        'electrical',
        'constructionTechnology',
        'autoMaintenance',
        'preschoolEducation',
      ].includes(key)
    ) {
      number = number + (val[key] || 0) * 1;
    }
  }
  return number;
};
