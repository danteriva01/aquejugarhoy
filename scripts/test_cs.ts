async function run() {
  const url = `https://store.steampowered.com/api/appdetails?appids=42960&filters=price_overview,basic&cc=us`;
  const res = await fetch(url);
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
run();
export {};
