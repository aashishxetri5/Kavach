//trims the name to fit the card
const truncateName = (name, maxLength = 20) => {
  console.log(name);
  return name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name;
};

export { truncateName };
