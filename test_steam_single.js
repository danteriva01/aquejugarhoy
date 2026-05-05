async function test() {
  const url = `https://store.steampowered.com/api/appdetails?appids=440`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
}
test();
