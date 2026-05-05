async function test() {
  const name = "Cyberpunk 2077";
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(name)}&l=english&cc=us`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
