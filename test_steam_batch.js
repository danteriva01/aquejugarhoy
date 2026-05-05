async function test() {
  const ids = "440,730";
  const url = `https://store.steampowered.com/api/appdetails?appids=${ids}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(Object.keys(data));
}

test();
