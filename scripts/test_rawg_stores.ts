async function run() {
  const res = await fetch("https://api.rawg.io/api/games?key=f92e6b1eb2bd45a382da698ccd1b5507&page_size=1");
  const json = await res.json();
  console.log(JSON.stringify(json.results[0].stores, null, 2));
}
run();
export {};
